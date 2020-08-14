import {Field, ID, InputType} from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class BookInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field(type => [ID])
  authorIds: [number];
}
