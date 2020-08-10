const express = require('express')
const router = express.Router()
const db = require('../db')
const ExpressError = require('../expressError')

// GET ALL ROUTE
router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT id, comp_code FROM invoices`)
		return res.json({ invoices: results.rows })
	} catch (err) {
		return next(err)
	}
})

// GET SINGLE ROUTE
router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
		if (results.rows.length === 0) {
			throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
		}
		return res.send({ invoice: results.rows[0] })
	} catch (err) {
		return next(err)
	}
})

// POST ROUTE
router.post('/', async (req, res, next) => {
	try {
		const { comp_code, amt } = req.body
		const results = await db.query(
			`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
			[comp_code, amt]
		)
		return res.status(201).json({ invoice: results.rows[0] })
	} catch (err) {
		return next(err)
	}
})

// PUT/PATCH SINGLE ROUTE
router.put('/:id', async (req, res, next) => {
	try {
		const { amt, paid } = req.body
		const payment = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [req.params.id])
		if (payment.rows.length === 0) {
			throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
		}
		// Add payment date if paid
		let payDate = null
		let currPayDate = payment.rows[0].paid_date
		if (!currPayDate && paid) {
			payDate = new Date()
		} else if (!paid) {
			payDate = null
		} else {
			payDate = currPayDate
		}

		const results = await db.query(
			`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt`,
			[amt, paid, payDate, req.params.id]
		)
		return res.send({ invoice: results.rows[0] })
	} catch (err) {
		return next(err)
	}
})

// DELETE SINGLE ROUTE
router.delete('/:id', async (req, res, next) => {
	try {
		const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [req.params.id])
		return res.send({ status: 'deleted' })
	} catch (err) {
		return next(err)
	}
})

module.exports = router
