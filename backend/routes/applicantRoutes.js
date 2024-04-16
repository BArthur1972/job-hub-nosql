const router = require("express").Router();
const mongoose = require("mongoose");
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
                jobTitle: jobListing.jobTitle,
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
  
      if (
        !mongoose.Types.ObjectId.isValid(jobID) ||
        !mongoose.Types.ObjectId.isValid(seekerID)
      ) {
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
        dateApplied: new Date().toISOString(),
      });
  
      await jobListing.save();
      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).send("Error applying for job listing: " + error.message);
    }
  });


  // Withdraw application for a job listing
  router.delete('/delete', async (req, res) => {
    try {
      const { _id, seekerID } = req.body;
      console.log(_id, seekerID);
  
      if (!_id || !seekerID) {
        return res.status(400).json({ message: '_id and seekerID are required' });
      }
  
      const jobListing = await JobListing.findById(_id);
      if (!jobListing) {
        return res.status(404).send('Job listing not found');
      }
  
      console.log("JobListing is: " , jobListing);
      const applicantIndex = jobListing.applicants.findIndex(
        (applicant) => applicant.seekerID.toString() === seekerID
      );
      if (applicantIndex === -1) {
        return res.status(404).send('Application not found');
      }
  
      jobListing.applicants.splice(applicantIndex, 1);
  
      await jobListing.save();
      res.json('Application withdrawn successfully');
    } catch (error) {
      res.status(500).send('Error withdrawing application: ' + error.message);
    }
  }
);

module.exports = router;