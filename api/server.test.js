const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')


test('check environment', () => {
  expect(process.env.NODE_ENV).toBe('testing')
}) ;

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
})

describe ('Endpoints', () => {
  test('GET /', async() => {
    let result = await request(server).get('/')
    expect(result.status).toBe(200)
    expect(result.body).toEqual({message: "hello, world!"})
  })
  test('POST /register', async () => {
    let result = await request(server).post('/register').send({username: "foo", password: 'bar'});

    expect(result.status).toBe(201)
    expect(result.body).toHaveProperty('username', 'foo')
    result = await db('users').where('username', 'foo').first();
    expect(result).toBeDefined();
  })
  // test('GET /jokes', () => {

  // })
})
