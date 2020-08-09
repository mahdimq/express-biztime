process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../app')
const db = require('../db')

let testInvoice

beforeEach(async () => {
	const result = await db.query(
		`INSERT INTO invoices (comp_code, amt) VALUES ('stbx', 2.99) RETURNING id, comp_code, amt`
	)
	testInvoice = result.rows[0]
})

afterEach(async () => {
	await db.query(`DELETE FROM invoices`)
})

afterAll(async () => {
	await db.end()
})

describe('HOPE THIS WORKS', () => {
	test('BLAH', () => {
		console.log(testInvoice)
		expect(1).toBe(1)
	})
})

// describe('GET /invoices', () => {
// 	test('Get list with one invoice', async () => {
// 		const res = await request(app).get('/invoices')
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ invoices: [testInvoice] })
// 	})
// })

// describe('GET /invoices/:id', () => {
// 	test('Get a single invoice', async () => {
// 		const res = await request(app).get(`/invoices/${testInvoice.id}`)
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ invoice: testInvoice })
// 	})
// 	test('Respond with 404 for invalid id', async () => {
// 		const res = await request(app).get(`/invoices/0`)
// 		expect(res.statusCode).toBe(404)
// 	})
// })

// describe('POST /invoices', () => {
// 	test('Create a single invoice', async () => {
// 		const res = await request(app).post(`/invoices`).send({ comp_code: 'msft', amt: 400 })
// 		expect(res.statusCode).toBe(201)
// 		expect(res.body).toEqual({
// 			invoice: { id: expect.any(Number), comp_code: 'msft', amt: 400 },
// 		})
// 	})
// })

// describe('PATCH /invoices/:id', () => {
// 	test('Update a single invoice', async () => {
// 		const res = await request(app)
// 			.patch(`/invoices/${testInvoice.id}`)
// 			.send({ comp_code: 'tsla', amt: 35000 })
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ invoice: { id: testInvoice.id, comp_code: 'tsla', amt: 35000 } })
// 	})
// 	test('Respond with 404 for invalid id', async () => {
// 		const res = await request(app).patch(`/invoices/0`).send({ comp_code: 'tsla', amt: 35000 })
// 		expect(res.statusCode).toBe(404)
// 	})
// })

// describe('DELETE /invoices/:id', () => {
// 	test('Delete a single invoice', async () => {
// 		const res = await request(app).delete(`/invoices/${testInvoice.id}`)
// 		expect(res.statusCode).toBe(200)
// 		expect(res.body).toEqual({ status: 'deleted' })
// 	})
// })
