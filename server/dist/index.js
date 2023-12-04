"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_js_1 = __importDefault(require("./routers/router.js"));
const socketRouter_js_1 = __importDefault(require("./routers/socketRouter.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./models/db.js"));
dotenv_1.default.config({ path: './.env' });
(0, db_js_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_js_1.default);
(0, socketRouter_js_1.default)(io);
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
