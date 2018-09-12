import React from 'react'
import { TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native'
import {
  ProfileImage,
  Banner,
  Grid,
  Spacing,
  Columns,
} from '../../common/Widgets/Widgets'
import { Typography, Markdown, Br } from '../../common/Typography/Typography'
import { EventDetailFragment } from '../../../queries'
import { theme } from '../../../theme'
import { timeOf, longDateOf, weekdayOf } from '../../common/date-formats'
import { Button } from '../../common/Butttons/Buttons'
import { MapView } from '../../common/MapView/MapView'

interface EventDetailPageProps {
  event: EventDetailFragment
  canSave: boolean
  onSpeakerPress: (event: EventDetailSpeakerPressEvent) => void
  favourited: boolean
  onToggleFavourited: () => void
}

export interface EventDetailSpeakerPressEvent {
  speaker: {
    id: string
    name: string
    photo: { sourceUrl: string } | null
  }
}

const style = StyleSheet.create({
  banner: {
    padding: theme.spacing.level(1),
    color: theme.pallete.white,
    backgroundColor: theme.pallete.accent,
  },
  header: {
    padding: theme.spacing.level(1),
    marginBottom: theme.spacing.level(1),
    backgroundColor: theme.pallete.accent,
  },
  content: {
    marginHorizontal: theme.spacing.level(1),
    marginBottom: theme.spacing.level(2),
  },
  intro: {
    color: theme.pallete.black,
  },
  speakerName: {
    color: theme.pallete.white,
  },
  heading: {
    color: theme.pallete.accent,
    width: '100%',
    padding: theme.spacing.level(1),
    marginTop: theme.spacing.level(2),
  },
  venue: {
    padding: theme.spacing.level(1),
    marginBottom: theme.spacing.level(2),
    color: theme.pallete.white,
    backgroundColor: theme.pallete.accent,
  },
  divider: {
    borderColor: theme.pallete.accent,
    borderWidth: 1,
  },
  inset: {
    marginVertical: theme.spacing.level(2),
  },
  block: {
    marginHorizontal: theme.spacing.level(1),
  },
  last: {
    marginBottom: theme.spacing.level(3),
  },
})

export function EventDetail({
  event,
  onSpeakerPress,
  favourited,
  onToggleFavourited,
  canSave,
}: EventDetailPageProps) {
  return (
    <ScrollView>
      <View style={style.header}>
        <Typography darkBg variant="caption">
          {event.venue.name}
        </Typography>
      </View>

      <View style={style.block}>
        <Columns center style={style.inset}>
          <Typography accent variant="primary">
            {weekdayOf(event.startTime)} {timeOf(event.startTime)}
          </Typography>

          {canSave && (
            <Button
              variant="inline"
              icon={favourited ? 'check' : 'star'}
              onPress={onToggleFavourited}
            >
              {favourited ? 'Saved' : 'Save to Calendar'}
            </Button>
          )}
        </Columns>

        <Typography variant="primary">{event.introduction}</Typography>

        <Spacing level={2} />

        <Typography variant="body">{event.detail}</Typography>
      </View>

      <Typography style={style.heading} variant="display">
        Speakers
      </Typography>

      <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
        {event.speakers.edges.map(speaker => (
          <TouchableOpacity
            key={speaker.node.id}
            onPress={() => onSpeakerPress({ speaker: speaker.node })}
          >
            <ProfileImage size="halfSquare" image={speaker.node.photo}>
              <Banner>
                <Typography style={style.speakerName} variant="body">
                  {speaker.node.name}
                </Typography>
              </Banner>
            </ProfileImage>
          </TouchableOpacity>
        ))}
      </View>

      <Typography style={style.heading} variant="display">
        Venue
      </Typography>

      <MapView
        style={{ height: 300 }}
        region={{
          latitude: event.venue.address.latitude,
          longitude: event.venue.address.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <MapView.Marker
          coordinate={event.venue.address}
          title={event.venue.name}
        />
      </MapView>

      <Typography style={style.venue} variant="caption">
        {event.venue.name}
        <Br />
        {event.venue.address.streetAddress}, {event.venue.address.postcode}
      </Typography>
    </ScrollView>
  )
}
