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
            msg = err.message;
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


module.exports = router;