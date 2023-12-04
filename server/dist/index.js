"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_js_1 = __importDefault(require("./router.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const db_js_1 = __importDefault(require("./models/db.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, db_js_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_js_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
