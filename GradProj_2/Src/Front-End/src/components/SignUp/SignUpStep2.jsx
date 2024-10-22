import React,{useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import { CloudUpload } from 'react-bootstrap-icons';


const SignUpStep2 = ({ formData, handleInputChange, handleFileUpload, nextStep }) => {
    const [fileName, setFileName] = useState(null);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            handleFileUpload(e);
        }
    };
    return (
        <div className="container">
            <h3 className='mb-0 mt-0'>Localized</h3>
            <h6 className='mt-0 mb-2'>Set up your retailer account</h6>
            <Form>
                <Form.Group className='mb-2' controlId="formWebsite">
                    <Form.Label className='mb-0 form-lbl'>Company Website</Form.Label>
                    <Form.Control
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        style={{height:"2rem"}}
                    />
                </Form.Group>

                <Form.Group className='mb-2' controlId="formAddress">
                    <Form.Label className='mb-0 form-lbl'>Company Address*</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={{height:"2rem"}}
                    />
                </Form.Group>


                <div className='d-flex gap-4'>
            <Form.Group className="mb-2 mt-2" controlId="formStreetName">
                <Form.Control className='form-lbl'
                    type="text"
                    name="street"
                    placeholder="Street*"
                    value={formData.street}
                    onChange={handleInputChange}
                    style={{height:"2rem"}}
                />
            </Form.Group>
            <Form.Group className="mb-2 mt-2" controlId="formBuildingNo">
                <Form.Control className='form-lbl'
                    type="text"
                    name="buildingNo"
                    placeholder='Building No*'
                    value={formData.buildingNo}
                    onChange={handleInputChange} 
                    style={{height:"2rem"}}
                />
            </Form.Group>
            </div>
                <Form.Group className='mb-2' controlId="formDescription">
                    <Form.Label className='mb-0 form-lbl'>Company Description*</Form.Label>
                    <Form.Control style={{fontSize:'0.85rem', resize:'none'}}
                        as="textarea"
                        name="description"
                        placeholder='Add brief description describing your company and what you resell'
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                    />
                </Form.Group>

                <Form.Group className='mb-2' controlId="formLogo">
                    <Form.Label className='mb-0 form-lbl'>Company Logo</Form.Label>
                    <div className="file-drop-area">
                        <div className="file-drop-content">
                            <CloudUpload size={30} />
                            <p className='mb-0'>{fileName ? fileName : "Choose a file or drag & drop it here"}</p>
                            <span>JPEG, PNG, up to 18MB</span>
                            <label className="btn btn-outline-dark mt-1">
                                Browse File
                                <Form.Control 
                                    type="file" 
                                    name='logo'
                                    onChange={onFileChange} 
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                </Form.Group>

                <Button onClick={nextStep} variant='dark' className='mt-2 px-5 py-14 w-100 fw-bold' style={{ boxShadow: '0px 0px 14px rgba(0, 0, 0, 1)'}}>Continue</Button>

            </Form>
        </div>
    );
};

export default SignUpStep2;
