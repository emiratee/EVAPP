"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const userUtils_js_1 = require("../utils/userUtils.js");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const postCreate = async (req, res) => {
    try {
        const validUser = (0, userUtils_js_1.validateUser)(req);
        if (!validUser)
            return res.status(401).json({ error: "Authentication failed" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = {
    postCreate
};
