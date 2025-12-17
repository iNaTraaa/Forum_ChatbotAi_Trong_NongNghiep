import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';
import { Category } from './src/category/entitties/category.entity';
import { Post } from './src/post/entities/post.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'doanaidb',
    entities: [User, Category, Post],
    migrations: ['./db/migrations/*.ts'],
    synchronize: false, // Set to false when using migrations
    extra: {
        authPlugin: 'mysql_native_password',
    },
});
