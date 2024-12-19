const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    evidence: { type: String, default: null },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verifications: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        approved: { type: Boolean, default: false },
        id: { type: mongoose.Schema.Types.ObjectId, default: null },
        verifiedAt: { type: Date, default: null }
    }
}, {
    _id: false,
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('UserSkill', userSkillSchema, 'userskills');