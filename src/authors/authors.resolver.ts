import {Args, ID, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AuthorInput} from './dto/author.input';
import {Author} from '../db/models/authors.entity';
import {AuthorsService} from './authors.service';

@Resolver(of => Author)
export class AuthorsResolver {
    constructor(private readonly authorsService: AuthorsService) {
    }

    @Query(returns => Author, {nullable: true})
    getAuthor(@Args('id', {type: () => ID}) id: number): Promise<Author> {
        return this.authorsService.findOneById(id);
    }

    @Query(returns => [Author])
    getAuthors(@Args('minNumberOfBooks', {nullable: true, type: () => Int}) minNumberOfBooks?: number,
               @Args('maxNumberOfBooks', {nullable: true, type: () => Int}) maxNumberOfBooks?: number
    ): Promise<Author[]> {
        return this.authorsService.findAll(minNumberOfBooks, maxNumberOfBooks);
    }

    @Mutation(returns => Author)
    createAuthor(@Args('author') author: AuthorInput): Promise<Author> {
        return this.authorsService.create(author);
    }

    @Mutation(returns => Int)
    deleteAuthor(@Args('id', {type: () => ID}) id: number) {
        return this.authorsService.remove(id);
    }

    @Mutation(returns => Int)
    deleteAuthorWithBooks(@Args('id', {type: () => ID}) id: number) {
        return this.authorsService.removeWithBooks(id);
    }
}
