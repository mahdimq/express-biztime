process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../app')
const db = require('../db')

let testCompany

beforeEach(async () => {
	const result = await db.query(
		`INSERT INTO companies (code, name) VALUES ('stbx', 'Starbucks') RETURNING code, name`
	)
	testCompany = result.rows[0]
})

afterEach(async () => {
	await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
	await db.end()
})

// describe('HOPE THIS WORKS', () => {
// 	test('BLAH', () => {
// 		console.log(testCompany)
// 		expect(1).toBe(1)
// 	})
// })

// describe('GET /companies', () => {
// 	test('Get list with one company', async () => {
// 		const res = await request(app).get('/companies')
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ companies: testCompany })
// 	})
// })

// describe('GET /companies/:code', () => {
// 	test('Get a single company', async () => {
// 		const res = await request(app).get(`/companies/${testCompany.code}`)
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ company: testCompany })
// 	})
// 	test('Respond with 404 for invalid code', async () => {
// 		const res = await request(app).get(`/companies/0`)
// 		expect(res.statusCode).toBe(404)
// 	})
// })

// describe('POST /companies', () => {
// 	test('Create a single company', async () => {
// 		const res = await request(app).post(`/companies`).send({ code: 'msft', name: 'Microsoft' })
// 		expect(res.statusCode).toBe(201)
// 		expect(res.body).toEqual({
// 			company: { code: 'msft', name: 'Microsoft' },
// 		})
// 	})
// })

// describe('PATCH /companies/:code', () => {
// 	test('Update a single company', async () => {
// 		const res = await request(app)
// 			.patch(`/companies/${testCompany.code}`)
// 			.send({ code: 'tsla', name: 'Tesla' })
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ company: { code: testCompany.code, code: 'tsla', name: 'Tesla' } })
// 	})
// 	test('Respond with 404 for invalid code', async () => {
// 		const res = await request(app).patch(`/companies/0`).send({ code: 'tsla', name: 'Telsa' })
// 		expect(res.statusCode).toBe(404)
// 	})
// })

// describe('DELETE /companies/:code', () => {
// 	test('Delete a single company', async () => {
// 		const res = await request(app).delete(`/companies/${testCompany.code}`)
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ status: 'deleted' })
// 	})
// })
