const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    githubId: { type: String, unique: true, sparse: true },
    score: { type: Number, default: 0 },
    admin: { type: Boolean, required: true },
    completedSkills: [{ ref: 'Skill', type: Schema.Types.ObjectId }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('User', userSchema, 'users');