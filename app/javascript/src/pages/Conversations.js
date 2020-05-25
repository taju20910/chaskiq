import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { setCurrentPage, setCurrentSection } from '../actions/navigation'
import {
  getConversations,
  updateConversationsData,
  clearConversations
} from '../actions/conversations'

import FilterMenu from '../components/FilterMenu'

import UserData from '../components/UserData'
import ConversationItemList from '../components/conversations/ItemList'
import AssignmentRules from '../components/conversations/AssignmentRules'
import Conversation from '../components/conversations/Conversation'
import Progress from '../components/Progress'
import EmptyView from '../components/EmptyView'
import Button from '../components/Button'
import emptyImage from '../images/empty-icon8.png'
// import {toCamelCase} from '../shared/caseConverter'

function Conversations ({
  dispatch,
  match,
  conversations,
  conversation,
  app,
  events,
  app_user
}) {

  const [fetching, setFetching] = React.useState(false)

  React.useEffect(() => {
    dispatch(clearConversations([]))
    fetchConversations({ page: 1 })

    dispatch(setCurrentPage('Conversations'))

    dispatch(setCurrentSection('Conversations'))
  }, [])

  const fetchConversations = (options, cb) => {
    dispatch(
      getConversations(options, () => {
        cb && cb()
      })
    )
  }

  const setSort = (option) => {
    dispatch(updateConversationsData({ sort: option }))
    this.setState({ sort: option })
  }

  const handleScroll = (e) => {
    const element = e.target
    const scrollDiff = Math.round(element.scrollHeight - element.scrollTop)
    if (scrollDiff === element.clientHeight) {
      if (conversations.meta.next_page && !fetching) {
        setFetching(true)
        fetchConversations({
          page: conversations.meta.next_page
        }, () => {
          setFetching(false)
        })
      }
    }
  }

  const setFilter = (option) => {
    dispatch(updateConversationsData({ filter: option }))
  }

  const filterButton = (handleClick) => {
    return (
      <Button
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        variant={'outlined'}
        onClick={handleClick}
        size="small"
      >
        {/* <MoreVertIcon /> */}
        {conversations.filter}
      </Button>
    )
  }

  const sortButton = (handleClick) => {
    return (
      <Button
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        variant={'outlined'}
        onClick={handleClick}
        size="small"
      >
        {/* <MoreVertIcon /> */}
        {conversations.sort}
      </Button>
    )
  }

  const filterConversations = (options, cb) => {
    dispatch(
      updateConversationsData(
        {
          filter: options.id,
          collection: []
        },
        () => {
          fetchConversations({ page: 1 }, cb)
          // getConversations({page: 1}, cb)
        }
      )
    )
  }

  const sortConversations = (options, cb) => {
    dispatch(
      updateConversationsData(
        {
          sort: options.id,
          collection: []
        },
        () => {
          fetchConversations({ page: 1 })
          // getConversations({page: 1}, cb)
        }
      )
    )
  }

  const renderConversations = () => {
    return (
      <React.Fragment>

        <div className="bg-white px-3 py-3 border-b border-gray-200 sm:px-3 flex justify-between">
          <FilterMenu
            options={[
              { id: 'opened', name: 'opened', count: 1, icon: null },
              { id: 'closed', name: 'closed', count: 2, icon: null }
            ]}
            value={conversations.filter}
            filterHandler={filterConversations}
            triggerButton={filterButton}
          />

          <FilterMenu
            options={[
              { id: 'newest', name: 'newest', count: 1, selected: true },
              { id: 'oldest', name: 'oldest', count: 1 },
              { id: 'waiting', name: 'waiting', count: 1 },
              { id: 'priority-first', name: 'priority first', count: 1 },
              { id: 'unfiltered', name: 'all', count: 1 }
            ]}
            position={'right'}
            value={conversations.sort}
            filterHandler={sortConversations}
            triggerButton={sortButton}
          />
        </div>

        <div className="overflow-scroll"
          onScroll={handleScroll}
          style={{ height: 'calc(100vh - 60px)' }}>
          {conversations.collection.map((o) => {
            const user = o.mainParticipant
            return (
              <ConversationItemList
                key={o.key}
                user={user}
                app={app}
                conversation={o}
              />
            )
          })}

          {
            fetching && <div className="m-2">
              <Progress size="4"/>
            </div>
          }
        </div>

      </React.Fragment>
    )
  }

  return (
    <div className="flex">

      <Switch>
        <Route exact path={`/apps/${app.key}/conversations`}>
          <div className={'w-full md:w-1/4 h-screen md:border-r sm:hidden'}>
            {renderConversations()}
          </div>
        </Route>
      </Switch>

      <div className={'w-full md:w-1/3 h-screen md:border-r hidden sm:block border-gray-200'}>
        {renderConversations()}
      </div>

      <Switch>
        <Route exact path={`/apps/${app.key}/conversations`}>
          <div className="hidden sm:block flex-grow bg-gray-50 h-12 h-screen border-r w-1/12">
            <EmptyView
              title={'No conversations'}
              shadowless
              image={
                <img
                  src={emptyImage}
                  className="h-56 w-56"
                  alt="no conversations"
                />
              }
              subtitle={'choose conversations on the side'}
            />
          </div>
        </Route>

        <Route exact path={`/apps/${app.key}/conversations/assignment_rules`}>
          <div className="flex-grow bg-gray-50 h-12 h-screen border-r w-1/12">
            <AssignmentRules />
          </div>
        </Route>

        <Route exact path={`/apps/${app.key}/conversations/:id`}>
          <div className="flex-grow bg-gray-200 h-12 h-screen border-r w-1/12">
            <Conversation events={events} />
          </div>
        </Route>
      </Switch>

      {!isEmpty(conversation) && (
        <div className="w-3/12 h-screen overflow-scroll hidden sm:block">
          {app_user && app_user.id ? (
            <UserData data={conversation.mainParticipant} />
          ) : (
            <Progress />
          )}
        </div>
      )}
    </div>
  )
}

function mapStateToProps (state) {
  const { auth, app, conversations, conversation, app_user } = state
  const { loading, isAuthenticated } = auth
  // const { sort, filter, collection , meta, loading} = conversations

  return {
    conversations,
    conversation,
    app_user,
    app,
    isAuthenticated
  }
}

export default withRouter(connect(mapStateToProps)(Conversations))
