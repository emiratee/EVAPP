"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController_js_1 = __importDefault(require("./controllers/userController.js"));
const tripController_js_1 = __importDefault(require("./controllers/tripController.js"));
//Trips
router.post('/trip/create', tripController_js_1.default.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController_js_1.default.getFilteredTrips);
//User account
router.post('/user/account/register', userController_js_1.default.postRegister);
exports.default = router;
