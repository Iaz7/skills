const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true },
    bitpoints_min: { type: Number, required: true },
    bitpoints_max: { type: Number, required: true },
    image_url: { type: String, required: true }
}, {
    _id: false,
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Badge', badgeSchema, 'badges');