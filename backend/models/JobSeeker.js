const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const JobSeekerSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		validate: [isEmail, 'Invalid email']
	},
	password: {
		type: String,
		required: true,
	},
	contactNumber: {
		type: String,
		required: true,
	},
	bio: {
		type: String,
	},
	location: {
		type: String,
	},
	education: {
		type: [Object],
	},
	experience: {
		type: [Object],
	},
	skills: {
		type: [String],
	},
	resume: {
		type: String,
	},
	profilePicture: {
		type: String,
	},
	token: {
		type: String,
	},
});

// Hash the password before a jobSeeker is saved
JobSeekerSchema.pre('save', function (next) {
    const jobSeeker = this;
    if (!jobSeeker.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(jobSeeker.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            jobSeeker.password = hash
            next();
        });
    });
});

// Send response back as a JSON without the password
JobSeekerSchema.methods.toJSON = function () {
    const jobSeeker = this;
    const jobSeekerObject = jobSeeker.toObject();
    delete jobSeekerObject.password;
    return jobSeekerObject;
};

// Find a jobSeeker
JobSeekerSchema.statics.findByCredentials = async function (email, password) {
    const jobSeeker = await JobSeeker.findOne({ email });
    if (!jobSeeker) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, jobSeeker.password);
    if (!isMatch) {
        throw new Error('Invalid email or password')
    }

    return jobSeeker;
};

// Generate an auth token
JobSeekerSchema.methods.generateAuthToken = async function () {
    const jobSeeker = this;
    const token = jwt.sign({ _id: jobSeeker._id.toString() }, process.env.JWT_SECRET );
    jobSeeker.token = token;
    await jobSeeker.save();
    return token;
};

const JobSeeker = mongoose.model("JobSeeker", JobSeekerSchema);

module.exports = JobSeeker;