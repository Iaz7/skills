const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    set: { type: String, required: true },
    tasks: [{ type: String, required: true }],
    resources: [{ type: String, required: true }],
    description: { type: String, required: true },
    score: { type: Number, required: true }
}, {
    _id: false,
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Skill', skillSchema, 'skills');