import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { DataSource } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { User } from '../src/users/user.entity.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('rolls back a user insert after a statement timeout', async () => {
    const db = app.get(DataSource);
    const login = `rollback-${randomUUID()}`;

    await expect(
      db.transaction(async (manager) => {
        await manager.insert(User, {
          login,
          email: `${login}@example.test`,
          passwordHash: 'test-placeholder',
          age: 25,
          bio: '',
        });
        await manager.query('SELECT pg_sleep(3)');
      }),
    ).rejects.toMatchObject({
      query: 'SELECT pg_sleep(3)',
      driverError: { code: '57014' },
    });

    await expect(db.query('SELECT 1 AS result')).resolves.toEqual([
      { result: 1 },
    ]);
    await expect(db.getRepository(User).existsBy({ login })).resolves.toBe(
      false,
    );
  });

  afterEach(async () => {
    await app.close();
  });
});
