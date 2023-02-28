import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import joi from 'joi';
import dotenv from 'dotenv';
import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js'

dotenv.config();

const { URL_CONNECT_MONGO, PORT } = process.env;
const port = PORT || 5000
const mongoClient = new MongoClient(URL_CONNECT_MONGO, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("cluster0");
});


export async function userIncome(req, res){
    try{     
        const incomeSchema = joi.object({
            value: joi.number().required(),
            description: joi.string().required()
        })

        const { error } = incomeSchema.validate(income)
        if (error){
            res.sendStatus(401)
            return
        }

        await db.collection("balance").insertOne({
            value: income.value, 
            description: income.description, 
            type:"income", 
            userId: sessionData.userId,
            date: dayjs().format("DD/MM")
        })

        res.sendStatus(201)
    

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
    
    
}

export async function userOutcome(req, res){
    try{
        const outcome = req.body; //value, description
        const { authorization } = req.headers;
        const token = authorization?.replace("Bearer ", "")

        const sessionData = await db.collection("sessions").findOne({token})

        if(!sessionData){
            return res.sendStatus(401)
        }

        const outcomeSchema = joi.object({
            value: joi.number().required(),
            description: joi.string().required()
        })

        const { error } = outcomeSchema.validate(outcome)
        if (error){
            res.sendStatus(401)
            return
        }

        await db
        .collection("balance")
        .insertOne({
            value: outcome.value, 
            description: outcome.description, 
            type:"outcome", 
            userId:sessionData.userId,
            date: dayjs().format("DD/MM")
        })
        res.sendStatus(201)
        

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
}

export async function userBalance(req, res){
    try{
        const { authorization } = req.headers;
        const token = authorization?.replace("Bearer ", "")
        
        const sessionData = await db.collection("sessions").findOne({token})
        
        if(!sessionData){
            return res.sendStatus(401)
        }

        const balance = await db.collection('balance').find({userId:sessionData.userId}).toArray()
        res.send(balance)
    }catch{
        res.sendStatus(500)
    }
}
