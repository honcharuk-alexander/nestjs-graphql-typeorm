import {Module} from '@nestjs/common';
import {join} from 'path';
import {GraphQLModule} from '@nestjs/graphql';
import {AuthorsModule} from "./authors/authors.module";
import {BooksModule} from "./books/books.module";
import {TypeOrmModule} from '@nestjs/typeorm';
import * as ormOptions from './config/orm';

@Module({
    imports: [
        AuthorsModule,
        BooksModule,
        TypeOrmModule.forRoot(ormOptions),
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            playground: true,
        }),
    ],
})
export class AppModule {
}
