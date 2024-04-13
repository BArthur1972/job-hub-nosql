const router = require("express").Router();
const JobListing = require("../models/JobListing");

// Get number of applicants for all job listings by a recruiter
router.get("/count/:recruiterID", async (req, res) => {
    try {
        const { recruiterID } = req.params;
        const jobListings = await JobListing.find({ recruiterID });
        let applicants = 0;
        jobListings.forEach((jobListing) => {
            applicants += jobListing.applicants.length;
        });
        res.status(200).send({ count: applicants });
    } catch (err) {
        console.log("Error getting number of applicants for all job listings by a recruiter: ", err);
        res.status(500).send({ error: err });
    }
});

module.exports = router;