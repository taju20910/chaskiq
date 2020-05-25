# frozen_string_literal: true
require "dummy_name"

class App < ApplicationRecord
  include GlobalizeAccessors
  include Tokenable

  store :preferences, accessors: %i[
    active_messenger
    domain_url
    theme
    email_requirement
    inbound_settings
    lead_tasks_settings
    user_tasks_settings
    timezone
    reply_time
    team_schedule
    gather_social_data
    customization_colors
    outgoing_email_domain
    register_visits
    custom_fields
    enable_articles_on_widget
    inline_new_conversations
  ], coder: JSON

  translates :greetings, :intro, :tagline
  globalize_accessors attributes: %i[
    greetings
    intro
    tagline
  ]

  # http://nandovieira.com/using-postgresql-and-jsonb-with-ruby-on-rails
  # App.where('preferences @> ?', {notifications: true}.to_json)

  has_many :app_users
  has_many :external_profiles, through: :app_users 
  has_many :bot_tasks
  has_many :visits, through: :app_users

  has_many :app_package_integrations
  has_many :app_packages, through: :app_package_integrations

  has_one :article_settings, class_name: 'ArticleSetting', dependent: :destroy
  has_many :articles
  has_many :article_collections
  has_many :sections, through: :article_collections

  has_many :conversations
  has_many :conversation_parts, through: :conversations, source: :messages
  has_many :segments

  has_many :roles
  has_many :agents, through: :roles
  has_many :campaigns
  has_many :user_auto_messages
  has_many :tours
  has_many :messages

  has_many :assignment_rules

  has_many :outgoing_webhooks

  has_one_attached :logo

  before_create :set_defaults
  after_create :create_agent_bot, :init_app_segments

  accepts_nested_attributes_for :article_settings

  validates :name, presence: true
  validates :domain_url, presence: true

  def agent_bots
    agents.where('bot =?', true)
  end

  def encryption_enabled?
    encryption_key.present?
  end

  def config_fields
    [
      {
        name: 'name',
        type: 'string',
        grid: { xs: 'w-full', sm: 'w-full' }
      },

      {
        name: 'domainUrl',
        type: 'string',
        grid: { xs: 'w-full', sm: 'w-1/2' }
      },

      {
        name: 'outgoingEmailDomain',
        type: 'string',
        grid: { xs: 'w-full', sm: 'w-1/2' }
      },

      {
        name: 'enable_articles_on_widget',
        type: 'string',
        grid: { xs: 'w-full', sm: 'w-1/2' }
      },

      {
        name: 'state',
        type: 'select',
        grid: { xs: 'w-full', sm: 'w-1/2' },
        options: %w[enabled disabled]
      },

      { name: 'activeMessenger',
        type: 'bool',
        grid: { xs: 'w-full', sm: 'w-1/2' } },

      {
        name: 'theme',
        type: 'select',
        options: %w[dark light],
        grid: { xs: 'w-full', sm: 'w-1/2' }
      },

      {
        name: 'encryptionKey',
        type: 'string',
        maxLength: 16, minLength: 16,
        placeholder: 'leave it blank for no encryption',
        grid: { xs: 'w-full', sm: 'w-full' }
      },

      { name: 'tagline',
        type: 'text',
        hint: 'messenger text on botton',
        grid: { xs: 'w-full', sm: 'w-full' } },

      { name: 'timezone', 
        type: 'timezone',
        options: ActiveSupport::TimeZone.all.map { |o| o.tzinfo.name },
        multiple: false,
        grid: { xs: 'w-full', sm: 'w-full' } }

    ]
  end

  def add_anonymous_user(attrs)
    session_id = attrs.delete(:session_id)

    next_id = DummyName::Name.new

    attrs.merge!(
      name: "visitor #{next_id}"
    ) unless attrs.dig(:properties, :name).present?

    ap = app_users.visitors.find_or_initialize_by(session_id: session_id)
    # ap.type = "Visitor"

    data = attrs.deep_merge!(properties: ap.properties)
    ap.assign_attributes(data)
    ap.generate_token
    ap.save
    ap
  end

  def add_user(attrs)
    email = attrs.delete(:email)
    # page_url = attrs.delete(:page_url)
    ap = app_users.find_or_initialize_by(email: email)
    data = attrs.deep_merge!(properties: ap.properties)
    ap.assign_attributes(data)
    if attrs[:last_visited_at].present?
      ap.last_visited_at = attrs[:last_visited_at]
    end
    ap.subscribe! unless ap.subscribed?
    ap.type = 'AppUser'
    ap.save
    ap
  end

  def add_agent(attrs, bot: nil)
    email = attrs.delete(:email)
    user = Agent.find_or_initialize_by(email: email)
    # user.skip_confirmation!
    if user.new_record?
      user.password = Devise.friendly_token[0, 20]
      user.save
    end

    role = roles.find_or_initialize_by(agent_id: user.id, role: role)
    data = attrs.deep_merge!(properties: user.properties)

    user.assign_attributes(data)
    user.bot = bot
    user.save

    # role.last_visited_at = Time.now
    role.save
    role
  end

  def add_bot_agent(attrs)
    add_agent(attrs, bot: true)
  end

  def create_agent_bot
    add_bot_agent(email: "bot@#{id}-chaskiq", name: 'chaskiq bot')
  end

  def add_admin(user)
    user.roles.create(app: self, role: 'admin')
    add_user(email: user.email)
  end

  def add_visit(opts = {})
    add_user(opts.merge(last_visited_at: Time.zone.now))
  end

  def start_conversation(options)
    message = options[:message]
    user = options[:from]
    participant = options[:participant] || user
    message_source = options[:message_source]

    conversation = conversations.create(
      main_participant: participant,
      initiator: user,
      assignee: options[:assignee]
    )

    conversation.add_message(
      from: user,
      message: message,
      message_source: message_source,
      check_assignment_rules: true
    )

    conversation.add_started_event
    conversation
  end

  def query_segment(kind)
    predicates = inbound_settings[kind]['predicates']
    segment = segments.new
    segment.assign_attributes(predicates: inbound_settings[kind]['predicates'])
    app_users = segment.execute_query.availables
  end

  def availability
    @biz ||= Biz::Schedule.new do |config|
      config.hours = hours_format
      config.time_zone = timezone
    end
  end

  def business_back_in(time)
    a = availability.time(0, :hours).after(time)
    diff = a - time
    days = diff.to_f / (24 * 60 * 60)
    { at: a, diff: diff, days: days }
  rescue Biz::Error::Configuration
    nil
  end

  def in_business_hours?(time)
    availability.in_hours?(time)
  rescue Biz::Error::Configuration
    nil
  end

  def generate_encryption_key
    self.encryption_key = SecureRandom.hex(8)
  end

  def find_app_package(name)
    app_package_integrations
      .joins(:app_package)
      .where('app_packages.name =?', name)
      .first
  end

  def stats_for(name)
    AppIdentity.new(key).send(name).get
  end

  def stats_counts_for(name)
    AppIdentity.new(key).send(name).get.values.first
  rescue StandardError
    nil
  end


  def logo_url
    return '' unless logo_blob.present?

    url = begin
            logo.variant(resize_to_limit: [100, 100]).processed
          rescue StandardError
            nil
          end
    return nil if url.blank?

    begin
      Rails.application.routes.url_helpers.rails_representation_url(
        url,
        only_path: false
      )
    rescue StandardError
      nil
    end
  end

  private

  def init_app_segments
    SegmentFactory.create_segments_for(self)
  end

  def set_defaults
    self.user_tasks_settings = {}
    self.lead_tasks_settings = {}
    self.inbound_settings = {
      enabled: true,
      users: {
        enabled: true,
        segment: 'all'
      },
      visitors: {
        enabled: true,
        segment: 'all'
      }
    }
    self.team_schedule = []
    generate_encryption_key if encryption_key.blank?
  end

  def hours_format
    h = {}
    arr = team_schedule || []
    arr.map do |f|
      h[f['day'].to_sym] = (h[f['day'].to_sym] || {}).merge!(f['from'] => f['to'])
    end
    h
  end

end
