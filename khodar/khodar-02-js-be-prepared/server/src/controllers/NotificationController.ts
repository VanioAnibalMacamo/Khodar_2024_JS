import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../database";

export class NotificationController{

    async create(request: FastifyRequest, reply: FastifyReply){

        const deviceID = z.string().parse(request.headers.authorization);
        
        const notificationSchema = z.object({
            message : z.string()
        })

        const { message } = notificationSchema.parse(request.body);

        const subscriber = await db.subscriber.findUnique({
            where: {
                deviceID: deviceID,
                verified: true
            }
        });
        
        if(!subscriber) return reply.status(401).send({ error: 'Erro de autenticação' });

        const notifications = await db.notification.create({
            data: {
                message,
                subscriberId: subscriber.id
            }
        });

        return reply.send(notifications);
    }

    async show(request: FastifyRequest, reply: FastifyReply){

        const paramsSchema = z.object({
            phone : z.string()
        })

        const deviceID = z.string().parse(request.headers.authorization);
        const { phone } = paramsSchema.parse(request.params);

        const subscriber = await db.subscriber.findUnique({
            where: {
                deviceID,
                verified: true,
                phone
            }
        });
        
        if(!subscriber) return reply.status(401).send({ error: 'Erro de autenticação' });

        const notifications = await db.notification.findMany({
            where:{
                subscriberId: subscriber.id
            }
        })

        return reply.send(notifications)
    }
}