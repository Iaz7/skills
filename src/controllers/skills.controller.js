const Skill = require('../models/skill.model');
const UserSkill = require('../models/userskill.model');
const User = require('../models/user.model');
const path = require("path");

// View all skills in a skill tree
const viewSkills = async (req, res) => {
    // Get the skill tree from the URL route (e.g. /skills/electronics)
    const { skillTree } = req.params;
    try {
        const skills = await Skill.find({ set: skillTree }).sort({ id: 1 });
        const userSkills = await UserSkill.find();
        if (skills.length === 0) return res.status(404).render('errors/404', {
            title: 'Skill tree not found',
            message: 'The skill tree you are looking for does not exist.',
            route: `/skills/${skillTree}`
        });
        res.render('skills/list', { skills, skillTree, userSkills, user: req.session.user });
    } catch (err) {
        res.status(500).render('errors/500', { error: 'Failed to fetch skills', route: `/skills/${skillTree}` });
    }
};

// View a specific skill's details
const viewSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    // Check if the ID is a valid MongoDB ID
    if (!skillID.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${skillTree}/view/${skillID}`
    });

    try {
        const skill = await Skill.findById(skillID);
        const userSkills = await UserSkill.find({skill: skillID}).populate('user', 'username');
        if (!skill) return res.status(404).render('errors/404', {
            title: 'Skill not found',
            message: 'The skill you are looking for does not exist.',
            route: `/skills/${skillTree}/view/${skillID}`
        });
        res.render('skills/view', { skill, userSkills, user: req.session.user });
    } catch (err) {
        res.status(500).render('errors/500', { error: 'Failed to fetch skill', route: `/skills/${skillTree}/view/${skillID}` });
    };
};

// Submit evidence for skill verification
const submitEvidence = async (req, res) => {
    const { skillTree } = req.params;
    const { skillId, userSkillId, evidence } = req.body;

    try {
        if (userSkillId) {
            await UserSkill.findByIdAndUpdate(userSkillId, { evidence });
            res.json({ message: 'Evidence updated successfully' });
        } else {
            const newUserSkill = new UserSkill({
                user: req.session.user.id,
                skill: skillId,
                completed: true,
                evidence
            });
            await newUserSkill.save();
            const user = await User.findById(newUserSkill.user);
            user.completedSkills.push(newUserSkill.skill);
            await user.save();
            res.json({ message: 'Evidence submitted successfully' });
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to submit evidence' });
    }
};

// New skill form (admin only)
const addSkillForm = (req, res) => {
    const { skillTree } = req.params;
    res.render('skills/add', { skillTree, user: req.session.user });
};

// New skill (admin only)
const addSkill = async (req, res) => {
    const { skillTree } = req.params;
    const { text, description, tasks, resources, score, icon } = req.body;

    try {
        const icon = path.join("/img/skills", path.basename(req.file.path));
        const id = await Skill.countDocuments() + 1; // Get the next ID in the sequence
        const skill = new Skill({ id: id, text: req.body.text, icon: icon, set: skillTree, tasks: req.body.tasks.split("\r\n"), resources: req.body.resources.split("\r\n"), description: req.body.description, score: Number(req.body.score) });
        await skill.save();

        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        console.log(err);
        res.status(500).render('errors/500', { error: 'Failed to add skill' });
    }
};

// Verify skill
const verifySkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    const { userSkillId, approved } = req.body;

    try {
        const userSkill = await UserSkill.findById(userSkillId);
        if (userSkill.verifications != null && userSkill.verifications.find(verification => verification.user == req.session.user.id)) {
            res.status(401).json("Already verified this evidence");
        }
        else {
            userSkill.verifications.push({
                user: req.session.user.id,
                approved: approved,
            });
            if (req.session.user.admin || userSkill.verifications.filter(verification => verification.approved).length >= 3) userSkill.verified = true;
            await userSkill.save();
            res.redirect(`/skills/${skillTree}`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).render('errors/500', { error: 'Failed to verify skill' });
    }
};

// Edit skill form (admin only)
const editSkillForm = async (req, res) => {
    const { skillTree, skillID } = req.params;
    const skill = await Skill.findById(skillID);
    const treeSkillCount = await Skill.countDocuments({set: skillTree})
    if (!skill) return res.status(404).render('errors/404', {
        title: 'Skill not found',
        message: 'The skill you are looking for does not exist.',
        route: `/skills/${skillTree}`
    });
    res.render('skills/edit', { skill, skillTree, treeSkillCount, user: req.session.user });
};

// Edit skill (admin only)
const editSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        const data = {
            text: req.body.text,
            description: req.body.description,
            tasks: req.body.tasks.split("\r\n"),
            resources:req.body.resources.split("\r\n"),
            score: Number(req.body.score)
        };

        if (req.file) { data.icon = path.join("/img/skills", path.basename(req.file.path)) };

        await Skill.findByIdAndUpdate(skillID, data);
        req.flash('success_msg','Edit done successfully')
        return res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        console.log(err);
        res.status(500).render('errors/500', { error: 'Failed to update skill' });
    }
};

// Delete skill (admin only)
const deleteSkill = async (req, res) => {
    const { skillTree, skillID } = req.params;
    try {
        await UserSkill.deleteMany({ skill: skillID });
        await Skill.findByIdAndDelete(skillID);
        req.flash('success_msg', 'Skill deleted without any problem')
        res.redirect(`/skills/${skillTree}`);
    } catch (err) {
        res.status(500).render('errors/500', { error: 'Failed to delete skill' });
    }
}

module.exports = { viewSkills, viewSkill, submitEvidence, addSkillForm, addSkill, verifySkill, editSkillForm, editSkill, deleteSkill };