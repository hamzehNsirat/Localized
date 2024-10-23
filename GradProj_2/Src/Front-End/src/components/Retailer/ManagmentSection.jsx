import React from 'react';
import { Card, Button, ProgressBar } from 'react-bootstrap';

const ManagementSection = ({ icon, title, description, buttonText, progress }) => {
    return (
        <Card className="mb-3 px-2 py-2" style={{ borderRadius: '10px',border:'0', backgroundColor:'#F2F2F2',boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="me-4" style={{ fontSize: '3rem' }}>
                        {icon}
                    </div>
                    <div>
                        <Card.Title className='fw-bold'>{title}</Card.Title>
                        <Card.Text>{description}</Card.Text>

                        {/* This should be integrated with the backend */}
                        {progress && (
                            <ProgressBar now={progress}  variant="danger" style={{ height: '5px' }} />
                        )}
                    </div>
                </div>
                <Button className='rounded-pill px-5 py-2 d-flex align-content-center' style={{backgroundColor:'#BB4430',border:'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize:'14px'}}>{buttonText}</Button>
            </Card.Body>
        </Card>
    );
};

export default ManagementSection;
