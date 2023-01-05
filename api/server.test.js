const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');


test('check environment', () => {
  expect(process.env.NODE_ENV).toBe('testing');
}) ;

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
})

describe ('GET /', () => {
  test('receives the expected message', async() => {
    let result = await request(server).get('/')
    expect(result.body).toEqual({message: "hello, world!"})
  });
  test('receives the expected status', async() => {
    let result = await request(server).get('/')
    expect(result.status).toBe(200)
  });
});

describe('POST /register', () => {
  test('adds a new user to the database', async () => {
    let result = await request(server).post('/api/auth/register').send({username: "foo", password: 'bar'});
      expect(result.status).toBe(201)
      expect(result.body).toHaveProperty('username', 'foo')
      result = await db('users').where('username', 'foo').first();
      expect(result).toBeDefined();
    });

  test('responds with proper message on invalid request parameters', async () => {
    let result = await request(server).post('/api/auth/register').send({username: "  ", password: 'password'});
    expect(result.status).toBe(400)
    expect(result.body.message).toMatch(/username and password required/)
  });

});
