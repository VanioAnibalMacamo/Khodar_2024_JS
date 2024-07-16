import fastify, { FastifyInstance } from "fastify";
import { SubscriberController } from "../controllers/SubscriberController";
import { request } from "http";
import { AuthController } from "../controllers/authController";

const subscriberController = new SubscriberController();
const authController = new AuthController();

export async function routes(fastify: FastifyInstance){

    // Declare a route
    fastify.get('/alerts', async function handler (request, reply) {
        return { hello: 'Macamo' }
    });
    
    fastify.post("/subscribers",(request, reply) => subscriberController.create(request, reply));
    fastify.put("/subscribers",(request, reply) => subscriberController.update(request, reply));

    fastify.post("/auth/subscribers/opt", (request, reply) => authController.authOtp(request, reply));
    fastify.post("/auth/subscribers", (request, reply) => authController.loginSubscriber(request, reply));


}

