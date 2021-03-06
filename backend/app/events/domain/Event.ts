import {
  ObjectType,
  Field,
  GraphQLISODateTime,
  InputType,
  registerEnumType,
} from 'type-graphql'
import { Point } from 'geojson'
import { FileUpload, GraphQLUpload } from 'apollo-upload-server'
import { GraphQLString } from 'graphql'
import { EventFamily } from 'common/domain/EventFamily'

registerEnumType(EventFamily, {
  name: 'EventFamily',
})

@InputType({
  description: 'Request properties to submit a new event',
})
export class CreateEventRequest {
  @Field() name!: string

  @Field(() => [GraphQLString])
  speakers!: string[]

  @Field() venue!: string

  @Field(() => GraphQLISODateTime)
  startTime!: Date

  @Field(() => GraphQLISODateTime)
  endTime!: Date

  @Field() introduction!: string

  @Field() detail!: string

  @Field(() => EventFamily)
  family!: EventFamily

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  photoUpload?: FileUpload

  importRef?: string
}

@InputType({
  description: 'Request properties to edit an event',
})
export class EditEventRequest {
  @Field() id!: string
  @Field({
    nullable: true,
  })
  name?: string

  @Field(() => [GraphQLString], {
    nullable: true,
  })
  speakers?: string[]

  @Field({
    nullable: true,
  })
  venue?: string

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  startTime?: Date

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  endTime?: Date

  @Field({
    nullable: true,
  })
  introduction?: string

  @Field({
    nullable: true,
  })
  detail?: string

  @Field(() => EventFamily, {
    nullable: true,
  })
  family?: EventFamily

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  photoUpload?: FileUpload
}

@ObjectType()
export class Event {
  @Field() id!: string

  @Field() name!: string

  @Field(() => EventFamily)
  family!: EventFamily

  venue!: string

  @Field(() => GraphQLISODateTime)
  startTime!: Date

  @Field(() => GraphQLISODateTime)
  endTime!: Date

  @Field() introduction!: string

  @Field() detail!: string

  @Field() cancelled?: boolean

  photo?: string

  location!: Point

  importRef?: string
}
