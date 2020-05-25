export const APPS = `
query Apps{
  apps{
    key
    name
    state
    tagline
  }  
}
`;

export const APP = `
  query App($appKey: String!){
    app(key: $appKey) {
      encryptionKey
      key
      name
      preferences
      logo
      enableArticlesOnWidget
      inlineNewConversations
      timezone
      domainUrl
      activeMessenger
      theme
      translations
      availableLanguages
      teamSchedule
      replyTime
      customizationColors
      inboundSettings
      emailRequirement
      leadTasksSettings
      userTasksSettings
      gatherSocialData
      registerVisits
      domainUrl
      outgoingEmailDomain
      customFields
      segments {
        name
        id
        properties
      }
      state
      tagline
    }
  }
`;

export const AGENTS = `
  query App($appKey: String!){
    app(key: $appKey) {
      agents{
        id
        email
        avatarUrl
        name
        signInCount
        lastSignInAt
        invitationAcceptedAt
      }
    }
  }
`;

export const PENDING_AGENTS = `
  query App($appKey: String!){
    app(key: $appKey) {
      notConfirmedAgents{
        id
        email
        avatarUrl
        name
        signInCount
        lastSignInAt
        invitationAcceptedAt
        invitationSentAt
      }
    }
  }
`;

export const AGENT = `
  query App($appKey: String!, $id: Int!, $page: Int, $per: Int){
    app(key: $appKey) {
      agent(id: $id){
        id
        email
        avatarUrl
        name
        conversations(page: $page , per: $per ){
          collection{
            id
            key
            state
            readAt
            priority
            lastMessage{
              source
              createdAt
              readAt
              message{
                blocks
                data
                state
                htmlContent
                textContent
                serializedContent
              }
              privateNote
              messageSource{
                id
                type
              }
              appUser {
                id
                email
                avatarUrl
                kind
                displayName
              }
            }
            mainParticipant{
              id
              email
              avatarUrl
              displayName
              properties
            }
          }
          meta
        }
      }
    }
  }
`;

export const SEGMENT = `
  query App($appKey: String!, $id: Int!){
    app(key: $appKey) {
      segment(id: $id ) {
        name
        id
        predicates {
          type
          attribute
          comparison
          value
        }
      }
    }
  }
`;


export const CONVERSATIONS = `
  query App($appKey: String!, $page: Int!, $sort: String, $filter: String){
    app(key: $appKey) {
      encryptionKey
      key
      name
      conversations(page: $page, sort: $sort, filter: $filter){
        collection{
          id
          key
          state
          readAt
          priority
          assignee {
            displayName
            email
            avatarUrl
          }
          lastMessage{
            source
            createdAt
            stepId
            triggerId
            fromBot
            readAt
            message{
              blocks
              data
              state
              htmlContent
              textContent
              serializedContent
            }
            privateNote
            messageSource{
              id
              type
            }
            appUser {
              id
              email
              avatarUrl
              kind
              displayName
            }
          }
          mainParticipant{
            id
            email
            avatarUrl
            displayName
            properties
          }
        }
        meta

      }
    }
  }
`;

export const CONVERSATION=`
  query App($appKey: String!, $id: String!, $page: Int){
    app(key: $appKey) {
      encryptionKey
      key
      name
      conversation(id: $id){
        id
        key
        state
        readAt
        priority
        assignee {
          id
          email
          avatarUrl
        }
        mainParticipant{
          id
          email
          avatarUrl
          properties
          displayName
        }
        
        messages(page: $page){
          collection{
            id
            stepId
            triggerId
            fromBot
            message{
              blocks
              data
              state
              htmlContent
              textContent
              serializedContent
              action
            }
            source
            readAt
            createdAt
            privateNote
            appUser{
              id
              email
              avatarUrl
              kind
              displayName
            }
            source
            messageSource {
              name
              state
              fromName
              fromEmail
              serializedContent
            }
            emailMessageId
          }
          meta
        }
    }
  }
}
`;

export const CONVERSATION_WITH_LAST_MESSAGE=`
  query App($appKey: String!, $id: String!){
    app(key: $appKey) {
      encryptionKey
      key
      name
      conversation(id: $id){
        id
        key
        state
        readAt
        priority
        createdAt
        lastMessage{
          createdAt
          source
          triggerId
          fromBot
          readAt
          message{
            blocks
            data
            state
            htmlContent
            textContent
            serializedContent
          }
          privateNote
          messageSource{
            id
            type
          }
          appUser {
            id
            avatarUrl
            email
            kind
            displayName
          }
        }
        mainParticipant{
          id
          email
          avatarUrl
          displayName
          properties
        }
      }
    }
  }
`;



export const CURRENT_USER = `
  query CurrentUser {
    userSession {
      email
      avatarUrl
    }
  }
`;

export const APP_USER = `
query AppUser($appKey: String!, $id: Int! ) {
  app(key: $appKey) {
    appUser(id: $id ) {
      id
      email
      avatarUrl
      lastVisitedAt
      referrer
      state
      ip
      city
      region
      country
      lat
      lng
      postal
      webSessions
      timezone
      browser
      browserVersion
      os
      osVersion
      browserLanguage
      online
      lang
      displayName
      name
      properties
      externalProfiles {
        id
        provider
        data
      }
    }
  }
}
`;

export const APP_USER_CONVERSATIONS=`
query AppUserConversations($appKey: String!, $id: Int!, $page: Int, $per: Int){
  app(key: $appKey ){
    name
    key
    appUser(id: $id){
      displayName
      conversations(page: $page, per: $per){

        collection{
          id
          key
          mainParticipant{
            id
            email
            avatarUrl
          }
          lastMessage{
            createdAt
            readAt
            appUser{
              email
              avatarUrl
              id
              kind
              displayName
            }
            message{
              blocks
              data
              state
              serializedContent
              htmlContent
              textContent
            }
          }
        }
      }
    } 
  }
}
`;

export const APP_USER_VISITS=`
query AppUserVisits($appKey: String!, $id: Int!, $page: Int, $per: Int){
  app(key: $appKey ){
    name
    key
    appUser(id: $id){
      displayName
      visits(page: $page, per: $per){
        collection{
          url
          title
          osVersion
          os
          browserName
          browserVersion
          createdAt
        }
        meta
      }
    } 
  }
}
`;

export const CAMPAIGNS = `
query Campaigns($appKey: String!, $mode: String!){
  app(key: $appKey){
    campaigns(mode: $mode){
      collection {
        name
        id
        type
        url
        serializedContent
        segments
        scheduledAt
        scheduledTo
        state
        subject
        timezone
        description
        fromName
        fromEmail
        replyEmail        
      }
      meta
    }
  }
}
`;

export const CAMPAIGN = `
query Campaign($appKey: String!, $mode: String!, $id: String!){
  app(key: $appKey){
    campaign(mode: $mode, id: $id){
      name
      id
      type
      url
      serializedContent
      segments
      scheduledAt
      scheduledTo
      state
      subject
      description
      timezone
      statsFields
      configFields
      hiddenConstraints
      fromName
      fromEmail
      replyEmail
      steps
    }
  }
}
`;

export const CAMPAIGN_METRICS = `
query Campaign($appKey: String!, $mode: String!, $id: String!, $page: Int, $per: Int){
  app(key: $appKey){
    campaign(mode: $mode, id: $id){
      name
      counts
      metrics(page: $page, per: $per){
        collection {
          action
          host
          data
          messageId
          email
          appUserId
          updatedAt
          createdAt
        }
        meta
      }
    }
  }
}
`;

export const ASSIGNMENT_RULES = `
  query AssingmentRules($appKey: String!){
    app(key: $appKey){
      assignmentRules {
        id
        agent{
          id
          email
          avatarUrl
        }
        state
        title
        conditions
      }
    }
  }
`;

export const ARTICLE_SETTINGS = `
  query App($appKey: String!){
    app(key: $appKey) {
      articleSettings{
        id
        color
        credits
        facebook
        googleCode
        headerImage
        linkedin
        logo
        siteDescription
        siteTitle
        subdomain
        twitter
        website
        langs
        translations
        availableLanguages
      }
    }
  }
`;

export const ARTICLES = `
  query App($appKey: String!, $page: Int!, $per: Int, $lang: String, $mode: String){
    app(key: $appKey) {
      articles(page: $page, per: $per, lang: $lang, mode: $mode){
        collection {
          id
          title
          slug
          content 
          state
          description
          author{
            email
            avatarUrl
            id
            name
          } 
          collection{
            slug
            title
            id
          }        
        }
        meta
      }
    }
  }
`;

export const ARTICLES_UNCATEGORIZED = `
  query App($appKey: String!, $page: Int!, $per: Int){
    app(key: $appKey) {
      articlesUncategorized(page: $page, per: $per){
        collection {
          id
          title
          slug
          content 
          state
          description
          author{
            email
            avatarUrl
            id
            name
          } 
          collection{
            title
            id
          }        
        }
        meta
      }
    }
  }
`;

export const ARTICLE = `
  query App($appKey: String!, $id: String!, $lang: String){
    app(key: $appKey) {
      article(id: $id, lang: $lang){
        id
        title
        slug
        content
        state
        description
        collection{
          slug
          title
          id
        }
        section{
          slug
          title
          id
        }
        author{
          email
          avatarUrl
          id
          name
        }
      }
    }
  }
`;


export const ARTICLE_COLLECTIONS = `
  query ArticleCollections($appKey: String!, $lang: String){
    app(key: $appKey){
      collections(lang: $lang) {
        slug
        id
        title
        description
      }
    }
  }
`;

export const ARTICLE_COLLECTION = `
  query ArticleCollections($appKey: String!, $id: String!, $lang: String){
    app(key: $appKey){
      collection(id: $id, lang: $lang) {
        id
        title
        slug
        description
      }
    }
  }
`;

export const ARTICLE_COLLECTION_WITH_SECTIONS = `
  query ArticleCollections($appKey: String!, $id: String!, $lang: String){
    app(key: $appKey){
      collection(id: $id, lang: $lang) {
        id
        slug
        title
        description
        baseArticles{
          id
          title
          slug
          author{
            id
            email
            avatarUrl
            name
          }
        }
        sections{
          slug
          id
          title
          description
          articles{
            id
            title
            slug
            author{
              id
              email
              avatarUrl
              name
            }
          }
          
        }
      }
    }
  }
`;


export const BOT_TASKS = `
  query BotTasks($appKey: String!, $lang: String, $mode: String){
    app(key: $appKey){
      botTasks(lang: $lang, mode: $mode){
        title
        id
        state
      }
    }
  }
`;

export const BOT_TASK = `
  query BotTask($appKey: String!, $id: String!, $lang: String){
    app(key: $appKey){
      botTask(id: $id, lang: $lang){
        id
        state
        title
        segments
        scheduling
        urls
        statsFields
        paths{
          id
          steps
          title
          followActions
        }
      }
    }
  }
`;

export const BOT_TASK_METRICS = `
  query BotTask($appKey: String!, $id: String!, $lang: String,  $page: Int, $per: Int){
    app(key: $appKey){
      botTask(id: $id, lang: $lang){
        id
        counts
        statsFields
        metrics(page: $page, per: $per){
          collection {
            action
            host
            data
            messageId
            email
            appUserId
            updatedAt
            createdAt
          }
          meta
        }
      }
    }
  }
`;

export const DASHBOARD = `
  query Dashboard($appKey: String!, $range: Json!, $kind: String! )  {
    app(key: $appKey){
      dashboard(range: $range, kind: $kind)
    }
  }
`;

export const APP_PACKAGES = `
  query App($appKey: String!){
    app(key: $appKey) {
      appPackages{
        name
        state
        definitions
        icon
        description
      }
    }
  }
`;

export const EVENT_TYPES = `
  query App($appKey: String!){
    app(key: $appKey) {
      eventTypes
    }
  }
`;

export const OUTGOING_WEBHOOKS = `
  query App($appKey: String!){
    app(key: $appKey) {
      outgoingWebhooks
    }
  }
`;


export const EDITOR_APP_PACKAGES = `
  query App($appKey: String!){
    app(key: $appKey) {
      editorAppPackages{
        name
        state
        definitions
        editorDefinitions
        icon
        description
      }
    }
  }
`;

export const APP_PACKAGE_INTEGRATIONS = `
  query App($appKey: String!){
    app(key: $appKey) {
      appPackageIntegrations{
        id
        name
        settings
        definitions
        icon
        state
        description
      }
    }
  }
`;



