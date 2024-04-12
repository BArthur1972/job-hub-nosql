const mongoose = require('mongoose');

const JobListingSchema = new mongoose.Schema({
    jobID: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    companyName: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    employmentType: {
        type: String,
        required: true,
    },
    postingDate: {
        type: Date,
        default: Date.now,
    },
    salary: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: String,
        required: true,
    },
    experienceRequired: {
        type: String,
        required: true,
    },
    qualificationsRequired: {
        type: String,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    recruiterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true,
    },
    applicants: [{
        seekerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobSeeker',
        },
        status: String,
        dateApplied: Date,
    }],
});

const JobListing = mongoose.model('JobListing', JobListingSchema);

module.exports = JobListing;