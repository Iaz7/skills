const { model, Schema } = require('mongoose');

const userSkillSchema = new Schema({
    id: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    evidence: { type: String, default: null },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verifications: {
        user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        approved: { type: Boolean, default: false },
        id: { type: Schema.Types.ObjectId, default: null },
        verifiedAt: { type: Date, default: null }
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('UserSkill', userSkillSchema, 'userskills');