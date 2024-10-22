import React, {useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import '../../style/signUp.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const SignUpStep1 = ({ formData, handleInputChange, nextStep, isChecked, handleCheckboxChange }) => {

    const onCheckboxChange = () => {
        handleCheckboxChange(!isChecked); 
    };
    return (
        <>
         <div className='container mb-2 mt-2'>
                <h3 className='mb-0 mt-0'>Localized</h3>
                <h6 className='mt-0 mb-3'>Choose your Position:</h6>
                    <div className="btn-group-toggle d-flex gap-4" data-toggle="buttons">
                        <label className={`w-100 btn btn-radio ${formData.position === 'retailer' ? 'btn-light' : 'btn-dark'}`}>
                            <input type="radio" name="position" value="retailer" autoComplete="off" checked={formData.position === 'retailer'} onChange={handleInputChange} style={{ display: 'none'}} /> 
                            Retailer
                        </label>
                        <label className={`w-100 btn btn-radio ${formData.position === 'supplier' ? 'btn-light' : 'btn-dark'}`}>
                            <input type="radio" name="position" value="supplier" autoComplete="off" checked={formData.position === 'supplier'} onChange={handleInputChange} style={{ display: 'none' }} /> 
                            Supplier
                        </label>
                    </div>
         </div>
         <div className="container">
            <Form>
            <div className='d-flex gap-4'>
            <Form.Group className="mb-2" controlId="formFirstName">
                <Form.Label className='mb-0 form-lbl'>First Name*</Form.Label>
                <Form.Control 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={{height:"2rem"}}
                />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formLastName">
                <Form.Label className='mb-0 form-lbl'>Last Name*</Form.Label>
                <Form.Control 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange} 
                    style={{height:"2rem"}}

                />
            </Form.Group>
            </div>
            <Form.Group className="mb-2" controlId="formCompanyName">
                <Form.Label className='mb-0 form-lbl'>Company Name*</Form.Label>
                <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} style={{height:"2rem"}} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formEmail">
                <Form.Label className='mb-0 form-lbl' >Company Email*</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} placeholder="company_name@example.com" onChange={handleInputChange} style={{height:"2rem"}} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formPhone">
                <Form.Label className='mb-0 form-lbl'>Company Phone*</Form.Label>
                <Form.Control type="number" name="phone" value={formData.phone} placeholder="+962" onChange={handleInputChange} style={{height:"2rem"}}/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label className='mb-0 form-lbl'>Password*</Form.Label>
                <Form.Control type="password" name="password" onChange={handleInputChange} style={{height:"2rem"}}/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formConfirmPassword">
                <Form.Label className='mb-0 form-lbl'>Confirm Password*</Form.Label>
                <Form.Control type="password" style={{height:"2rem"}}/>
            </Form.Group>
            <Form.Check 
                    type="checkbox" 
                    label="I agree to the terms and conditions" 
                    checked={isChecked} 
                    onChange={onCheckboxChange} 
                    className='mt-2'
                />
            <Button disabled={!isChecked} onClick={nextStep} variant='dark' className='mt-2 px-5 py-14 w-100 fw-bold' style={{ boxShadow: '0px 0px 14px rgba(0, 0, 0, 1)'}}>Continue</Button>
            </Form>
         </div>
        </>
    );
};

export default SignUpStep1;
