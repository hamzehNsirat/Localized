import React,{useState} from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const categories = [
  { name: 'Fashion and Apparel', icon: '👕' },
  { name: 'Electronics', icon: '📱' },
  { name: 'Home and Garden', icon: '🏡' },
  { name: 'Health and Beauty', icon: '💆‍♂️' },
  { name: 'Sports and Outdoors', icon: '⚽️' },
  { name: 'Toys and Games', icon: '🎲' },
  { name: 'Automotive and Tools', icon: '🔧' },
  { name: 'Food and Beverage', icon: '🍔' },
  { name: 'Books and Stationery', icon: '📖' },
];


const SignUpStep3 = ({ formData, handleInputChange, nextStep }) => {
    const [selectedCategory, setSelectedCategory] = useState(formData.selectedCategory || null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);  
        handleInputChange({ target: { name: 'selectedCategory', value: category } });
    };


    return (
            <>
            <Container fluid className=" h-100 text-center p-0 mr-0 ml-0">
            <div className='d-flex justify-content-center align-items-center' style={{flexDirection:'column'}}>
                <h3 className='mb-0 mt-0'>Localized</h3>
                <h6 className='mt-0 mb-2'>Set up your retailer account</h6>
            </div>
      <Row className="justify-content-center">
        {categories.map((category, index) => (
          <Col key={index} md={4} className="mb-4" >
            <Card 
              className={`h-100 category-card p-0 ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedCategory === category.name ? '#FFFFFF' : '#BB4430',
                border: '1px solid white',
                borderRadius:'5px',
                textAlign:'center',
                color: selectedCategory === category.name ? '#000' : '#fff',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="category-icon mb-1" style={{ fontSize: '3rem' }}>{category.icon}</div>
              <h5 className="category-name">{category.name}</h5>
            </Card>
          </Col>
        ))}
      </Row>
      <Button onClick={nextStep} disabled={selectedCategory === null} variant='dark' className='mt-2 mb-2 px-5 py-14 w-50 fw-bold' style={{ boxShadow: '0px 0px 14px rgba(0, 0, 0, 1)'}}>Continue</Button>
    </Container>
        </>
    );
};

export default SignUpStep3;
