import React from 'react';
import { Button, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import emailPic from '../../assets/email.png';



const SignUpStep4 = ({ formData }) => {

    const navigate = useNavigate();

    const handleRedirectClick = (page) => {
        navigate(page);
      };


    //IMP-NOTE: after redirecting to the specific page a session must start.
    const redirectPage = {
        'retailer':'/retailer',
        'supplier':'/supplier'
    }

    return (
            <>
            <Container fluid className=" h-100 text-center p-0 mr-0 ml-0">
            <div className='d-flex justify-content-center align-items-center' style={{flexDirection:'column'}}>
                <h3 className='mt-0'>Localized</h3>
                <h6 className='mt-0 mb-3'>Your account is almost ready! Confirm your email to proceed.</h6>
            </div>
            <div className='mb-4'>
                <img src={emailPic} className='w-25'></img>
                <h3 className='mb-2'>We've Sent an Email to {formData.email}</h3>
                <p style={{fontSize:'0.85rem'}}>Confirmation Email Sent! If you haven't received it yet<br></br>
                , please check your spam folder.</p>
            </div>
      <Button onClick={()=>{handleRedirectClick(redirectPage[formData.position])}} variant='dark' className='mt-2 mb-2 px-5 py-14 w-50 fw-bold' style={{ boxShadow: '0px 0px 14px rgba(0, 0, 0, 1)'}}>Finish</Button>
    </Container>
        </>
    );
};

export default SignUpStep4;
