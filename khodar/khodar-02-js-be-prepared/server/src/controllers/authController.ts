import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { redis } from "../database/redis";
import { error } from "console";
import { db } from "../database";
import { generate6DigitsNumber } from "../utils/utils";
export class AuthController{

    async authOtp(request: FastifyRequest, reply: FastifyReply){
        const authSchema = z.object({
            otp      : z.number(),
            deviceID: z.string()
        });

        const { otp, deviceID } = authSchema.parse(request.body)

        //Buscar o número que nós armazenamos no redis
        const phone = await redis.get(`otp_${otp}`);
        console.log(phone)

        //Verificar se existe
        if(!phone){
            return reply.status(401).send({ error: 'OTP Invalido'})
        }

        //Depois Actualizar o user com esse deviceId
        const subscriber = await db.subscriber.update({
            data:{
                deviceID,
                verified: true
            }, 
            where:{
                phone
            },
            include:{
                province: true,
                district: true
            }
        })

        //Eliminar o OTP
        await redis.delete(`otp_${otp}`);

        return reply.send(subscriber);
    }

    async loginSubscriber(request: FastifyRequest, reply: FastifyReply){

        const subscriberSchema = z.object({
            phone      : z.string().regex(/^8[2-7]\d{7}/),
        })

        const { phone} = subscriberSchema.parse(request.body)

        const subscriber = await db.subscriber.findUnique({
            where:{
                phone
            }
        });

        if(!subscriber) return reply.status(400).send({ error: 'Usuario não encontrado!'})

        //Gerar o OTP e enviar para ele
        //Enviar o OTP por SMS
        const otp = generate6DigitsNumber();
        console.log(otp)
        await redis.set(`otp_${otp}`, phone, 60 * 3)
    

        return reply.status(204).send();
    }

    
}