import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { AuthUser } from 'shared-types/src/user'
import * as jwt from 'jsonwebtoken'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', async () => {
    return await request(app.getHttpServer()).get('/').expect(200).expect({ message: 'Hello World!' })
  })

  it('creates an User', async () => {
    const user: AuthUser = { username: 'seller01', role: 'seller', password: '123456' }
    return await request(app.getHttpServer()).post('/users').send(user).expect(201)
  })

  it('creates an User, logs in, run protected url', async () => {
    const user: AuthUser = { username: 'seller02', role: 'seller', password: '123456' }
    await request(app.getHttpServer()).post('/users').send(user).expect(201)

    const loginPayload = { username: user.username, password: user.password }
    const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')

    const token = response.body.access_token as string
    const decoded = jwt.decode(token)

    expect(decoded).toHaveProperty('sub', user.username)
    expect(decoded).toHaveProperty('role', user.role)
    expect(decoded).toHaveProperty('jti')

    const protectedResponse = await request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
    expect(protectedResponse.status).toBe(200)
    expect(protectedResponse.body).toHaveProperty('message', `Hello ${user.username}!`)
  })

  it('creates an User, logs in twice, first JWT is invalidated', async () => {
    const user: AuthUser = { username: 'seller03', role: 'seller', password: '123456' }
    await request(app.getHttpServer()).post('/users').send(user).expect(201)

    const loginPayload = { username: user.username, password: user.password }
    const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('access_token')

    const response2 = await request(app.getHttpServer()).post('/auth/login').send(loginPayload)
    expect(response2.status).toBe(200)
    expect(response2.body).toHaveProperty('access_token')

    const protectedResponse = await request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${response2.body.access_token as string}`)
    expect(protectedResponse.status).toBe(200)
    expect(protectedResponse.body).toHaveProperty('message', `Hello ${user.username}!`)

    const protectedResponse2 = await request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${response.body.access_token as string}`)
    expect(protectedResponse2.status).toBe(401)
  })
})
