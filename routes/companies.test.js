process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../app')
const db = require('../db')

let testCompany

beforeEach(async () => {
	const result = await db.query(
		`INSERT INTO companies (code, name, description) VALUES ('stbx', 'Starbucks', 'Coffee Company') RETURNING code, name, description`
	)
	testCompany = result.rows[0]
})

afterEach(async () => {
	await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
	await db.end()
})

describe('GET /companies', () => {
	test('Get list with one company', async () => {
		const res = await request(app).get('/companies')
		expect(res.statusCode).toBe(200)
		const { code, name } = testCompany
		expect(res.body).toEqual({ companies: [{ code, name }] })
	})
})

describe('GET /companies/:code', () => {
	test('Get a single company', async () => {
		const res = await request(app).get(`/companies/${testCompany.code}`)
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual({ company: testCompany })
	})
	test('Respond with 404 for invalid code', async () => {
		const res = await request(app).get(`/companies/error`)
		expect(res.statusCode).toBe(404)
	})
})

describe('POST /companies', () => {
	test('Create a single company', async () => {
		const res = await request(app)
			.post(`/companies`)
			.send({ code: 'msft', name: 'Microsoft', description: 'Makers of windows' })
		expect(res.statusCode).toBe(201)
		expect(res.body).toEqual({
			company: { code: 'msft', name: 'Microsoft', description: 'Makers of windows' },
		})
	})
})

describe('PATCH/PUT /companies/:code', () => {
	test('Update a single company', async () => {
		const res = await request(app)
			.put(`/companies/${testCompany.code}`)
			.send({ name: 'Tesla', description: 'Electric Car Maker' })
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual({
			company: { code: testCompany.code, name: 'Tesla', description: 'Electric Car Maker' },
		})
	})
	test('Respond with 404 for invalid code', async () => {
		const res = await request(app)
			.patch(`/companies/error`)
			.send({ code: 'tsla', name: 'Telsa', description: 'Electric Car Maker' })
		expect(res.statusCode).toBe(404)
	})
})

describe('DELETE /companies/:code', () => {
	test('Delete a single company', async () => {
		const res = await request(app).delete(`/companies/${testCompany.code}`)
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual({ status: 'deleted' })
	})
})
