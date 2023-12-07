"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./routers/router"));
const socketRouter_1 = __importDefault(require("./routers/socketRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./models/db"));
dotenv_1.default.config({ path: './.env' });
(0, db_1.default)();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);
exports.server = server;
const io = require('socket.io')(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_1.default);
(0, socketRouter_1.default)(io);
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
