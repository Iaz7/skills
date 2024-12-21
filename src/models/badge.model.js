const { model, Schema } = require('mongoose');

const badgeSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true },
    bitpoints_min: { type: Number, required: true },
    bitpoints_max: { type: Number, required: true },
    image_url: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Badge', badgeSchema, 'badges');