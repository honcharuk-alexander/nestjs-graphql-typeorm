import {Module} from '@nestjs/common';
import {AuthorsResolver} from './authors.resolver';
import {AuthorsService} from './authors.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Author} from "../db/models/authors.entity";
import {Book} from "../db/models/books.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Author, Book])],
    providers: [AuthorsResolver, AuthorsService]
})
export class AuthorsModule {
}
