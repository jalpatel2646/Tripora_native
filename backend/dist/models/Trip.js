"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tripSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coverImage: { type: String },
    stops: [{
            cityName: String,
            country: String,
            startDate: Date,
            endDate: Date,
            activities: [{
                    title: String,
                    type: String,
                    duration: String,
                    cost: Number
                }]
        }],
}, { timestamps: true });
exports.Trip = mongoose_1.default.model('Trip', tripSchema);
//# sourceMappingURL=Trip.js.map