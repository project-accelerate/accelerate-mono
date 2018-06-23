import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class Venue {
  @Field() id!: string

  @Field() name!: string

  @Field() postcode!: string
}
