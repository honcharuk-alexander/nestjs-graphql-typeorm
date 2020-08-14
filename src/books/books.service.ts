import {Injectable, NotFoundException} from '@nestjs/common';
import {Like, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Book} from "../db/models/books.entity";
import {BookInput} from "./dto/book.input";
import {Author} from "../db/models/authors.entity";

@Injectable()
export class BooksService {

    public constructor(
        @InjectRepository(Book) public readonly bookRepo: Repository<Book>,
        @InjectRepository(Author) public readonly authorRepo: Repository<Author>) {
    }

    async create(data: BookInput): Promise<Book> {
        const {title, authorIds} = data;
        const bookEntity = this.bookRepo.create({title, authors: authorIds.map(id => ({id}))});
        return this.bookRepo.save(bookEntity);
    }

    async addAuthor(bookId: number, authorId: number): Promise<Book> {
        const [bookEntity, authorEntity] = await Promise.all([
            this.findOneById(bookId),
            this.authorRepo.findOne(authorId)
        ]);

        if (!authorEntity)
            throw new NotFoundException('author not found');

        if (!bookEntity)
            throw new NotFoundException('book not found');

        bookEntity.authors.push(authorEntity);
        return this.bookRepo.save(bookEntity);
    }

    findOneById(id: number): Promise<Book> {
        return this.bookRepo.findOne(id, {relations: ['authors']});
    }

    findAll(title: string,): Promise<Book[]> {
        const findOptions: any = {relations: ['authors']};
        if (title) findOptions.where = {title: Like(title)};
        return this.bookRepo.find(findOptions);
    }

    remove(id: number): Promise<number> {
        return this.bookRepo.delete(id).then(result => result.affected);
    }
}
