/* eslint-disable prettier/prettier */
import { env } from './env'
import { app } from './app'


app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
