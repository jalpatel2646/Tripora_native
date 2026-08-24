"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Trip_1 = require("../models/Trip");
const router = (0, express_1.Router)();
// Create new trip
router.post('/', async (req, res) => {
    try {
        const newTrip = new Trip_1.Trip(req.body);
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Get all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip_1.Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get single trip
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip_1.Trip.findById(req.params.id);
        if (!trip)
            return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=tripRoutes.js.map