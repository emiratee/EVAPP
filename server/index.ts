import express from "express";
import cors from 'cors';
import router from './router.js';
import dotenv from "dotenv";
dotenv.config({ path: './.env' });
import db from './models/db.js';

const app = express();
const PORT = 3000;
db();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});