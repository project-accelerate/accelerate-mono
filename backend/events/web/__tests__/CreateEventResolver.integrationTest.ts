import { someString, somePostcode, someDate } from 'common/test/testUtils'
import { withDb, execQuery } from 'backend/test/integrationTestUtils'
import {
  givenThatAnEventExists,
  givenThatAVenueExists,
  givenThatAnOrganiserExists,
  someEventProps,
} from 'backend/events/test/eventTestUtils'
import { CreateEventRequest } from 'backend/events/domain/Event'

describe('CreateEventResolver', () => {
  describe('.createEvent', () => {
    it(
      'creates the event and returns it',
      withDb(async () => {
        const result = await execQuery<{ request: CreateEventRequest }>({
          body: `
          mutation($request: CreateEventRequest) {
            createEvent(request: $request) {
              name
              venue {
                name
              }
              organiser {
                name
              }
            }
          }
        `,
          variables: {
            request: {
              startTime: someDate(),
              endTime: someDate(),
              introduction: someString(),
              name: 'my-event',
              venueName: 'my-venue',
              organiserName: 'my-organiser',
              postcode: somePostcode(),
            },
          },
        })

        expect(result.createEvent).toMatchObject({
          name: 'my-event',
          organiser: {
            name: 'my-organiser',
          },
          venue: {
            name: 'my-venue',
          },
        })
      }),
    )
  })
})
