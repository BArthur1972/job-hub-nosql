import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './styles/Account.css';
import defaultProfilePic from '../assets/defaultProfilePic.jpg';

function Account() {

    return (
        <Container className='account_container'>
            <Row>
                <div className='account_header'>
                    <h3 className='header'>Your Account</h3>
                </div>
                <div className='divider_1'></div>
            </Row >
            <Row className='user_info'>
                <Col md={4} className='user_image_box'>
                    <img
                        alt=""
                        src={defaultProfilePic}
                        style={{ width: 240, height: 250, borderRadius: "50%", objectFit: "cover", marginTop: 30 }}
                    />
                    <div className='change-profile-picture'>
                        <p>Profile Picture</p>
					</div>
                </Col>
                <Col md={8}>
                    <div className='user_info_box'>
                        <div className='user_name_box'>
                            <p className='user_name'>Username: N/A</p>
                        </div>
                        <div className='user_email_box'>
                            <p className='user_email'>Email: N/A</p>
                        </div>
                        <div className='user_bio_box'>
                            <p className='user_bio'>Bio: N/A</p>
                        </div>
                        <div className='user_password_box'>
                            <p className='user_password'>Password: **********</p>
                        </div>
                        <div className='delete_account'>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Account;