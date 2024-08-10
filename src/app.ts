/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.addHook('preHandler', async(request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
