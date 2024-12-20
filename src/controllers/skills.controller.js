const Skill = require('../models/skill.model');
const UserSkill = require('../models/userskill.model');

// View all skills in a skill tree
const viewSkills = async (req, res) => {
    // Get the skill tree from the URL route (e.g. /skills/electronics)
    const { skillTree } = req.params;
    console.log(skillTree);
    try {
        const skills = await Skill.find({ set: skillTree }).sort({ id: 1 });
        res.render('skills/view_skills', { skills, skillTree });
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to fetch skills' });
    }
};

// View a specific skill's details
const viewSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        const skill = await Skill.findById(skillID);
        if (!skill) return res.status(404).render('errors/404', {
            title: 'Skill not found',
            message: 'The skill you are looking for does not exist.',
            route: `/skills/${skillTree}`
        });
        res.render('skills/view_skill', { skill });
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to fetch skill' });
    };
};

// Submit evidence for skill verification
const submitEvidence = async (req, res) => {
    const {skillTree, skillID, userSkillID } = req.params;
    const { evidence } = req.body;

    try {
        if (userSkillID) {
            await UserSkill.findByIdAndUpdate(userSkillID, { evidence });
            res.json({ message: 'Evidence updated successfully' });
        } else {
            const newUserSkill = new UserSkill({
                user: req.session.user.id,
                skill: skillID,
                evidence
            });
            await newUserSkill.save();
            res.json({ message: 'Evidence submitted successfully' });
        };
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit evidence' });
    }
};

// New skill form (admin only)
const addSkillForm = (req, res) => {
    const { skillTree } = req.params;
    res.render('skills/add_skill', { skillTree });
};

// New skill (admin only)
const addSkill = async (req, res) => {
    const { skillTree } = req.params;
    const { text, description, tasks, resources, score, icon } = req.body;

    try {
        const newSkill = new Skill({ skillTree, text, description, tasks: tasks.split('\n'), resources: resources.split('\n'), score, icon });
        await newSkill.save();
        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to add skill' });
    };
};

// Verify skill (admin only)
const verifySkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        await UserSkill.findByIdAndUpdate(skillID, { verified: true });
        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to verify skill' });
    }
};

// Edit skill form (admin only)
const editSkillForm = async (req, res) => {
    const { skillTree, skillID } = req.params;
    const skill = await Skill.findById(skillID);
    if (!skill) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${skillTree}`
    });
    res.render('skills/edit_skill', { skill, skillTree });
};

// Edit skill (admin only)
const editSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        await Skill.findByIdAndUpdate(skillID, req.body);
        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to update skill' });
    };
};

// Delete skill (admin only)
const deleteSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        await Skill.findByIdAndDelete(skillID);
        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        res.status(500).render('500', { error: 'Failed to delete skill' });
    }
}

module.exports = { viewSkills, viewSkill, submitEvidence, addSkillForm, addSkill, verifySkill, editSkillForm, editSkill, deleteSkill };