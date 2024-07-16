import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generate6DigitsNumber } from '../utils/utils';
import { db } from "../database";
import { z } from 'zod'
import { redis } from "../database/redis";
import { error } from "console";

export class SubscriberController{

    async create(request: FastifyRequest, reply: FastifyReply){

        const subscriberSchema = z.object({
            phone      : z.string().regex(/^8[2-7]\d{7}/),
            provinceId : z.string(),
            districtId : z.string()
        })

        const { phone, provinceId, districtId} = subscriberSchema.parse(request.body)

        //Verificar se o User existe
        const subscriberExists = await db.subscriber.findUnique({where: {phone: String(phone)} });

        if(subscriberExists){
            return reply.status(401).send({ error: 'Usuario ja existente'})
        }

        const district = await db.district.findUnique({ 
            where: {
                id: districtId,
                provinceId
            }
        });

        if(!district){
            return reply.status(400).send({ error: 'Distrito não pertencente a provincia'})
        }
        
        //Verificar se existe
        //Guardar na BD se Nao existir
        const savedSubscriber =  await db.subscriber.create({
            data: {
                phone, 
                districtId,
                provinceId
            }
        });

        //Gerar o OTP e enviar para ele
        //Enviar o OTP por SMS
        const otp = generate6DigitsNumber();
        console.log(otp)
        await redis.set(`otp_${otp}`, phone, 60 * 3)
          
        return reply.status(201).send({
            subscriber: savedSubscriber
        });
    }

    async update(request: FastifyRequest, reply: FastifyReply){
        console.log(request.headers.authorization);

        const deviceID = z.string().parse(request.headers.authorization);
        
        const subscriberSchema = z.object({
            provinceId : z.string().optional(),
            districtId : z.string().optional()
        })

        const { provinceId, districtId} = subscriberSchema.parse(request.body);

        const subscriber = await db.subscriber.findUnique({
            where: {
                deviceID: deviceID,
                verified: true
            }
        });
        
        if(!subscriber) return reply.status(401).send({ error: 'Erro de autenticação' });

        const district = await db.district.findUnique({ 
            where: {
                id: districtId,
                provinceId
            }
        });

        if(!district){
            return reply.status(400).send({ error: 'Distrito não pertencente a provincia'})
        }

        const updatedSubscriber = await db.subscriber.update({
            where: {
                deviceID
            },
            data:{
                provinceId,
                districtId
            }
        })
        return reply.send(updatedSubscriber);

    }
}