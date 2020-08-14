import {Module} from '@nestjs/common';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Book} from "../db/models/books.entity";
import {Author} from "../db/models/authors.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Book, Author])],
    providers: [BooksResolver, BooksService],
})
export class BooksModule {
}
