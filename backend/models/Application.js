const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({ 
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'JobSeeker'
    },
    status: {
        type: String,
        required: true
    },
    dateApplied: {
        type: Date,
        required: true
    }
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;

