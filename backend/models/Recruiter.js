const mongoose = require('mongoose');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const RecruiterSchema = new mongoose.Schema({
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
    },
    bio: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
    },
    token: {
        type: String,
    },
});

// Hash the password before a recruiter is saved
RecruiterSchema.pre('save', function (next) {
    const recruiter = this;
    if (!recruiter.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(recruiter.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            recruiter.password = hash;
            next();
        });
    });
});

// Send response back as JSON without the password
RecruiterSchema.methods.toJSON = function () {
    const recruiter = this;
    const recruiterObject = recruiter.toObject();
    delete recruiterObject.password;
    return recruiterObject;
};

// Find a recruiter by email and password
RecruiterSchema.statics.findByCredentials = async (email, password) => {
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    return recruiter;
};

// Generate an auth token for the recruiter
RecruiterSchema.methods.generateAuthToken = async function () {
    const recruiter = this;
    const token = jwt.sign({ _id: recruiter._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    recruiter.token = token;
    await recruiter.save();
    return token;
};

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

module.exports = Recruiter;