import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dayjs/locale/pt-br.js';
import activityRoutes from './Routes/activityRoutes.js';
import authRoutes from './Routes/authRoutes.js';



dotenv.config();
const { URL_CONNECT_MONGO, PORT } = process.env;
const port = PORT || 5000

const app = express();
app.use(cors());
app.use(json());


app.use(authRoutes);
app.use(activityRoutes);



app.listen(PORT, () => {
    console.log("servidor funfando")
});
