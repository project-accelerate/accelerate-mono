import { ConferenceNotificationTargeter } from 'backend/app/conference/application/ConferenceNotificationTargeter'
import { ConferenceNotificationScope } from 'common/domain/ConferenceNotificationScope'
import { someConferenceNotificationProps } from 'backend/app/conference/test/conferenceNotificationTestUtils'

describe(ConferenceNotificationTargeter, () => {
  describe('when event provided', () => {
    it('includes event in metadata', () => {
      const fixture = new Fixture()
      const request = someConferenceNotificationProps({
        link: undefined,
        associatedEventId: '123',
      })

      expect(fixture.service.getNotificationMetadata(request)).toEqual({
        type: 'conference-notification',
        associatedObject: '123',
        associatedObjectType: 'event',
      })
    })

    it('includes link in metadata', () => {
      const fixture = new Fixture()
      const request = someConferenceNotificationProps({
        link: '123',
        associatedEventId: undefined,
      })

      expect(fixture.service.getNotificationMetadata(request)).toEqual({
        type: 'conference-notification',
        associatedObject: '123',
        associatedObjectType: 'link',
      })
    })
  })

  describe('when scope is everyone', () => {
    it('targets everyone', () => {
      const fixture = new Fixture()
      const request = someConferenceNotificationProps({
        scope: ConferenceNotificationScope.EVERYONE,
      })

      expect(fixture.service.getTargetsForNotification(request)).toEqual({})
    })
  })
})

class Fixture {
  service = new ConferenceNotificationTargeter()
}
