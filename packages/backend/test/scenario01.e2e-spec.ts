import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { AuthUser } from 'shared-types/src/user'
import { Coins, DepositPayload, ProductCreatePayload, ProductUpdatePayload } from 'shared-types/src/crud'

describe('Scenario01 (e2e)', () => {
  let app: INestApplication

  let token01: string
  let token02: string
  let token03: string

  // users
  const user01: AuthUser = { username: 'user01', role: 'seller', password: '123456' }
  const user02: AuthUser = { username: 'user02', role: 'buyer', password: '123456' }
  const user03: AuthUser = { username: 'user03', role: 'seller', password: '123456' }

  const productCreate01: ProductCreatePayload = { name: 'product01', price: 40, quantity: 3 }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('create 3 users', async () => {
    await Promise.all(
      [user01, user02, user03].map(
        async (user) => await request(app.getHttpServer()).post('/users').send(user).expect(201),
      ),
    )
  })

  it('logins as user1', async () => {
    const loginPayload = { username: user01.username, password: user01.password }
    const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')

    // register token01 globally
    token01 = response.body.access_token as string
  })

  it('user01 creates product01 - quantity 3, cost 40', async () => {
    const response = await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${token01}`)
      .send(productCreate01)

    expect(response.status).toBe(201)
  })

  it('user01 edits product01', async () => {
    const productUpdate01: ProductUpdatePayload = { price: 40, quantity: 4 }
    const response = await request(app.getHttpServer())
      .put(`/product/${productCreate01.name}`)
      .set('Authorization', `Bearer ${token01}`)
      .send(productUpdate01)

    expect(response.status).toBe(200)

    const list = await request(app.getHttpServer()).get('/product').send()
    expect(list.status).toBe(200)
    expect(list.body).toBeDefined()
    expect(Array.isArray(list.body)).toBe(true)
    expect(list.body.length).toBe(1)
    expect(list.body[0]).toHaveProperty('quantity', productUpdate01.quantity)
  })

  it('user01 deposits money of 100, expected AUTH ERROR', async () => {
    const coins: DepositPayload = { '5': 10, '50': 1 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token01}`)
      .send(coins)

    expect(response.status).toBe(403)
  })

  it('login as user02', async () => {
    const loginPayload = { username: user02.username, password: user02.password }
    const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')

    // register token01 globally
    token02 = response.body.access_token as string
  })

  it('user02 edits product01, expected AUTH ERROR', async () => {
    const productUpdate01: ProductUpdatePayload = { price: 40, quantity: 4 }
    const response = await request(app.getHttpServer())
      .put(`/product/${productCreate01.name}`)
      .set('Authorization', `Bearer ${token02}`)
      .send(productUpdate01)

    expect(response.status).toBe(403)
  })

  it('user02 create product02: quantity 10, cost 50. Expects AUTH ERROR', async () => {
    const productCreate02: ProductCreatePayload = { name: 'product02', price: 50, quantity: 10 }
    const response = await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${token02}`)
      .send(productCreate02)

    expect(response.status).toBe(403)
  })

  it('get product01', async () => {
    const response = await request(app.getHttpServer()).get(`/product/${productCreate01.name}`).send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('price', productCreate01.price)
  })

  it('user02 deposit 2 coins, for a total of 100', async () => {
    const coins: DepositPayload = { '50': 2 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token02}`)
      .send(coins)

    expect(response.status).toBe(201)
  })

  it('user02 buys product01, quantity 2. Expect correct product remaining', async () => {
    const response = await request(app.getHttpServer())
      .post('/buy')
      .set('Authorization', `Bearer ${token02}`)
      .send({ product: productCreate01.name, qty: 2 })

    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('spent', productCreate01.price * 2)
    expect(response.body).toHaveProperty('product', productCreate01.name)
    expect(response.body).toHaveProperty('qty', 2)
    expect(response.body).toHaveProperty('change')
    expect(Array.isArray(response.body.change)).toBe(true)
    expect(response.body.change.length).toBe(5)
    expect(response.body.change).toEqual([0, 0, 1, 0, 0])

    const list = await request(app.getHttpServer()).get('/product').send()
    expect(list.status).toBe(200)
    expect(list.body).toBeDefined()
    expect(Array.isArray(list.body)).toBe(true)
    expect(list.body.length).toBe(1)
    expect(list.body[0]).toHaveProperty('quantity', 2)
  })

  it('user02 deposits a coin of value 20', async () => {
    const coins: DepositPayload = { '20': 1 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token02}`)
      .send(coins)

    expect(response.status).toBe(201)
  })

  it('user02 buys product01, quantity 2. Expect FUNDS ERROR', async () => {
    const response = await request(app.getHttpServer())
      .post('/buy')
      .set('Authorization', `Bearer ${token02}`)
      .send({ product: productCreate01.name, qty: 2 })

    expect(response.status).toBe(412)
  })

  it('user02 deposits coins of value 100. 2 pieces of 20, and the rest as 10', async () => {
    const coins: DepositPayload = { '20': 2, '10': 6 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token02}`)
      .send(coins)

    expect(response.status).toBe(201)
  })

  it('user02 buys product01, quantity 2. Expect correct product remaining', async () => {
    const response = await request(app.getHttpServer())
      .post('/buy')
      .set('Authorization', `Bearer ${token02}`)
      .send({ product: productCreate01.name, qty: 2 })

    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('spent', productCreate01.price * 2)
    expect(response.body).toHaveProperty('product', productCreate01.name)
    expect(response.body).toHaveProperty('qty', 2)
    expect(response.body).toHaveProperty('change')
    expect(Array.isArray(response.body.change)).toBe(true)
    expect(response.body.change.length).toBe(5)
    expect(response.body.change).toEqual([0, 0, 2, 0, 0]) // deposited 20 and then 100, change is 40

    const list = await request(app.getHttpServer()).get('/product').send()
    expect(list.status).toBe(200)
    expect(list.body).toBeDefined()
    expect(Array.isArray(list.body)).toBe(true)
    expect(list.body.length).toBe(1)
    expect(list.body[0]).toHaveProperty('quantity', 0)
  })

  it('user02 deposits coins of value 20. 2 pieces of 5, and 1 piece of 10', async () => {
    const coins: DepositPayload = { '5': 2, '10': 1 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token02}`)
      .send(coins)

    expect(response.status).toBe(201)
  })

  it('user02 buys product01, quantity 2. Expect FUNDS ERROR', async () => {
    const response = await request(app.getHttpServer())
      .post('/buy')
      .set('Authorization', `Bearer ${token02}`)
      .send({ product: productCreate01.name, qty: 2 })

    expect(response.status).toBe(412)
  })

  it('user02 deposits coins of value 100. 1 piece of 100', async () => {
    const coins: DepositPayload = { '100': 1 }
    const response = await request(app.getHttpServer())
      .post('/deposit')
      .set('Authorization', `Bearer ${token02}`)
      .send(coins)

    expect(response.status).toBe(201)
  })

  it('user02 buys product01, quantity 2. Expect AVAILABILITY ERROR', async () => {
    const response = await request(app.getHttpServer())
      .post('/buy')
      .set('Authorization', `Bearer ${token02}`)
      .send({ product: productCreate01.name, qty: 2 })

    expect(response.status).toBe(412)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('message', 'Insufficient product quantity')
  })

  it('user02 flushes its deposits. Expected change of 120', async () => {
    const response = await request(app.getHttpServer()).post('/reset').set('Authorization', `Bearer ${token02}`).send()

    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('5', 2)
    expect(response.body).toHaveProperty('10', 1)
    expect(response.body).toHaveProperty('20', 0)
    expect(response.body).toHaveProperty('50', 0)
    expect(response.body).toHaveProperty('100', 1)
  })

  it('user03 logs in', async () => {
    const loginPayload = { username: user03.username, password: user03.password }
    const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')

    // register token01 globally
    token01 = response.body.access_token as string
  })

  it('user03 edits product01. Expected AUTH ERROR', async () => {
    const productUpdate01: ProductUpdatePayload = { price: 40, quantity: 4 }
    const response = await request(app.getHttpServer())
      .put(`/product/${productCreate01.name}`)
      .set('Authorization', `Bearer ${token03}`)
      .send(productUpdate01)

    expect(response.status).toBe(401)
  })
})
