import React from 'react'
import {
  NavigationScreenOptions,
  NavigationScreenProps,
} from 'react-navigation'
import { TimetableScreenQuery } from '../../../queries'
import { EventList } from '../Event/EventList'
import { createFetchData } from '../../common/FetchData/FetchData'
import { EventListItemPressedEvent } from '../Event/EventListItem'
import { getRoutename } from '../../../routes'
import TimetableScreenQueryDocument from '../Event/TimetableScreen.graphql'
import { WithRegistration } from '../Registration/UserProvider'
import { Screen } from '../../common/Widgets/Widgets'

const FetchEvents = createFetchData<TimetableScreenQuery, {}>({
  query: TimetableScreenQueryDocument,
})

export class MeetUpsTimetable extends React.Component<NavigationScreenProps> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: 'Meetups',
    drawerLabel: 'Meetups',
  }

  handleEventPressed = ({ event }: EventListItemPressedEvent) => {
    this.props.navigation.push(getRoutename('EventDetailScreen'), {
      id: event.id,
      title: event.name,
    })
  }

  render() {
    return (
      <Screen>
        <WithRegistration>
          {({ userId }) => (
            <FetchEvents variables={{ userId }}>
              {({ data }) => (
                <EventList
                  data={data.user.events}
                  onEventPress={this.handleEventPressed}
                />
              )}
            </FetchEvents>
          )}
        </WithRegistration>
      </Screen>
    )
  }
}
