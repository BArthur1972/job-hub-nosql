const router = require("express").Router();
const JobListing = require("../models/JobListing");
const JobSeeker = require("../models/JobSeeker");

// Get all applicants for all job listings by a recruiter
router.get("/getAll/:recruiterID", async (req, res) => {
    try {
        const { recruiterID } = req.params;
        const jobListings = await JobListing.find({ recruiterID }).lean();
        let applicants = [];
        jobListings.forEach((jobListing) => {
            applicants = applicants.concat(jobListing.applicants.map((applicant) => ({
                ...applicant,
                location: jobListing.location,
                jobID: jobListing.jobID,
            })));
        }
        );

        applicants = await Promise.all(
            applicants.map(async (applicant) => {
                const jobSeeker = await JobSeeker.findById(applicant.seekerID);
                return {
                    ...applicant,
                    name: jobSeeker.firstName + " " + jobSeeker.lastName,
                    email: jobSeeker.email,
                    profilePicture: jobSeeker.profilePicture,
                };
            })
        );
        console.log("Applicants: ", applicants);
        res.status(200).send(applicants);
    } catch (err) {
        console.log("Error getting all applicants for all job listings by a recruiter: ", err);
        res.status(500).send({ error: err });
    }
});

// Update applicant status
router.put("/update", async (req, res) => {
    try {
        const { seekerID, jobID, status } = req.body;
        const jobListing = await JobListing.findOne({ jobID });
        const applicantIndex = jobListing.applicants.findIndex((applicant) => applicant.seekerID == seekerID);
        jobListing.applicants[applicantIndex].status = status;
        await jobListing.save();
        res.status(200).send({ message: "Applicant status updated successfully!" });
    } catch (err) {
        console.log("Error updating applicant status: ", err);
        res.status(500).send({ error: err });
    }
});

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