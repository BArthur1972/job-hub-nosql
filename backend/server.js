const express = require('express');
const cors = require('cors');
require('./config/dbConnection');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobListingRoutes = require('./routes/jobListingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const app = express();

// Add middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add middleware to allow cross-origin requests from client side
app.use(cors());

// Add middleware to use the routes defined in the routes folder
app.use('/jobseeker', jobSeekerRoutes);
app.use('/recruiter', recruiterRoutes);
app.use('/company', companyRoutes);
app.use('/joblisting', jobListingRoutes);
app.use('/application', applicationRoutes);

const server = require('http').createServer(app);
const PORT = 5001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
