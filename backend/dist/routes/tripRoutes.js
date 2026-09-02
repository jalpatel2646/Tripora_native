"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trip_controller_1 = require("../controllers/trip.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
// External route routers nested
const stopRoutes_1 = __importDefault(require("./stopRoutes"));
const mediaRoutes_1 = __importDefault(require("./mediaRoutes"));
const expenseRoutes_1 = __importDefault(require("./expenseRoutes"));
const companionRoutes_1 = __importDefault(require("./companionRoutes"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // ALL trip routes are protected
// Nested routing
router.use('/:tripId/stops', stopRoutes_1.default);
router.use('/:tripId/media', mediaRoutes_1.default);
router.use('/:tripId/expenses', expenseRoutes_1.default);
router.use('/:tripId/companions', companionRoutes_1.default);
router.route('/')
    .post(trip_controller_1.createTrip)
    .get(trip_controller_1.getTrips);
router.route('/:id')
    .get(trip_controller_1.getTrip)
    .patch(trip_controller_1.updateTrip)
    .delete(trip_controller_1.deleteTrip);
router.patch('/:id/cover', trip_controller_1.setTripCover);
exports.default = router;
//# sourceMappingURL=tripRoutes.js.map