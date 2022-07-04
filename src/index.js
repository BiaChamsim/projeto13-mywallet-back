import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dayjs/locale/pt-br.js'
import { createUser, loginUser} from './Controllers/authControllers.js'
import {userIncome, userOutcome, userBalance} from './Controllers/activityControllers.js'

dotenv.config();
const { URL_CONNECT_MONGO, PORT } = process.env;
const port = PORT || 5000

const app = express();
app.use(cors());
app.use(json());

app.post('/signup', createUser);
app.post('/login', loginUser);
app.post('/income', userIncome);
app.post('/outcome', userOutcome);
app.get('/balance', userBalance);


app.listen(PORT, () => {
    console.log("servidor funfando")
});
