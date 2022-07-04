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
	db = mongoClient.db("my_wallet");
});

export async function createUser(req, res){
    try{
        const newUser = req.body; //(name, email, password, confirmation)

        //senha deve conter no mínimo 8 caracteres: 
        //tendo pelo menos 1 numero, 1 letra maiuscula e 1 letra minuscula

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const newUserSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(passwordRegex),
            confirmation:joi.ref("password")
        });
        
        const { error } = newUserSchema.validate(newUser);

        if(error){
            res.status(422).send(error)
            return
        }

        const checkNewUser = await db.collection("users").findOne({email: newUser.email}) 
        if(checkNewUser){
            res.status(409).send("Email já cadastrado");
            return 
        }

        const encryptedPassword = bcrypt.hashSync(newUser.password, 10)

        await db.collection("users").insertOne({...newUser, password: encryptedPassword});
        res.sendStatus(201)

    }catch(error){
        console.log(error)
        res.sendStatus(500);
        return
    }    
}

export async function loginUser(req, res){
    try{
        const user = req.body;
        const userSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        });

        const { error } = userSchema.validate(user)
        if(error){
            res.sendStatus(422);   
            return     
        }
        const userData = await db.collection("users").findOne({email: user.email})
        
        if(user && bcrypt.compareSync(user.password, userData.password)){
            
            const token = uuid()
            console.log(token)
            

            const userToken = await db.collection("sessions").findOne({userId:ObjectId(userData._id)})
            if(!userToken){
                await db.collection("sessions").insertOne({userId:ObjectId(userData._id), token})
            }else{
                await db.collection("sessions").updateOne(
                    {userId:ObjectId(userData._id)}, 
                    {
                        $set:{token:token}
                    }
                ) 
            }
            res.status(201).send({ token, userName: userData.name })        
        }else{
            res.status(401).send("Email ou senha incorretos");
        }    
    }catch(error){
        console.log(error)
    }

}