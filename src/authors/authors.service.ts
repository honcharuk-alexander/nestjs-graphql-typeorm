import {Injectable} from '@nestjs/common';
import {AuthorInput} from './dto/author.input';
import {Author} from '../db/models/authors.entity';
import {getConnection, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Book} from "../db/models/books.entity";

@Injectable()
export class AuthorsService {

    public constructor(
        @InjectRepository(Author) public readonly authorRepo: Repository<Author>,
        @InjectRepository(Book) public readonly bookRepo: Repository<Book>) {
    }

    create(data: AuthorInput): Promise<Author> {
        const authorEntity = this.authorRepo.create(data);
        return this.authorRepo.save(authorEntity);
    }

    findOneById(id: number): Promise<Author> {
        return this.authorRepo.findOne(id);
    }

    findAll(minNumberOfBooks?: number, maxNumberOfBooks?: number): Promise<Author[]> {
        const findAuthorsQuery = this.authorRepo.createQueryBuilder('author')
            .leftJoinAndSelect('author.books', 'books')
            .addSelect('(SELECT COUNT(*) FROM `author_book` WHERE `author_books`.`author_id`=`author_id`) as `book_count`');

        if (minNumberOfBooks && maxNumberOfBooks) {
            return findAuthorsQuery
                .having(`book_count >= ${minNumberOfBooks}`)
                .andHaving(`book_count <= ${maxNumberOfBooks}`)
                .getMany();
        }

        if (minNumberOfBooks) {
            return findAuthorsQuery
                .having(`book_count >= ${minNumberOfBooks}`)
                .getMany();
        }

        if (maxNumberOfBooks) {
            return findAuthorsQuery
                .having(`book_count <= ${maxNumberOfBooks}`)
                .getMany();
        }

        return this.authorRepo.find();
    }

    remove(id: number): Promise<number> {
        return this.authorRepo.delete(id).then(result => result.affected);
    }

    async removeWithBooks(id: number): Promise<number> {
        const booksIds = await getConnection()
            .query('SELECT book_id from author_book where author_id = ?', [id])
            .then(result => result.map(row => row.book_id));

        if(booksIds.length ) {
            const removeBooksIds = await getConnection()
                .query(`SELECT book_id from author_book 
                        where book_id in (?) GROUP BY book_id HAVING COUNT(author_id) = 1`, [booksIds])
                .then(result => result.map(row => row.book_id));

            await this.bookRepo.delete(removeBooksIds);
        }
        return this.authorRepo.delete(id).then(result => result.affected + booksIds.length);
    }
}
