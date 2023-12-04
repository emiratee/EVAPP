import express from 'express';
import cors from 'cors';
import router from './routers/router.js';
import socketRouter from './routers/socketRouter.js';
import dotenv from 'dotenv';
import db from './models/db.js';

dotenv.config({ path: './.env' });
db();

const app = express();
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(cors());
app.use(express.json());
app.use(router);
socketRouter(io);


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
