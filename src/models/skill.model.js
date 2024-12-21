const { model, Schema } = require('mongoose');

const skillSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    set: { type: String, required: true },
    tasks: [{ type: String, required: true }],
    resources: [{ type: String, required: true }],
    description: { type: String, required: true },
    score: { type: Number, required: true }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Skill', skillSchema, 'skills');