import fastify, { FastifyInstance } from "fastify";
import { SubscriberController } from "../controllers/SubscriberController";
import { request } from "http";
import { AuthController } from "../controllers/authController";
import { NotificationController } from "../controllers/NotificationController";

const subscriberController = new SubscriberController();
const authController = new AuthController();
const notificationController = new NotificationController();

export async function routes(fastify: FastifyInstance){

    // Declare a route
    fastify.get('/alerts', async function handler (request, reply) {
        return { hello: 'Macamo' }
    });
    
    fastify.post("/subscribers",(request, reply) => subscriberController.create(request, reply));
    fastify.put("/subscribers",(request, reply) => subscriberController.update(request, reply));

    fastify.post("/auth/subscribers/opt", (request, reply) => authController.authOtp(request, reply));
    fastify.post("/auth/subscribers", (request, reply) => authController.loginSubscriber(request, reply));

    fastify.post("/notifications", (request, reply) => notificationController.create(request , reply));
    fastify.get("/notifications/:phone", (request, reply) => notificationController.show(request , reply)); 


}

