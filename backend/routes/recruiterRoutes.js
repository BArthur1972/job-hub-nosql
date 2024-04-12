const router = require('express').Router();
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');
const auth = require('../middleware/recruiterAuth');

// Get all recruiters
router.get('/', async (req, res) => {
    try {
        const recruiters = await Recruiter.find();
        res.status(200).send(recruiters);
        console.log(recruiters);
    } catch (err) {
        console.log('Error getting all recruiters: ', err);
        res.status(500).send({error: err});
    }
});

// Get recruiter by id
router.get('/:recruiterID', async (req, res) => {
    try {
        const { recruiterID } = req.params;
        const recruiter = await Recruiter.findById(recruiterID);
        res.status(200).send(recruiter);
        console.log(recruiter);
    } catch (err) {
        console.log('Error getting recruiter: ', err);
        res.status(500).send({error: err});
    }
});

// Signup a new recruiter
router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName, companyName, bio, contactNumber, profilePicture } = req.body;

        const recruiterExists = await Recruiter.findOne({ email });
        if (recruiterExists) {
            return res.status(400).send({error: "User already exists"});
        }

        const companyId = await Company.findCompanyIdByName(companyName);
        const companyExists = await Company.findOne({ _id: companyId});
        if (!companyExists) {
            return res.status(400).send({error: "Company does not exist. Please make sure your company is registered as a partner with us."});
        }

        const recruiter = new Recruiter({ firstName, lastName, email, password, contactNumber, bio, profilePicture, companyId });
        const token = await recruiter.generateAuthToken();
        await recruiter.save();

        res.status(200).send({user: recruiter, token: token});
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

// Login a recruiter
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const recruiter = await Recruiter.findByCredentials(email, password);
        const token = await recruiter.generateAuthToken();
        res.status(200).send({user: recruiter, token: token});
    } catch (err) {
        console.log("Error logging in recruiter: ", err);
        res.status(500).send({ error: err.message });
    }
});

// Logout a recruiter
router.post('/logout/', auth, async (req, res) => {
    try {
        const { _id } = req.body;
        const recruiter = await Recruiter.findById(_id);
        recruiter.token = "";
        await recruiter.save();
        res.status(200).send({data: "Recruiter logged out successfully"});
    } catch (err) {
        console.log("Error logging out recruiter: ", err);
        res.status(500).send({error: err});
    }
});


module.exports = router;