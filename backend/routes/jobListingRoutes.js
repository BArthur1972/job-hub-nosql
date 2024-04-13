const router = require("express").Router();
const JobListing = require("../models/JobListing");
const Company = require("../models/Company");

// Get all job listings
router.get("/", async (req, res) => {
	try {
		const jobListings = await JobListing.find();
		res.status(200).send(jobListings);
	} catch (err) {
		console.log("Error getting all job listings: ", err);
		res.status(500).send("Error getting all job listings");
	}
});

// Get job listing by id
router.get("/:jobID", async (req, res) => {
	try {
		const jobListing = await JobListing.findById(req.params._id);
		res.status(200).send(jobListing);
	} catch (err) {
		console.log("Error getting job listing by id: ", err);
		res.status(500).send("Error getting job listing by id");
	}
});

// Get job listings by company name
router.get("/company/:companyName", async (req, res) => {
	try {
		const { companyName } = req.params;
		const jobListings = await JobListing.find(
			{ companyName: companyName }
		);
		res.status(200).send(jobListings);
	} catch (err) {
		console.log("Error getting job listings by company name: ", err);
		res.status(500).send("Error getting job listings by company name");
	}
});

// Get job listings by job title
router.get("/title/:jobTitle", async (req, res) => {
	try {
		const jobListings = await JobListing.getJobListingsByJobTitle(
			req.params.jobTitle
		);
		res.status(200).send(jobListings);
	} catch (err) {
		console.log("Error getting job listings by job title: ", err);
		res.status(500).send("Error getting job listings by job title");
	}
});

// Get job listings by location
router.get("/location/:location", async (req, res) => {
	try {
		const jobListings = await JobListing.getJobListingsByLocation(
			req.params.location
		);
		res.status(200).send(jobListings);
	} catch (err) {
		console.log("Error getting job listings by location: ", err);
		res.status(500).send("Error getting job listings by location");
	}
});


// Create a new job listing
router.post("/create", async (req, res) => {
	try {
		const { jobID, jobTitle, companyID, location, postingDate, employmentType, skillsRequired, experienceRequired, qualificationsRequired, expirationDate, salary, jobDescription, recruiterID } = req.body;

		const jobIDExists = await JobListing.findOne({ jobID });
		if (jobIDExists) {
			return res.status(400).send({ error: "Job ID is already taken." });
		}

		const companyName = await Company.findCompanyNameById(companyID);
		const jobListing = new JobListing({ jobID, jobTitle, companyID, companyName, location, postingDate, employmentType, skillsRequired, experienceRequired, qualificationsRequired, expirationDate, salary, jobDescription, recruiterID });
		await jobListing.save();
		res.status(200).send(jobListing);
	} catch (err) {
		console.log("Error creating job listing: ", err);
		res.status(500).send("Error creating job listing");
	}
});

// Get job listings by recruiter id
router.get("/recruiter/:recruiterID", async (req, res) => {
	try {
		const { recruiterID } = req.params;
		const jobListings = await JobListing.find(
			{ recruiterID: recruiterID }
		);

		res.status(200).send(jobListings);
	} catch (err) {
		console.log("Error getting job listings by recruiter id: ", err);
		res.status(500).send(err);
	}
});

// Update job listing by id
router.put("/update/", async (req, res) => {
	try {
		const { _id, jobID, jobTitle, location, employmentType, skillsRequired, experienceRequired, qualificationsRequired, expirationDate, salary, jobDescription } = req.body;
		await JobListing.findByIdAndUpdate(_id, { jobTitle, location, employmentType, skillsRequired, experienceRequired, qualificationsRequired, expirationDate, salary, jobDescription }, { new: true });
		res.status(200).send({ message: "Job listing updated successfully" });
	} catch (err) {
		console.log("Error updating job listing by id: ", err);
		res.status(500).send(err);
	}
});

// Delete job listing by id
router.delete("/delete/", async (req, res) => {
	try {
		const { _id } = req.body;
		await JobListing.findByIdAndDelete(_id);
		res.status(200).send({ message: "Job listing deleted successfully" });
	} catch (err) {
		console.log("Error deleting job listing by id: ", err);
		res.status(500).send(err);
	}
});

// Get number of job listings for a specific recruiter by recruiterID
router.get("/count/:recruiterID", async (req, res) => {
	try {
		const { recruiterID } = req.params;
		const count = await JobListing.countDocuments({ recruiterID });
		res.status(200).send({count: count});
	} catch (err) {
		console.log("Error getting number of job listings by recruiter id: ", err);
		res.status(500).send({error: err});
	}
});

// Export the router
module.exports = router;
