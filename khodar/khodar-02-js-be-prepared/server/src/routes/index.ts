import fastify, { FastifyInstance } from "fastify";
import { SubscriberController } from "../controllers/SubscriberController";

const subscriberController = new SubscriberController();

export async function routes(fastify: FastifyInstance){

    // Declare a route
    fastify.get('/alerts', async function handler (request, reply) {
        return { hello: 'Macamo' }
    });
    
    fastify.post("/subscribers",(request, reply) => subscriberController.create(request, reply));
}

