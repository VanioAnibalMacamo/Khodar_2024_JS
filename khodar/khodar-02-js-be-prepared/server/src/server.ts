// Import the framework and instantiate it
import Fastify from 'fastify'
import { routes } from './routes';
import './database/redis'

const fastify = Fastify({
  logger: true
})



fastify.register(routes)

// Run the server!
 fastify.listen({ port: 3333 }).then(() =>{
    console.log("Server Listening to 3333")
 })
