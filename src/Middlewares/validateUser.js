import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const { URL_CONNECT_MONGO, PORT } = process.env;
const port = PORT || 5000
const mongoClient = new MongoClient(URL_CONNECT_MONGO, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("my_wallet");
});

async function validateUser(req, res, next){
    const income = req.body; //value, description
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")

    const sessionData = await db.collection("sessions").findOne({token})

    if(!sessionData){
        return res.sendStatus(401)
    }

    
    next()


}


export default validateUser