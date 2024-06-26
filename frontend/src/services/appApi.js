import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for the API
const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001',
        prepareHeaders: (headers, { getState }) => {
            const user = getState().user;
            if (user && user.token) {
                headers.set('authorization', `Bearer ${user.token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Login user as a job seeker
        loginJobSeeker: builder.mutation({
            query: (payload) => ({
                url: '/jobseeker/login',
                method: 'POST',
                body: payload,
            }),
        }),

        // Login user as a recruiter
        loginRecruiter: builder.mutation({
            query: (payload) => ({
                url: '/recruiter/login',
                method: 'POST',
                body: payload,
            }),
        }),

        // Signup a new job seeker
        signupJobSeeker: builder.mutation({
            query: (user) => ({
                url: '/jobseeker/signup',
                method: 'POST',
                body: user,
            }),
        }),

        // Signup a new recruiter
        signupRecruiter: builder.mutation({
            query: (user) => ({
                url: '/recruiter/signup',
                method: 'POST',
                body: user,
            }),
        }),

        // Logout a job seeker
        logoutJobSeeker: builder.mutation({
            query: (payload) => ({
                url: '/jobseeker/logout',
                method: 'POST',
                body: payload,
            }),
        }),

        // Logout a recruiter
        logoutRecruiter: builder.mutation({
            query: (payload) => ({
                url: '/recruiter/logout',
                method: 'POST',
                body: payload,
            }),
        }),

        // Get all job seeker by id
        getJobSeekerById: builder.mutation({
            query: (id) => ({
                url: `/jobseeker/${id}`,
                method: 'GET',
            }),
        }),

        // Get all recruiter by id
        getRecruiterById: builder.mutation({
            query: (id) => ({
                url: `/recruiter/${id}`,
                method: 'GET',
            }),
        }),

        // Update job seeker
        updateJobSeeker: builder.mutation({
            query: (payload) => ({
                url: '/jobseeker/update',
                method: 'PUT',
                body: payload,
            }),
        }),

        // get all Job listings
        getAllJobListings: builder.mutation({
            query: () => ({
                url: '/joblisting/',
                method: 'GET',
            }),
        }),

        // get Company by id
        getCompanyById: builder.mutation({
            query: (id) => ({
                url: `/company/company-id/${id}`,
                method: "GET",
            }),
        }),

        // create a new job listing
        createJobListing: builder.mutation({
            query: (payload) => ({
                url: '/joblisting/create',
                method: 'POST',
                body: payload,
            }),
        }),

        // get all applications
        getAllApplications: builder.mutation({
            query: () => ({
                url: "/applicant/",
                method: "GET",
            }),
        }),

        // get applications by job seeker id
        getApplicationsByJobSeekerId: builder.mutation({
            query: (id) => ({
                url: `/applicant/seeker/${id}`,
                method: "GET",
            }),
        }),

        // get applications by job listing id
        getApplicationsByJobListingId: builder.mutation({
            query: (id) => ({
                url: `/applicant/listing/${id}`,
                method: "GET",
            }),
        }),

        // get applications by status
        getApplicationsByStatus: builder.mutation({
            query: (status) => ({
                url: `/applicant/${status}`,
                method: "GET",
            }),
        }),

        // create a new application
        createApplication: builder.mutation({
            query: (payload) => ({
                url: "/applicant/create",
                method: "POST",
                body: payload,
            }),
        }),

        // update an application
        updateApplicantStatus: builder.mutation({
            query: (payload) => ({
                url: "/applicant/update",
                method: "PUT",
                body: payload,
            }),
        }),

        // Withdraw an application
        deleteApplication: builder.mutation({
            query: (payload) => ({
                url: "/applicant/delete",
                method: "DELETE",
                body: payload,
            }),
        }),

        // Get Applicants for all job listings by a recruiter
        getApplicantsByRecruiterId: builder.mutation({
            query: (id) => ({
                url: `/applicant/getAll/${id}`,
                method: 'GET',
            }),
        }),

        getJobListingsByRecruiterId: builder.mutation({
            query: (id) => ({
                url: `/joblisting/recruiter/${id}`,
                method: 'GET',
            }),
        }),

        // Update job listing by id
        updateJobListingById: builder.mutation({
            query: (payload) => ({
                url: `/joblisting/update/`,
                method: 'PUT',
                body: payload,
            }),
        }),

        // Delete job listing by id
        deleteJobListingById: builder.mutation({
            query: (payload) => ({
                url: `/joblisting/delete/`,
                method: 'DELETE',
                body: payload,
            }),
        }),

        // Get number of job listings for a specific recruiter by recruiterID
        getNumberOfJobListingsByRecruiterId: builder.mutation({
            query: (id) => ({
                url: `/joblisting/count/${id}`,
                method: 'GET',
            }),
        }),

        // Get number of applicants for all job listings by a recruiter
        getNumberOfApplicantsByRecruiterId: builder.mutation({
            query: (id) => ({
                url: `/applicant/count/${id}`,
                method: 'GET',
            }),
        }),

        // Get Applicant Status Counts for all job listings by a recruiter
        getApplicantStatusCounts: builder.mutation({
            query: (id) => ({
                url: `/applicant/statusCounts/${id}`,
                method: 'GET',
            }),
        }),

        // Get Employment Type Counts for all job listings by a recruiter
        getEmploymentTypeCounts: builder.mutation({
            query: (id) => ({
                url: `/applicant/employmentTypeCounts/${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLoginJobSeekerMutation,
    useLoginRecruiterMutation,
    useSignupJobSeekerMutation,
    useSignupRecruiterMutation,
    useLogoutJobSeekerMutation,
    useLogoutRecruiterMutation,
    useGetJobSeekerByIdMutation,
    useGetRecruiterByIdMutation,
    useUpdateJobSeekerMutation,
    useGetAllJobListingsMutation,
    useCreateJobListingMutation,
    useGetCompanyByIdMutation,
    useGetAllApplicationsMutation,
    useGetApplicationsByJobSeekerIdMutation,
    useGetApplicationsByJobListingIdMutation,
    useGetApplicationsByStatusMutation,
    useCreateApplicationMutation,
    useUpdateApplicantStatusMutation,
    useDeleteApplicationMutation,
    useGetApplicantsByRecruiterIdMutation,
    useGetJobListingsByRecruiterIdMutation,
    useUpdateJobListingByIdMutation,
    useDeleteJobListingByIdMutation,
    useGetNumberOfApplicantsByRecruiterIdMutation,
    useGetNumberOfJobListingsByRecruiterIdMutation,
    useGetApplicantStatusCountsMutation,
    useGetEmploymentTypeCountsMutation } = appApi;

export default appApi;