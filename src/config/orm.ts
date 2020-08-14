import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const options: TypeOrmModuleOptions = {
  "type": "mysql",
  "host": "nest-mysql",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "catalog",
  "entities": [path.resolve(__dirname, '..', 'db', 'models', '*')],
  "synchronize": true
};

module.exports = options;
