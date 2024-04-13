const router = require("express").Router();
const JobListing = require("../models/JobListing");
const mongoose = require('mongoose');

// Get all applications with job listing details
router.get("/", async (req, res) => {
  try {
    // Fetch all job listings and populate details of the applicants associated with each listing
    const jobListingsWithApplicants = await JobListing.find().populate({
      path: "applicants.seekerID", // Assuming 'applicants' is an array in JobListing model and 'seekerID' references a User model
      select: "name email", // Only fetch the name and email of the applicant
    });

    // Return the job listings with applicants' details
    res.json(jobListingsWithApplicants);
  } catch (error) {
    // If an error occurs, send a server error status code and message
    res
      .status(500)
      .send("Error fetching job listings with applicants: " + error.message);
  }
});

// Get all applications for a specific job listing
router.get("/listing/:jobID", async (req, res) => {
  try {
    // Fetch the job listing by ID and populate details of the applicants associated with the listing
    const jobListingWithApplicants = await JobListing.findById(
      req.params.jobID
    ).populate({
      path: "applicants.seekerID", // Assuming 'applicants' is an array in JobListing model and 'seekerID' references a User model
    });

    // Return the job listing with applicants' details
    res.json(jobListingWithApplicants);
  } catch (error) {
    // If an error occurs, send a server error status code and message
    res
      .status(500)
      .send("Error fetching job listing with applicants: " + error.message);
  }
});

// get all applications for a seeker from all job listings
router.get("/seeker/:seekerID", async (req, res) => {
  try {
    // Fetch all job listings where the applicant with the given seekerID has applied
    const jobListingsForSeeker = await JobListing.find({
      "applicants.seekerID": req.params.seekerID,
    }).populate({
      path: "applicants.seekerID", // Assuming 'applicants' is an array in JobListing model and 'seekerID' references a User model
    });

    // Return the job listings with applicants' details
    res.json(jobListingsForSeeker);
  } catch (error) {
    // If an error occurs, send a server error status code and message
    res
      .status(500)
      .send("Error fetching job listings for seeker: " + error.message);
  }
});

// get all applications for a recuiter from all job listings
router.get("/recruiter/:recruiterID", async (req, res) => {
  try {
    // Fetch all job listings where the recruiter with the given recruiterID has posted
    const jobListingsForRecruiter = await JobListing.find({
      recruiterID: req.params.recruiterID,
    }).populate({
      path: "applicants.seekerID", // Assuming 'applicants' is an array in JobListing model and 'seekerID' references a User model
    });

    // Return the job listings with applicants' details
    res.json(jobListingsForRecruiter);
  } catch (error) {
    // If an error occurs, send a server error status code and message
    res
      .status(500)
      .send("Error fetching job listings for recruiter: " + error.message);
  }
});

// Apply for a job listing
router.post("/create", async (req, res) => {
  try {
    // Extract the jobID and seekerID from the request body
    const { jobID, seekerID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobID) || !mongoose.Types.ObjectId.isValid(seekerID)) {
        console.log("Invalid jobID or seekerID");
        return res.status(400).json({ message: "Invalid jobID or seekerID" });
    }

    // Find the job listing by ID
    const jobListing = await JobListing.findById(jobID);
    if (!jobListing) {
      return res.status(404).send("Job listing not found");
    }

    const isAlreadyApplied = jobListing.applicants.some(
      (applicant) => applicant.seekerID.toString() === seekerID
    );
    if (isAlreadyApplied) {
      return res.status(400).send("You have already applied for this job");
    }

    const validSeekerId = new mongoose.Types.ObjectId(seekerID);

    jobListing.applicants.push({
      seekerID: validSeekerId,
      status: "Applied",
      applicationDate: new Date().toISOString(),
    });

    await jobListing.save();
    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).send("Error applying for job listing: " + error.message);
  }
});

module.exports = router;
