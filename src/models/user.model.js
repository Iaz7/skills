const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 },
    admin: { type: Boolean, default: false },
    completedSkills: [{ ref: 'Skill', type: Schema.Types.ObjectId }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('User', userSchema, 'users');