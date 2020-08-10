const express = require('express')
const router = express.Router()
const db = require('../db')
const ExpressError = require('../expressError')
const slugify = require('slugify')

// GET ALL ROUTE
router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT code, name FROM companies`)
		return res.json({ companies: results.rows })
	} catch (err) {
		return next(err)
	}
})

// GET SINGLE ROUTE
router.get('/:code', async (req, res, next) => {
	try {
		const { code } = req.params
		// Add join for industry and companies_industries
		const results = await db.query(
			`SELECT c.code, c.name, c.description, i.industry
			 FROM companies AS c
			 LEFT JOIN companies_industries AS ci
			 ON c.code = ci.company_code
			 LEFT JOIN industries AS i
			 ON ci.industry_code = i.code
			 WHERE c.code=$1
			`,
			[code]
		)
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find company with code of ${code}`, 404)
		}
		const { name, description } = results.rows[0]
		const industry = results.rows.map((ind) => ind.industry)

		return res.send({ company: code, name, description, industry })
	} catch (err) {
		return next(err)
	}
})

// POST ROUTE
router.post('/', async (req, res, next) => {
	try {
		const { name, description } = req.body
		const code = slugify(name, { lower: true })
		const results = await db.query(
			`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
			[code, name, description]
		)
		return res.status(201).json({ company: results.rows[0] })
	} catch (err) {
		return next(err)
	}
})

// PUT/PATCH SINGLE ROUTE
router.put('/:code', async (req, res, next) => {
	try {
		const { code } = req.params
		const { name, description } = req.body
		const results = await db.query(
			`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`,
			[name, description, code]
		)
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find company with code of ${code}`, 404)
		}
		return res.send({ company: results.rows[0] })
	} catch (err) {
		return next(err)
	}
})

// DELETE SINGLE ROUTE
router.delete('/:code', async (req, res, next) => {
	try {
		const results = await db.query(`DELETE FROM companies WHERE code=$1`, [req.params.code])
		return res.send({ status: 'deleted' })
	} catch (err) {
		return next(err)
	}
})

module.exports = router
