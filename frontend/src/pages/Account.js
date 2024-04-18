import React from 'react';
import { Container, Row } from 'react-bootstrap';
import './styles/Account.css';
import defaultProfilePic from '../assets/defaultProfilePic.jpg';
import { useSelector } from 'react-redux';
import RecruiterAnalytics from '../components/RecruiterAnalytics';

function AccountHeader({ userName }) {
	return (
		<div className="account__header">
			<h3 className="account__header-title">{userName}'s Profile</h3>
		</div>
	);
}

function UserInfo({ user }) {
	return (
		<div className="account__user-info">
			<div className="account__user-image">
				<img
					alt=""
					src={user && user.profilePicture !== "" ? user.profilePicture : defaultProfilePic}
					className="account__user-image-preview"
				/>
				<div className="account__user-image-change">
					<p>Profile Picture</p>
				</div>
			</div>
			<div className="account__user-details">
				<div className="account__user-name">
					<p className="account__user-name-label">Username:</p>
					<p className="account__user-name-value">
						{user ? user.firstName : 'N/A'} {user ? user.lastName : 'N/A'}
					</p>
				</div>
				<div className="account__user-email">
					<p className="account__user-email-label">Email:</p>
					<p className="account__user-email-value">{user ? user.email : 'N/A'}</p>
				</div>
				<div className="account__user-phone">
					<p className="account__user-phone-label">Phone:</p>
					<p className="account__user-phone-value">{user ? user.contactNumber : 'N/A'}</p>
				</div>
				<div className="account__user-bio">
					<p className="account__user-bio-label">Bio:</p>
					<p className="account__user-bio-value">{user ? user.bio : 'N/A'}</p>
				</div>
			</div>
		</div>
	);
}

function JobSeekerInfo({ skillsList, educationList, experienceList }) {
	const formatDateAsMonthDayYear = (date) => {
		const formattedDate = new Date(date);
		return formattedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	};

	return (
		<div className="account__jobseeker-info">
			<div className="account__skills">
				<h4 className="account__skills-title">Skills</h4>
				<ul className="account__skills-list">
					{skillsList.map((skill, index) => (
						<li key={index} className="account__skills-item">
							{skill}
						</li>
					))}
				</ul>
			</div>
			<div className="account__education">
				<h4 className="account__education-title">Education</h4>
				{educationList.map((education, index) => (
					<div key={index} className="account__education-item">
						<ul className="account__education-details">
							<li className="account__education-institution">{education.institution}</li>
							<li className="account__education-degree">{education.degree}</li>
							<li className="account__education-discipline">{education.discipline}</li>
							<li className="account__education-dates">
								{education.startYear} to {education.endYear ? education.endYear : "Now"}
							</li>
						</ul>
					</div>
				))}
			</div>
			<div className="account__experience">
				<h4 className="account__experience-title">Experience</h4>
				{experienceList.map((experience, index) => (
					<div key={index} className="account__experience-item">
						<ul className="account__experience-details">
							<li className="account__experience-role">{experience.role}</li>
							<li className="account__experience-company">{experience.company}</li>
							<li className="account__experience-dates">
								{formatDateAsMonthDayYear(experience.startDate)} to {experience.endDate ? formatDateAsMonthDayYear(experience.endDate) : "Now"}
							</li>
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

function Account() {
	const { user, userRole } = useSelector((state) => state.user);

	return (
		<Container className="account__container">
			<Row>
				<AccountHeader userName={user ? user.firstName : "N/A"} />
				<div className="account__divider" />
			</Row>
			<Row>
				<UserInfo user={user} />
			</Row>
			{userRole === 'jobseeker' && (
				<>
					<div className="account__divider" />
					<Row>
						<JobSeekerInfo
							skillsList={user.skills}
							educationList={user.education}
							experienceList={user.experience}
						/>
					</Row>
				</>
			)}
			{userRole === 'recruiter' && (
				<>
					<div className="account__divider" />
					<Row>
						<RecruiterAnalytics />
					</Row>
				</>
			)}
		</Container>
	);
}

export default Account;