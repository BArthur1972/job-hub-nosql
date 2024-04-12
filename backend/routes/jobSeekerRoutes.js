const router = require('express').Router();
const JobSeeker = require('../models/JobSeeker');
const auth = require('../middleware/jobSeekerAuth');

// Get all job seekers
router.get('/', async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.find();
        res.status(200).send(jobSeekers);
        console.log(jobSeekers);
    } catch (err) {
        console.log('Error getting all job seekers: ', err);
        res.status(500).send({ error: err });
    }
});

// Get job seeker by id
router.get('/:jobSeekerID', async (req, res) => {
    try {
        const { jobSeekerID } = req.params;
        const jobSeeker = await JobSeeker.findById(jobSeekerID);
        res.status(200).send(jobSeeker);
        console.log(jobSeeker);
    } catch (err) {
        console.log('Error getting job seeker: ', err);
        res.status(500).send({ error: err });
    }
});

// Signup a new job seeker
router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;
        const jobSeekerExists = await JobSeeker.findOne({ email });
        if (jobSeekerExists) {
            return res.status(400).send({ error: "User already exists" });
        }
        const { firstName, lastName, password, contactNumber, bio, profilePicture } = req.body;
        const jobSeeker = new JobSeeker({ firstName, lastName, email, password, contactNumber, bio, profilePicture });
        const token = await jobSeeker.generateAuthToken(jobSeeker);
        await jobSeeker.save();

        res.status(200).send({ user: jobSeeker, token: token });
    } catch (err) {
        let msg;
        if (err.code == 11000) {
            msg = "User already exists";
        } else {
            msg = e.message;
        }
        console.log(err);
        res.status(400).send({ error: msg });
    }
});

// Login a job seeker
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const jobSeeker = await JobSeeker.findByCredentials(email, password);
        const token = await jobSeeker.generateAuthToken();
        res.status(200).send({ user: jobSeeker, token: token });
    } catch (err) {
        console.log("Error logging in job seeker: ", err);
        res.status(500).send({ error: err.message });
    }
});

// Logout a job seeker
router.post('/logout/', auth, async (req, res) => {
    try {
        const { _id } = req.body;
        const jobSeeker = await JobSeeker.findById(_id);
        jobSeeker.token = "";
        await jobSeeker.save();
        res.status(200).send({ data: "Job seeker logged out successfully" });
    } catch (err) {
        console.log("Error logging out job seeker: ", err);
        res.status(500).send({ error: err });
    }
});

// Update a job seeker
router.put('/update/', async (req, res) => {
    try {
        const { seekerID } = req.body;
        const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(seekerID, {
            $push: {
                education: { $each: req.body.educationList },
                experience: { $each: req.body.experienceList },
                skills: { $each: req.body.skills} ,
            },
            $set: {
                location: req.body.location,
                resume: req.body.resume
            }
        },
            { new: true });
        res.status(200).send({ user: updatedJobSeeker });
    } catch (err) {
        console.log("Error updating job seeker: ", err);
        res.status(500).send({ error: err });
    }
});

// // Add a job seeker education
// router.post('/education/insert', async (req, res) => {
//     try {
//         const { seekerID, educationInfo } = req.body;
//         await JobSeekerEducation.insertEducation(seekerID, educationInfo);
//         res.status(200).send({data: "Job seeker education added successfully"});
//     } catch (err) {
//         console.log("Error adding job seeker education: ", err);
//         res.status(500).send({error: err});
//     }
// });

// // Get all job seeker education
// router.get('/education/getAll/:seekerID', async (req, res) => {
//     try {
//         const { seekerID } = req.params;
//         const education = await JobSeekerEducation.getEducation(seekerID);
//         res.status(200).send(education);
//     } catch (err) {
//         console.log("Error getting job seeker education: ", err);
//         res.status(500).send({error: err});
//     }
// });

// // Add a job seeker experience
// router.post('/experience/insert', async (req, res) => {
//     try {
//         const { seekerID, experienceInfo } = req.body;
//         await JobSeekerExperience.insertExperience(seekerID, experienceInfo);
//         res.status(200).send({data: "Job seeker experience added successfully"});
//     } catch (err) {
//         console.log("Error adding job seeker experience: ", err);
//         res.status(500).send({error: err});
//     }
// });

// // Get all job seeker experience
// router.get('/experience/getAll/:seekerID', async (req, res) => {
//     try {
//         const { seekerID } = req.params;
//         const experience = await JobSeekerExperience.getExperience(seekerID);
//         res.status(200).send(experience);
//     } catch (err) {
//         console.log("Error getting job seeker experience: ", err);
//         res.status(500).send({error: err});
//     }
// });

// // Add a job seeker skill
// router.post('/skills/insert', async (req, res) => {
//     try {
//         const { seekerID, skill } = req.body;
//         await JobSeekerSkill.insertSkill(seekerID, skill);
//         res.status(200).send({data: "Job seeker skill added successfully"});
//     } catch (err) {
//         console.log("Error adding job seeker skill: ", err);
//         res.status(500).send({error: err});
//     }
// });

// // Get all job seeker skills by seekerID
// router.get('/skills/getAll/:seekerID', async (req, res) => {
//     try {
//         const seekerID = req.params.seekerID;
//         const skills = await JobSeekerSkill.getSkills(seekerID);
//         res.status(200).send(skills);
//     } catch (err) {
//         console.log("Error getting job seeker skills: ", err);
//         res.status(500).send({error: err});
//     }
// });

module.exports = router;