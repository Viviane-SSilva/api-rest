import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

// GET, POST, PUT, PATCH , DELETE
// http://localhost:3333/hello

app.get('/hello', async () => {
  const transactions = await knex('transactions')
  .where('amount', 1000)
  .select('*')

  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
