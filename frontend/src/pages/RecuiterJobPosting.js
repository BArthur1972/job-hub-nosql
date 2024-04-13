import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Container, Col, Form } from "react-bootstrap";
import JobPost from "../components/JobPost";
import { useSelector } from "react-redux";
import { useGetJobListingsByRecruiterIdMutation } from "../services/appApi";

function JobPostings() {
  const { user } = useSelector((state) => state.user);
  const [jobListings, setJobListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [getJobListingsByRecruiterId] = useGetJobListingsByRecruiterIdMutation();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the job listings based on the search term
  const filteredJobListings = jobListings.filter((listing) =>
    listing.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch joblistings when the component mounts
	useEffect(() => {
		getJobListingsByRecruiterId(user._id)
			.then((response) => {
				setJobListings(response.data);
			});
	}, [getJobListingsByRecruiterId, user._id]);

  return (
    <Container fluid className="h-100 p-0 d-flex justify-content-center align-items-center">
      <Col md={9} lg={10} className="p-4 overflow-auto">
        <h3 className="text-4xl text-black font-bold mb-2">
          Your Job Postings
        </h3>
        <h5 className="text-black font-semibold mb-4">
          {filteredJobListings.length} Total Job Postings
        </h5>
        <Form className="mb-4 d-flex justify-content-between">
          <Form.Group className="flex-grow-1 me-4">
            <Form.Control
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Form>
        {filteredJobListings.length > 0 ? (
          filteredJobListings.map((listing, index) => (
            <JobPost key={index} jobListing={listing}/>
          ))
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
            <FaSearch size={32} className="mb-3" />
            <p>No applications found matching your search criteria.</p>
          </div>
        )}
      </Col>
    </Container>
  );
};

export default JobPostings;
