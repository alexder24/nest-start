import { DataSource } from 'typeorm';
import { User } from '../users/user.entity.js';
import { readDatabaseConfig } from './database.config.js';

const db = readDatabaseConfig();

export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  database: db.name,
  username: db.user,
  password: db.password,
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
