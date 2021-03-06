import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { EventListItemFragment } from '../../../queries'
import * as theme from '../../../theme'
import { Typography } from '../../common/Typography/Typography'
import { format } from 'date-fns'
import { ProfileImage, Touchable } from '../../common/Widgets/Widgets'
import { timeOf } from '../../common/date-formats'

const EventListItemStyle = StyleSheet.create({
  container: {
    backgroundColor: theme.pallete.cardBg,
    flexDirection: 'row',
    padding: theme.spacing.level(1),
    maxWidth: Dimensions.get('screen').width,
  },
  text: {
    paddingLeft: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit * 0.33,
    flex: 1,
  },
  image: {},
})

interface EventListItemProps {
  event: EventListItemFragment
  onPress: (event: EventListItemPressedEvent) => void
}

export interface EventListItemPressedEvent {
  event: EventListItemFragment
}

export class EventListItem extends React.PureComponent<EventListItemProps> {
  render() {
    const { event, onPress } = this.props

    return (
      <Touchable onPress={() => onPress({ event })}>
        <View style={EventListItemStyle.container}>
          <ProfileImage
            style={EventListItemStyle.image}
            image={event.photo || require('../../../assets/default.jpg')}
          />

          <View style={EventListItemStyle.text}>
            <Typography accent variant="body" style={EventListItemStyle.text}>
              {timeOf(event.startTime)} - {timeOf(event.endTime)}
            </Typography>

            <Typography variant="cardTitle" style={EventListItemStyle.text}>
              {event.name}
            </Typography>

            <Typography
              variant="cardTitleVariant"
              style={EventListItemStyle.text}
            >
              {event.venue.name}
            </Typography>
          </View>
        </View>
      </Touchable>
    )
  }
}
