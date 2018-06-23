import {
  Resolver,
  Field,
  Mutation,
  GraphQLISODateTime,
  InputType,
} from 'type-graphql'
import { MutationRequest } from '../../common/resolverUtils'
import { EventAdminService } from '../application/EventAdminService'
import { EventRepository } from '../external/EventRepository'
import { Event, CreateEventRequest } from '../domain/Event'

@Resolver()
class CreateEventResolver {
  constructor(
    private eventAdminService: EventAdminService,
    private eventRepository: EventRepository,
  ) {}

  @Mutation(() => Event, {
    description: 'Submit a new event',
  })
  async createEvent(
    @MutationRequest(() => CreateEventRequest)
    request: CreateEventRequest,
  ) {
    const id = await this.eventAdminService.submitEvent(request)
    return this.eventRepository.findOne(id)
  }
}
