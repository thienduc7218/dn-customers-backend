import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import * as request from 'supertest'
import mongoose from 'mongoose'
import { CustomerResponse } from '@dn/customers'
describe('Customer Controller e2e', () => {
  let app: INestApplication
  let mongoServer: typeof mongoose

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = module.createNestApplication()
    await app.init()

    mongoServer = await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await app.close()
    await mongoServer.connection.close()
  })

  afterEach(async () => await mongoServer.connection.db.dropDatabase())
  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  const mockPayload = { name: 'Thien Duc', phone: '0857447929', address: 'Long Bien, Ha Noi', email: 'thien@duc.com' }
  const mockResponse = { id: expect.any(String), ...mockPayload }

  const seedData = async () => request(app.getHttpServer()).post('/customers').send(mockPayload)

  describe('POST /customers', () => {
    it('should OK', async () => {
      return await request(app.getHttpServer())
        .post('/customers')
        .send(mockPayload)
        .expect(res => expect(res.body).toStrictEqual(mockResponse))
        .expect(HttpStatus.CREATED)
    })

    it('should failed as name existed', async () => {
      await seedData()
      return await request(app.getHttpServer())
        .post('/customers')
        .send(mockPayload)
        .expect(/name is already registered!/)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should failed as phone existed', async () => {
      await seedData()
      return await request(app.getHttpServer())
        .post('/customers')
        .send({ ...mockPayload, name: 'name' })
        .expect(/phone is already registered!/)
        .expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('GET /customers', () => {
    it('should OK', async () => {
      await seedData()
      return request(app.getHttpServer())
        .get('/customers')
        .expect(res => expect(res.body).toStrictEqual([mockResponse]))
        .expect(HttpStatus.OK)
    })
  })

  describe('GET /customers/:id', () => {
    it('should OK', async () => {
      const newCus = await seedData()

      return request(app.getHttpServer())
        .get(`/customers/${newCus.body.id}`)
        .expect(res => expect(res.body).toStrictEqual(mockResponse))
        .expect(HttpStatus.OK)
    })

    it('should failed as customer not found', async () => {
      const mockObjectId = new mongoose.Types.ObjectId()
      return request(app.getHttpServer())
        .get(`/customers/${mockObjectId}`)
        .expect(/Customer not found!/)
        .expect(HttpStatus.NOT_FOUND)
    })
  })

  describe('PUT /customers/:id', () => {
    it('should OK', async () => {
      const newCus = await seedData()

      return request(app.getHttpServer())
        .put(`/customers/${newCus.body.id}`)
        .send({ name: 'Duc Thien' })
        .expect(res => expect(res.body).toStrictEqual({ ...mockResponse, name: 'Duc Thien' }))
        .expect(HttpStatus.OK)
    })

    it('should failed as customer not found', async () => {
      const mockObjectId = new mongoose.Types.ObjectId()
      return request(app.getHttpServer())
        .put(`/customers/${mockObjectId}`)
        .send({ name: 'Duc Thien' })
        .expect(/Customer not found!/)
        .expect(HttpStatus.NOT_FOUND)
    })
  })

  it('DELETE /customers/:id', async () => {
    const newCus = await seedData()
    return request(app.getHttpServer()).delete(`/customers/${newCus.body.id}`).expect(HttpStatus.NO_CONTENT)
  })
})
