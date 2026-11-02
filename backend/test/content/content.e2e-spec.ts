import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthEntity } from '../../src/modules/auth/auth.model';

/** Articles, News items and FAQs: admin writes, visitor reads under /site. */
describe('Content (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let users: Model<AuthEntity>;
  let admin: string;

  const http = () => request(app.getHttpServer());
  const day = (offset: number) =>
    new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(getConnectionToken());
    users = moduleFixture.get<Model<AuthEntity>>(
      getModelToken(AuthEntity.name),
    );
    await app.init();
  });

  beforeEach(async () => {
    // dropDatabase() also drops the unique indexes; slugs rely on one.
    await connection.syncIndexes();
    await users.create({
      username: 'editor',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
    });
    const res = await http()
      .post('/auth/sign-in')
      .send({ username: 'editor', password: 'password123' })
      .expect(201);
    admin = `Bearer ${res.body.data.accessToken as string}`;
  });

  afterEach(() => connection.dropDatabase());

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  const article = (slug: string, extra: Record<string, unknown> = {}) =>
    http()
      .post('/articles')
      .set('Authorization', admin)
      .send({
        title: 'یک مقاله',
        slug,
        summary: 'خلاصه‌ای به اندازهٔ کافی بلند',
        body: '<p>متن</p>',
        ...extra,
      });

  it('shows visitors only published Articles, with sanitised bodies', async () => {
    const published = await article('live', {
      status: 'published',
      body: '<h1>تیتر</h1><p onclick="x()">متن<script>alert(1)</script></p><img src="https://evil.example/a.png">',
    }).expect(201);
    expect(published.body.data.body).toBe('<h2>تیتر</h2><p>متن</p>');
    expect(published.body.data.publishedAt).toBeDefined();
    await article('draft').expect(201);
    await article('scheduled', {
      status: 'published',
      publishedAt: day(5),
    }).expect(201);

    const list = await http().get('/site/articles').expect(200);
    expect(list.body.data.total).toBe(1);
    expect(list.body.data.items[0].slug).toBe('live');
    expect(list.body.data.items[0].body).toBeUndefined();

    await http().get('/site/articles/live').expect(200);
    await http().get('/site/articles/draft').expect(404);

    const adminList = await http()
      .get('/articles')
      .set('Authorization', admin)
      .expect(200);
    expect(adminList.body.data.total).toBe(3);
  });

  it('rejects a malformed or duplicate slug', async () => {
    await article('Not A Slug').expect(400);
    await article('same').expect(201);
    await article('same').expect(409);
  });

  it('keeps News items on the Landing page until their last day passes', async () => {
    const post = (body: Record<string, unknown>) =>
      http()
        .post('/news')
        .set('Authorization', admin)
        .send({ title: 'یک خبر', body: 'متنی برای یک خبر', ...body });
    await post({ startsAt: day(-10), endsAt: day(-3) }).expect(201);
    await post({ startsAt: day(-3), endsAt: day(4) }).expect(201);
    await post({ startsAt: day(6) }).expect(201);
    await post({ startsAt: day(5), endsAt: day(1) }).expect(400);

    const current = await http().get('/site/news?scope=current').expect(200);
    expect(current.body.data.total).toBe(2);
    const all = await http().get('/site/news?scope=all').expect(200);
    expect(all.body.data.total).toBe(3);
  });

  it('lists FAQs in display order and keeps writes admin-only', async () => {
    for (const [question, order] of [
      ['پرسش دوم چیست؟', 2],
      ['پرسش اول چیست؟', 1],
    ] as const) {
      await http()
        .post('/faqs')
        .set('Authorization', admin)
        .send({ question, answer: 'یک پاسخ', order })
        .expect(201);
    }
    const res = await http().get('/site/faqs').expect(200);
    expect(res.body.data.map((f: { order: number }) => f.order)).toEqual([
      1, 2,
    ]);

    await http()
      .post('/faqs')
      .send({ question: 'بدون ورود؟', answer: 'نه' })
      .expect(401);
    await http().post('/media/images').expect(401);
  });
});
