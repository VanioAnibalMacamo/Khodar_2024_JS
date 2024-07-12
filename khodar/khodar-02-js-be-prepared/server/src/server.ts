// Import the framework and instantiate it
import Fastify from 'fastify'
import { generate6DigitsNumber } from './utils/utils';
const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/alerts', async function handler (request, reply) {
  return { hello: 'Macamo' }
})

fastify.post("/subscribers",(request, reply) =>{
  const { phone, provinceId, districtID} = request.body
  
  //Verificar se existe
  //Guardar na BD se Nao existir
  const savedUser = { phone, provinceId, districtID };


  //Gerar o OTP e enviar para ele
  //Enviar o OTP por SMS
  const otp = generate6DigitsNumber();
  console.log(otp)


  return reply.status(201).send(savedUser);
});

// Run the server!
 fastify.listen({ port: 3333 }).then(() =>{
    console.log("Server Listening to 3333")
 })
