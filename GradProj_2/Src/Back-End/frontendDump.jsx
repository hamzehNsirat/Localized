import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
    return (
      <div>
        <h1>About Us</h1>
        <p>This is the about page.</p>
      </div>
    );
  };
  
  export default About;
  const AppColors = {
    primaryColor: '#2C8C99',
    backgroundColor: '#ffffff',
    grayBackground: '#f2f4f3',
    blackFont: '#252525',
}

export default AppColors;

import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs = () => {
    return (
      <div>
        <h1>Contact Us</h1>
        <p>This is the Contact Us page.</p>
      </div>
    );
  };
  
  export default ContactUs;

  import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              Localized is committed to bridging the gap between suppliers and retailers in Jordan.
            </p>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-dark">Home</a></li>
              <li><a href="#about" className="text-dark">About</a></li>
              <li><a href="#contact" className="text-dark">Contact</a></li>
              <li><a href="#members" className="text-dark">Members</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled">
              <li>Email: info@localized.com</li>
              <li>Phone: +962 7 1234 5678</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className="text-center p-3 bg-dark text-white">
        © 2024 Localized. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
import { Nav, Navbar, NavDropdown, Container, Button } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppColors from './AppColors';
import logo from '../../assets/landingPageLogo.png';

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ padding: '17px 0' }}>
        <Container className='d-flex justify-content-between align-content-center'>
          <Navbar.Brand href="#home" className='fw-bold' style={{width:'10vw', textAlign:'center'}}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><img src={logo} alt='Localized' width='100%'></img></Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center" style={{textAlign:'right'}}>
            <Nav className="w-100 d-flex justify-content-center gap-4 fw-bold text-dark">
              <Nav.Link as="span">
                <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link to="/contactUs" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</Link>
              </Nav.Link>
              <NavDropdown title="Members" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action1" className="dropdown-item-hover">Retailer</NavDropdown.Item>
                <NavDropdown.Item href="#action2" className="dropdown-item-hover">Supplier</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Button onClick={handleLoginClick} className='rounded-pill px-4 py-2' style={{ backgroundColor: AppColors.primaryColor, border: 'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize: '14px' }}>
            Sign Up/Log In
          </Button>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
import {Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer.jsx';
import pic from "../../assets/landingPagePic.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppColors from './AppColors.jsx';


export default function LandingPage(){
    return(
    <>
    <div  style={{backgroundColor:AppColors.primaryColor, height:'100vh'}} className='d-flex justify-content-center align-items-center position-relative'>
        <div className='w-15'>
          <h1 className='text-white mb-5 fw-bold'>Discover, Connect, and <br/>
          expand your business. </h1>
          <Button onClick={()=>{useNavigate("/login")}} variant='light' className='rounded-pill px-5 py-14 fw-bold' style={{ boxShadow: '-7px 3px 1px rgba(0, 0, 0, 1)' }}>Sign Up/Log In</Button>
        </div>
        <img src={pic} style={{width:'40vw'}} className=''/>
    </div>
    <Footer></Footer>
    </>
    );
}

import 'bootstrap/dist/css/bootstrap.min.css';
import loginPic from '../../assets/loginPic.png';
import LoginForm from './LoginForm';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppColors from '../Common/AppColors';




const Login = () => {
    const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signUp');
  };
    return (
        <div  style={{height:'100vh', width:'100vw'}} className='d-flex align-items-center'>
        <div className='container px-5 d-flex justify-content-center align-content text-light'  style={{backgroundColor:AppColors.primaryColor, height:'100vh',width:'45vw', flexDirection:'column',boxShadow: '5px 0px 6px rgba(0, 0, 0, 0.5)'}}>
            <div className='wlc-msg mb-4'>
                <h3>Localized</h3>
                <h6>Welcome Back!!</h6>
            </div>
            <LoginForm/>
            <p className='mt-5'>Don't have an account?</p>
            <Button onClick={handleSignUpClick} variant='light' className='px-5 py-14 w-100 fw-bolder' style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'}}>Register</Button>
        </div>
        <div className='w-75 d-flex justify-content-center align-items-center'  style={{ height:'100vh'}}>
            <img src={loginPic} className='w-20' style={{width:'40vw'}} />
        </div>
      </div>
    );
  };
  
  export default Login;
  import { Button, Form} from 'react-bootstrap';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Perform login logic here (e.g., API call, validation)
        console.log('Email:', email, 'Password:', password);
    };
    return (
        <Form autoComplete='on'>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='mb-0'>Email</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlTextarea1">
                <Form.Label className='mb-0'>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Form.Group>
            <a style={{color:'inherit',fontSize:'0.9rem'}}>Forget Password?</a><br></br>
            <Button onClick={handleLogin} variant='dark' className='mt-4 px-5 py-14 w-100 fw-bold' style={{ boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.8)'}}>Log In</Button>
        </Form>
    );
};

export default LoginForm;
// Retailer Part 
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, Outlet } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

import userPic from '../../../assets/user.png';
import notificationLogo from '../../../assets/notification.png';
import logo from '../../../assets/headerLogo.png';
import '../styles/Header.css'; 
import AppColors from '../../Common/AppColors';

export default function Header() {
  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container className="custom-container">
          <Navbar.Brand className='custom-brand' style={{width:'10vw'}}>
            <NavLink to="/" className="custom-link">
              <img src={logo} alt='Localized' style={{width:'100%'}}/>
            </NavLink>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="nav gap-4">
                <NavLink 
                  to="/retailer" 
                  end
                  className={({ isActive }) => isActive ? "custom-link active" : "custom-link"}
                >
                  Dashboard
                </NavLink>

                <NavLink 
                  to="marketplace" 
                  className={({ isActive }) => isActive ? "custom-link active" : "custom-link"}
                >
                  Marketplace
                </NavLink>

                <NavLink 
                  to="manageQuotations" 
                  className={({ isActive }) => isActive ? "custom-link active" : "custom-link"}
                >
                  Manage Quotations
                </NavLink>

                <NavLink 
                  to="complaints" 
                  className={({ isActive }) => isActive ? "custom-link active" : "custom-link"}
                >
                  Complaints
                </NavLink>
            </Nav>
          </Navbar.Collapse>
          <div className='position-relative' style={{marginRight:'10px'}}>
            <div className='position-absolute z-2 d-flex align-content-center align-items-center justify-content-center' style={{padding:'3px',borderRadius:'50px',left:'55%',top:'-7%',color:'white', backgroundColor:AppColors.primaryColor}}>
              <div className='d-flex align-content-center align-items-center justify-content-center' style={{width:'5px', height:'5px',borderRadius:'50px', backgroundColor:'#DC3127',fontSize:'0.75rem',padding:'9px'}}>0</div>
            </div>
            <img src={notificationLogo} className='custom-icon' alt='notifications' style={{width:'33px'}}></img>
          </div>
          <img src={userPic} className="custom-icon" alt="User" />
        </Container>
      </Navbar>  
      <Outlet />
    </>
  );
}
import React, { useState } from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import { BiPlus, BiMinus } from 'react-icons/bi';
import AppColors from '../../Common/AppColors';

const QuotationProduct = ({ product,quantity,onDelete, onIncrease, onDecrease }) => {

    const handlePlusQuantity = () => {
        onIncrease(); 
    };

    const handleMinusQuantity = () => {
        if (quantity > 1) {
            onDecrease(); 
        }
    };

    return (
        <Card className="mb-3 px-2 py-2" style={{ borderRadius: '10px', border: '0', backgroundColor: '#F2F2F2', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
            <Card.Body>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col xs={1} className="d-flex justify-content-center">
                        <img src={product.image} alt='product img' style={{ width: '100%', objectFit: 'contain' }} />
                    </Col>
                    
                    <Col xs={2}>
                        <Card.Title className='fw-bold mb-0'>{product.title}</Card.Title>
                    </Col>
                    
                    <Col xs={2} className='d-flex align-items-center justify-content-center gap-3 fw-bold' style={{ color: AppColors.blackFont }}>
                        <BiMinus onClick={handleMinusQuantity} className='p-1 fs-5' style={{ borderRadius: '10px', border: '1px solid' }} />
                        {quantity}
                        <BiPlus onClick={handlePlusQuantity} className='p-1 fs-5' style={{ borderRadius: '10px', border: '1px solid' }} />
                    </Col>

                    <Col xs={2}>
                        <p className='fw-bold mb-0' style={{ fontSize: '0.8rem' }}>{(product.sellingPrice * quantity).toFixed(2)} JOD</p>
                    </Col>
                    
                    <Col xs={2} className='d-flex justify-content-center'>
                        <Button className='rounded-pill px-5 py-2'
                                style={{ backgroundColor: AppColors.primaryColor, border: 'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize: '14px' }}
                                onClick={onDelete}
                        > Delete
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default QuotationProduct;
import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import MarketplaceStyles from '../styles/MarketplaceStyles';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => (
    <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup className="w-75">
            <FormControl
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
                <FaSearch style={{ ...MarketplaceStyles.iconStyle }} onClick={handleSearch} />
            </InputGroup.Text>
        </InputGroup>
        <Button
            onClick={handleSearch}
            style={{
                backgroundColor: '#2C8C99',
                border: 'none',
                boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)',
                fontSize: '14px',
                width: '15%',
            }}
            className="mx-4 rounded-pill px-4 py-2"
        >
            Search
        </Button>
    </div>
);

export default SearchBar;
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarketplaceStyles from '../styles/MarketplaceStyles.jsx'
import AppColors from '../../Common/AppColors.jsx';



const Sidebar = ({ filters, setFilters, categories }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { 
                setIsScrolled(true); 
            } else {
                setIsScrolled(false); 
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleFilterChange = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: !prevFilters[category]
        }));
    };

    const sidebarStyles = {
        backgroundColor: '#F2F4F3',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: isScrolled ? '0px' : '100px',
        height: isScrolled ? '100vh' : 'calc(100% - 100px)',
        width: '250px',
        transition: 'top 0.3s ease, height 0.3s ease',
    };

    const filterItemStyles = {
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    };

    const dividerStyles = {
        margin: '3px 0',
        borderTop: `1px solid ${AppColors.primaryColor}`,
    };

    return (
        <div style={sidebarStyles}>
            <h4 className='fw-bold'>Filters</h4>
            <div 
                style={filterItemStyles}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6e6e6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setFilters((prevFilters) => ({ ...prevFilters, favorites: !prevFilters.favorites }))} 

            >
                <input 
                    type="checkbox" 
                    checked={filters.favorites} 
                    onChange={() => setFilters((prevFilters) => ({ ...prevFilters, favorites: !prevFilters.favorites }))} 
                    className="filter-input"
                />
                <label className="filter-label m-2">Favorites</label>
            </div>

            <div style={dividerStyles}></div>

            {categories.map((category) => (
                <div 
                    key={category.name} 
                    className="filter-item" 
                    style={filterItemStyles}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6e6e6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleFilterChange(category.name)}
                >
                    <input 
                        type="checkbox" 
                        checked={filters[category.name]} 
                        onChange={() => handleFilterChange(category.name)}
                        className="filter-input"
                    />
                    <label className="filter-label m-2">
                       {category.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import AppColors from '../../Common/AppColors';

const ManagementSection = ({ icon, title, description, buttonText, progress }) => {
    return (
        <Card className="mb-3 px-2 py-2" style={{ borderRadius: '10px',border:'0', backgroundColor:'#F2F2F2',boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
            <Card.Body className="d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-between align-items-center align-content-center">
                    <div className='d-flex align-items-center align-content-center'>
                        <div className="me-4 mb-2" style={{ fontSize: '3rem' }}>
                            {icon}
                        </div>
                        <div>
                            <Card.Title className='fw-bold'>{title}</Card.Title>
                            <Card.Text>{description}</Card.Text>
                        </div>
                    </div>
                    <Button className='rounded-pill px-5 py-2 d-flex align-content-center' style={{backgroundColor:AppColors.primaryColor,border:'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize:'14px'}}>{buttonText}</Button>
                </div>
                {/* This should be integrated with the backend */}
                {progress && (
                            <ProgressBar now={progress}  variant="dark" style={{ height: '6px', width:'50%', backgroundColor:'#b5b3b3'}} ><div 
                            style={{ 
                                backgroundColor: AppColors.primaryColor, 
                                width: `${progress}%` 
                            }}
                        /></ProgressBar>
                        )}
            </Card.Body>
        </Card>
    );
};

export default ManagementSection;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRequestedProducts } from '../../Providers/requestedProductsProvider';
import AppColors from '../../Common/AppColors';

const PopupProduct = ({ showModal, handleCloseModal, selectedProduct, handleFavorite, justView, companyProducts }) => {
    const navigate = useNavigate();

    const { requestedProducts, setRequestedProducts } = useRequestedProducts();


    const handleViewProduct = (selectedProduct) => {
        setRequestedProducts([...requestedProducts, selectedProduct])
        const companyName = selectedProduct.company;
        navigate(`/retailer/${companyName}-Products`, { state: {companyName,companyProducts } });
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered size='lg' style={{backdropFilter: 'blur(2px)'}}>
            <Modal.Header closeButton={true}  style={{backgroundColor:'#e6e6e6'}}>
                <h5 className="modal-title">{selectedProduct.title}</h5>
            </Modal.Header>
            <Modal.Body closeButton  style={{backgroundColor:'#efefef'}}>
                <div className='d-flex gap-3' style={{ marginRight: '20px',width:'100%'}}>
                    <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '40%', objectFit: 'contain' }} />
                    <div style={{ textAlign: 'left', width:'55%'}}>
                        <h2 className="fw-bold">{selectedProduct.title}</h2>
                        <h6 className="text-muted">{selectedProduct.company}</h6>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='d-flex flex-column align-items-start'>
                                <h5 className='mb-0 fw-bold' style={{color:'#C1272D', letterSpacing:'0.05rem'}}>{selectedProduct.lowestBuyingPrice} - {selectedProduct.highestBuyingPrice} JOD</h5>
                                <p className='text-muted mt-0' style={{fontSize:'0.7rem'}}>Buying price</p>
                            </div>
                            <div className='d-flex flex-column align-items-start'>
                                <h5 className='mb-0 fw-bold' style={{letterSpacing:'0.05rem'}}>{selectedProduct.sellingPrice}</h5>
                                <p className='text-muted mt-0' style={{fontSize:'0.7rem'}}>Selling price</p>
                            </div>
                            <div className='d-flex flex-column align-items-start'>
                                <h5 className='mb-0 fw-bold' style={{color:AppColors.primaryColor, letterSpacing:'0.05rem'}}>{selectedProduct.ExpProfMargin} JOD</h5>
                                <p className='text-muted mt-0' style={{fontSize:'0.7rem'}}>Expected Profit Margin</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem'}}>
                            Introducing "Red Twist" Ketchup from Food Company, a savory blend of vine-ripened tomatoes and secret spices. 
                            Perfect for burgers, fries, and sandwiches, our ketchup adds a burst of flavor to every bite. 
                            Trust Food Company for quality and taste in every squeeze.
                        </p>
                    </div>
                </div>
                {!justView && <div className='fw-bold'>
                    <Button onClick={()=> handleViewProduct(selectedProduct)} variant="dark" className="w-100 my-2 mt-4 fs-6">Add to cart</Button>
                    <Button onClick={() => handleFavorite(selectedProduct.id)} style={{ backgroundColor: AppColors.primaryColor }} className="w-100 fs-6">Add to Favorites</Button>
                </div>}
            </Modal.Body>
        </Modal>
    );
};

export default PopupProduct;
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import MarketplaceStyles from '../styles/MarketplaceStyles';

const ProductCard = ({ product, favorites, handleFavorite, handleViewProduct, handleRequestProduct }) => {

    const isFavorite = favorites.includes(product.id) ? 
        <FaHeart className="w-25 fs-5 text-danger" onClick={() => handleFavorite(product.title, product.id)} style={{ ...MarketplaceStyles.iconStyle }} /> : 
        <FaRegHeart className="w-25 fs-5" onClick={() => handleFavorite(product.title, product.id)} style={{ ...MarketplaceStyles.iconStyle }} />;
    return (
        <Card className="h-100 text-center d-flex flex-column justify-content-center align-items-center" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#F2F4F3' }}>
            <div className="w-75 p-4 m-3 mb-0 d-flex justify-content-center" style={{ backgroundColor: 'white' }}>
                <Card.Img variant="top" src={product.image} alt={product.title} style={{ width: 'max-content', objectFit: 'contain' }} />
            </div>
            <Card.Body className="w-75 px-0">
                <Card.Title className="mt-0 fw-bold">{product.title}</Card.Title>
                <Card.Text>{product.company}</Card.Text>
                <Button variant="dark" className="w-100 fw-bold" onClick={() => {handleRequestProduct(product)}}>Add to cart</Button>
                <div className="d-flex align-items-center w-100 mt-2">
                    <Button className="text-light w-75" style={{ ...MarketplaceStyles.buttonStyle }} onClick={() => handleViewProduct(product)}>
                        View
                    </Button>
                    {isFavorite}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
import { productsData } from '../models/ProductData';
import { categories } from '../models/Categories';

export const filterProducts = (searchTerm, filters, favorites) => {
    const isCategoryFilterActive = categories.some(category => filters[category.name]);
    
    return productsData.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filters.favorites || favorites.includes(product.id)) &&
        (!isCategoryFilterActive || categories.some(category => filters[category.name] && product.category === category.name))
    );
};

export const filterProductsByCompany = (company) => {
    return productsData.filter(product => product.company === company);
};
export const categories = [
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
import yogurt from '../dumpAssets/yogurt.png';
import ketchup from '../dumpAssets/ketchup.png';
import rice from '../dumpAssets/rice.png';
import sugar from '../dumpAssets/sugar.png';

const calculateExpProfMargin = (sellingPrice, lowestBuyingPrice, highestBuyingPrice) => {
    const minProfit = (sellingPrice - highestBuyingPrice).toFixed(2);
    const maxProfit = (sellingPrice - lowestBuyingPrice).toFixed(2);
    return `${minProfit} - ${maxProfit}`;
};

export const productsData = [
    { id: 1, title: 'Yogurt', company: 'Food-company', image: yogurt, category: 'Food and Beverage', lowestBuyingPrice: 0.70, highestBuyingPrice: 0.90, sellingPrice: 1.20, ExpProfMargin: calculateExpProfMargin(1.20, 0.70, 0.90) },
    { id: 2, title: 'Ketchup', company: 'Food-company', image: ketchup, category: 'Food and Beverage', lowestBuyingPrice: 0.80, highestBuyingPrice: 1.00, sellingPrice: 1.50, ExpProfMargin: calculateExpProfMargin(1.50, 0.80, 1.00) },
    { id: 3, title: 'Rice', company: 'Food-company', image: rice, category: 'Food and Beverage', lowestBuyingPrice: 0.60, highestBuyingPrice: 0.80, sellingPrice: 1.10, ExpProfMargin: calculateExpProfMargin(1.10, 0.60, 0.80) },
    { id: 4, title: 'Mustard', company: 'Food-company', image: sugar, category: 'Food and Beverage', lowestBuyingPrice: 0.50, highestBuyingPrice: 0.75, sellingPrice: 1.00, ExpProfMargin: calculateExpProfMargin(1.00, 0.50, 0.75) },
    { id: 5, title: 'Car', company: 'Tools-company', image: yogurt, category: 'Automotive and Tools', lowestBuyingPrice: 2.00, highestBuyingPrice: 2.50, sellingPrice: 3.00, ExpProfMargin: calculateExpProfMargin(3.00, 2.00, 2.50) },
    { id: 6, title: 'Brake', company: 'Tools-company', image: ketchup, category: 'Automotive and Tools', lowestBuyingPrice: 1.80, highestBuyingPrice: 2.20, sellingPrice: 3.00, ExpProfMargin: calculateExpProfMargin(3.00, 1.80, 2.20) },
    { id: 7, title: 'Window', company: 'Tools-company', image: rice, category: 'Automotive and Tools', lowestBuyingPrice: 1.50, highestBuyingPrice: 1.90, sellingPrice: 2.50, ExpProfMargin: calculateExpProfMargin(2.50, 1.50, 1.90) },
    { id: 8, title: 'Rope', company: 'Tools-company', image: sugar, category: 'Automotive and Tools', lowestBuyingPrice: 1.20, highestBuyingPrice: 1.80, sellingPrice: 2.20, ExpProfMargin: calculateExpProfMargin(2.20, 1.20, 1.80) },
    { id: 9, title: 'Harry Potter', company: 'Books-company', image: yogurt, category: 'Books and Stationery', lowestBuyingPrice: 5.00, highestBuyingPrice: 6.00, sellingPrice: 8.00, ExpProfMargin: calculateExpProfMargin(8.00, 5.00, 6.00) },
    { id: 10, title: 'GOAT', company: 'Books-company', image: ketchup, category: 'Books and Stationery', lowestBuyingPrice: 4.50, highestBuyingPrice: 5.50, sellingPrice: 7.00, ExpProfMargin: calculateExpProfMargin(7.00, 4.50, 5.50) },
    { id: 11, title: 'The Hunger Games', company: 'Books-company', image: rice, category: 'Books and Stationery', lowestBuyingPrice: 4.00, highestBuyingPrice: 5.00, sellingPrice: 6.50, ExpProfMargin: calculateExpProfMargin(6.50, 4.00, 5.00) },
    { id: 12, title: 'La La Land', company: 'Books-company', image: sugar, category: 'Books and Stationery', lowestBuyingPrice: 4.25, highestBuyingPrice: 5.25, sellingPrice: 6.75, ExpProfMargin: calculateExpProfMargin(6.75, 4.25, 5.25) },
];
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, Container, Row, Col } from 'react-bootstrap';
import AppColors from '../../Common/AppColors.jsx';

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const complaints = [
    {id: 1, title: 'complaint title', date: formattedDate, status:'Under review'},
    {id: 2, title: 'complaint title', date: formattedDate, status:'Reviewed'},
    {id: 3, title: 'complaint title', date: formattedDate, status:'Reviewed'},
]


const ComplaintsPage = () => {

    return (
        <Container className='p-4'>
            <h2 className='fw-bold mt-4 mb-4'>Complaints</h2>
            {
                complaints.map((complaint)=>(
                    <Card key={complaint.id} className="mb-3 px-2 py-2" style={{ borderRadius: '10px', border: '0', backgroundColor: '#F2F2F2', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
                        <Card.Body>
                            <Row className="d-flex align-items-center justify-content-between">
                                <Col xs={1} className="d-flex justify-content-center">
                                    <Card.Title>#{complaint.id}</Card.Title>
                                </Col>
                                <Col xs={2}>
                                <p className='fw-bold mb-0' style={{ fontSize: '0.9rem' }}>{complaint.title}</p>
                                </Col>
                                <Col xs={2}>
                                    <p className='fw-bold mb-0' style={{ fontSize: '0.9rem' }}>{complaint.date}</p>
                                </Col>
                                <Col xs={2}>
                                    <a className='fw-bold mb-0' style={{ fontSize: '0.9rem', color:'black', cursor:'pointer' }}>View complaint</a>
                                </Col>
                                <Col xs={2}>
                                    <div className='fw-bold mb-0' style={{ fontSize: '0.8rem',width:'100%', padding:'10px',backgroundColor:complaint.status=='Reviewed'?'#AEADAD': AppColors.primaryColor,color:'white',borderRadius:'5px',textAlign:'center' }}>{complaint.status}</div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            }
        </Container>
    );
};

export default ComplaintsPage;
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useRequestedProducts } from '../../Providers/requestedProductsProvider';
import QuotationCart from './QuotationCart';
import RequestQuotationPage from './RequestQuotationPage';

const QuotationPage = () => {
    const navigate = useNavigate();
    const { requestedProducts, setRequestedProducts } = useRequestedProducts();
    const [currentStep, setCurrentStep] = useState(1);

    // Set default quantity to 1 for each product on initial render
    useEffect(() => {
        const updatedProducts = requestedProducts.map(product => ({
            ...product,
            quantity: product.quantity ?? 1 // Set quantity to 1 if undefined
        }));
        setRequestedProducts(updatedProducts);
    }, [requestedProducts, setRequestedProducts]);

    const handleContinueShopping = () => {
        navigate(-1);
    };

    const handleDelete = (id) => {
        setRequestedProducts(requestedProducts.filter(product => product.id !== id));
    };

    const handleIncreaseQuantity = (id) => {
        setRequestedProducts(requestedProducts.map(product =>
            product.id === id
                ? { ...product, quantity: (product.quantity || 1) + 1 }
                : product
        ));
    };

    const handleDecreaseQuantity = (id) => {
        setRequestedProducts(requestedProducts.map(product =>
            product.id === id && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1 }
                : product
        ));
    };

    const handleCurrentStep = (step) => {
        setCurrentStep(step);
    };

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <QuotationCart
                        requestedProducts={requestedProducts}
                        handleDelete={handleDelete}
                        handleIncreaseQuantity={handleIncreaseQuantity}
                        handleDecreaseQuantity={handleDecreaseQuantity}
                        handleNextStep={handleNextStep}
                    />
                );
            case 2:
                return (
                    <RequestQuotationPage requestedProducts={requestedProducts} />
                );
            default:
                return null;
        }
    };

    return (
        <Container className='p-3 mt-4'>
            <div className='mt-4 d-flex justify-content-between w-100'>
                <div className='d-flex align-content-center align-items-center w-100 gap-3 mt-2'>
                    <div className="step">
                        <input
                            type="radio"
                            id="cart"
                            name="step"
                            value="1"
                            checked={currentStep === 1}
                            onChange={() => handleCurrentStep(1)}
                        />
                        <label htmlFor="cart">Cart</label>
                    </div>
                    <div className="line"></div>
                    <div className="step">
                        <input
                            type="radio"
                            id="submitQuotation"
                            name="step"
                            value="2"
                            checked={currentStep === 2}
                            onChange={() => handleCurrentStep(2)}
                        />
                        <label htmlFor="submitQuotation">Submit Quotation</label>
                    </div>
                </div>

                <Button
                    variant='dark'
                    className='fw-bold'
                    style={{ width: '18%' }}
                    onClick={currentStep === 1 ? handleContinueShopping : () => handleCurrentStep(1)}
                >
                    {currentStep === 1 ? "Continue shopping" : "Back"}
                </Button>
            </div>

            {renderStep()}
        </Container>
    );
};

export default QuotationPage;
import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuotations } from '../../Providers/quotationProvider.jsx';

const RequestQuotationPage = ({ requestedProducts }) => {
    const shippingCost = 10;
    const { addQuotation } = useQuotations();

    const calculateSubtotal = () => {
        return requestedProducts.reduce((total, product) => total + (product.sellingPrice || 0) * (product.quantity || 1), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + shippingCost;
    };

    const getNextQuotationId = () => {
        const lastId = parseInt(localStorage.getItem('lastQuotationId') || '0', 10);
        const nextId = lastId + 1;
        localStorage.setItem('lastQuotationId', nextId);
        return nextId;
    };

    const createQuotation = () => {
        const subtotal = calculateSubtotal();
        const total = calculateTotal();

        const newQuotation = {
            id: getNextQuotationId(),
            supplierId: '123',
            retailerId: '1',
            status: 'Requested',
            products: requestedProducts.map(product => ({
                id: product.id,
                name: product.title,
                quantity: product.quantity || 1,
                subtotal: (product.sellingPrice * (product.quantity || 1)).toFixed(2),
            })),
            subtotal: subtotal.toFixed(2),
            shipping: shippingCost,
            total: total.toFixed(2),
        };

        addQuotation(newQuotation);
    };

    return (
        <Row className="mt-4 justify-content-between">
            <Col md={5}>
                <h4 className="fw-bold">Billing Information</h4>
                <Form style={{width:'100%'}}>

                    <div className='d-flex gap-4 justify-content-between'>
                        <Form.Group controlId="firstName" className="mb-3 w-100">
                            <Form.Label className='mb-0 fw-bold'>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First" />
                        </Form.Group>
                        <Form.Group controlId="lastName" className="mb-3 w-100">
                            <Form.Label className='mb-0 fw-bold'>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last" />
                        </Form.Group>
                    </div>
                   
                    <Form.Group controlId="companyName" className="mb-3 w-100">
                        <Form.Label className='mb-0 fw-bold'>Company Name</Form.Label>
                        <Form.Control type="text" placeholder="Company Name" />
                    </Form.Group>

                    <div className='d-flex gap-4 justify-content-between'>
                        <Form.Group controlId="city" className="mb-3 w-100">
                            <Form.Label className='mb-0 fw-bold'>City</Form.Label>
                            <Form.Control type="text" placeholder="City" />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3 w-100">
                            <Form.Label className='mb-0 fw-bold'>Address</Form.Label>
                            <Form.Control type="text" placeholder="Address" />
                        </Form.Group>
                    </div>
                    
                    <Form.Group controlId="phoneNumber" className="mb-3">
                        <Form.Label className='mb-0 fw-bold'>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="+962" />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label className='mb-0 fw-bold'>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" />
                    </Form.Group>

                </Form>
            </Col>

            <Col md={6}>
                <h4 className="fw-bold mb-4">Order Information</h4>

                <div className="p-3 border rounded">
                    <Row className="fw-bold text-muted border-bottom pb-2">
                        <Col xs={4}>Product</Col>
                        <Col xs={3} className="text-center">Quantity</Col>
                        <Col xs={3} className="text-end">Subtotal</Col>
                    </Row>

                    {requestedProducts.map((product) => (
                        <Row key={product.id} className="align-items-center py-2">
                            <Col xs={4} className="fw-bold">{product.title}</Col>
                            <Col xs={3} className="text-center">{product.quantity}</Col>
                            <Col xs={3} className="text-end">{(product.sellingPrice * (product.quantity || 1)).toFixed(2)} JOD</Col>
                        </Row>
                    ))}

                    <Row className="fw-bold mt-2 pt-2 border-top">
                        <Col xs={6}>Subtotal</Col>
                        <Col xs={4} className="text-end">{calculateSubtotal().toFixed(2)} JOD</Col>
                    </Row>
                    <Row className="fw-bold mt-2">
                        <Col xs={6}>Shipping</Col>
                        <Col xs={4} className="text-end">{`${shippingCost} JOD`}</Col>
                    </Row>
                    <Row className="fw-bold mt-2">
                        <Col xs={6}>Total</Col>
                        <Col xs={4} className="text-end">{calculateTotal().toFixed(2)} JOD</Col>
                    </Row>
                </div>
                
                <Button onClick={createQuotation} variant="dark" className="w-100 py-2 fw-bold fs-6 mt-3">Request Quotation</Button>
            </Col>
        </Row>
    );
};

export default RequestQuotationPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Products.css';
import { useFavorites } from '../../Providers/favoriteProvider';
import { useRequestedProducts } from '../../Providers/requestedProductsProvider';
import Sidebar from '../components/Sidebar';
import PopupProduct from '../components/PopupProduct.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { categories } from '../models/Categories.jsx';
import { filterProducts, filterProductsByCompany } from '../controllers/ProductController.jsx';

const RetailerMarketplace = () => {
    const navigate = useNavigate();
    const { requestedProducts,setRequestedProducts } = useRequestedProducts();
    const { favorites, handleFavorite } = useFavorites();

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ favorites: false });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        setRequestedProducts([]);
        setFilteredProducts(filterProducts('', filters, favorites));
    }, []);

    const handleSearch = () => {
        setFilteredProducts(filterProducts(searchTerm, filters, favorites));
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    
    const handleRequestProduct = (selectedProduct) => {
        setRequestedProducts([...requestedProducts, selectedProduct])
        const companyName = selectedProduct.company;
        const companyProducts=filterProductsByCompany(selectedProduct.company);
        navigate(`/retailer/${companyName}-Products`, { state: {companyName,companyProducts } });
    };


    return (
        <Container className="my-0">
            <Row>
                <Col md={3} className="pe-4">
                    <Sidebar filters={filters} setFilters={setFilters} categories={categories} />
                </Col>
                <Col md={9} className="my-4">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
                    <Row>
                        {filteredProducts.map((product) => (
                            <Col md={4} sm={6} key={product.id} className="mb-4">
                                <ProductCard product={product} favorites={favorites} handleFavorite={handleFavorite} handleViewProduct={handleViewProduct} handleRequestProduct={handleRequestProduct} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            {selectedProduct && (
                <PopupProduct
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    selectedProduct={selectedProduct}
                    companyProducts={filterProductsByCompany(selectedProduct.company)}
                    handleFavorite={handleFavorite}
                />
            )}
        </Container>
    );
};

export default RetailerMarketplace;
import 'bootstrap/dist/css/bootstrap.min.css';
import pic from '../../../assets/user.png';

import ManagementSection from '../components/ManagmentSection.jsx';
import { FaUserCircle, FaStore, FaQuestionCircle } from 'react-icons/fa'; 
import { Container } from 'react-bootstrap';
import AppColors from '../../Common/AppColors.jsx';

const RetailerPage = () => {
    return (

        <>
        <div style={{height:'110vh',width:'70vw', flexDirection:'column'}} className='container d-flex justify-content-center text-dark'>
           <div className='d-flex justify-content-between gap-3 mt-5' >
             <div>
               <h2 className='fw-bold'>Welcome, Retailer!</h2>
               <h5>Complete your profile information</h5>
             </div>
             <img src={pic} alt='Logo' width='40px' height='40px'/>
           </div>
           <Container className="mt-4 px-0 d-flex flex-column gap-3">
            <ManagementSection
                icon={<FaUserCircle color={AppColors.primaryColor} />}
                title="Manage Profile"
                description="Complete your profile information"
                buttonText="Manage"
                progress={60} // example progress bar value
            />
            <ManagementSection
                icon={<FaStore color={AppColors.primaryColor} />}
                title="Manage Establishment"
                description="Edit / Update information"
                buttonText="Manage"
            />
            <ManagementSection
                icon={<FaQuestionCircle color={AppColors.primaryColor} />}
                title="Manage Quotations"
                description="See and manage your quotations"
                buttonText="Manage"
            />
        </Container>
      </div>
      </>

    );
  };
  
  export default RetailerPage;import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHeart, FaEye } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import coverPic from '../dumpAssets/coverPic.png';
import pic from '../dumpAssets/companyLogo.png';
import MarketplaceStyles from '../styles/MarketplaceStyles.jsx';
import { useFavorites } from '../../Providers/favoriteProvider.jsx';
import PopupProduct from '../components/PopupProduct.jsx';
import AppColors from '../../Common/AppColors.jsx';
import { useRequestedProducts } from '../../Providers/requestedProductsProvider.jsx';
import ProductCard from '../components/ProductCard.jsx';

const SupplierOtherProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { favorites, handleFavorite } = useFavorites();
    const [viewedProduct, setViewedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { companyName, companyProducts } = location.state;
    const { requestedProducts, setRequestedProducts } = useRequestedProducts();

    const handleViewProduct = (product) => {
        setViewedProduct(product);
        setShowModal(true);
    };
    
    const handleCloseModal = () => setShowModal(false);

    const handleRequestProduct = (product) => {
        if (!requestedProducts.some(p => p.id === product.id)) {
            setRequestedProducts([...requestedProducts, product]);
        }
    };

    const handleExitQuotation = () => {
        navigate(-1); 
    };

    const handleQuotationDetails = () => {
        navigate(`/retailer/${companyName}-Products/newQuotation`);
    };


    return (
        <div style={{ paddingBottom: '50px' }}>
            <Row>
                <img src={coverPic} style={{ height: '140px', objectFit: 'cover' }} alt="Cover" />
            </Row>
            <Container className="mt-2">
                <Row>
                    <div style={{ width: '100px', position: 'relative' }}>
                        <img src={pic} alt='Logo' width='110px' height='110px' style={{ position: 'absolute', top: '-50%',borderRadius:'100px',filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.3))' }} />
                    </div>
                    <Col style={{ marginLeft: '3%' }}>
                        <h2 className='fw-bold mb-0'>{companyName}</h2>
                        <p className='text-muted mt-0'>Food and Beverage</p>
                    </Col>
                </Row>

                <Row className="my-4">
                    {companyProducts.map((product) => (
                        <Col md={3} key={product.id} className="mb-4">
                                <ProductCard product={product} favorites={favorites} handleFavorite={handleFavorite} handleViewProduct={handleViewProduct} handleRequestProduct={handleRequestProduct} />
                        </Col>
                    ))}
                </Row>

                <Row className="fixed-bottom p-3 border-top" style={{ backgroundColor: AppColors.primaryColor, border: '0' }}>
                    <Col className="d-flex align-items-center">
                        <div className="d-flex overflow-auto">
                            {requestedProducts.map((product) => (
                                <Image
                                    key={product.id}
                                    src={product.image}
                                    alt={product.title}
                                    className="requested-product-image mx-1"
                                    style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '10px' }}
                                />
                            ))}
                        </div>
                        <Button onClick={handleQuotationDetails} variant="dark" className="ms-auto me-2" style={{ width: '13%' }}>Proceed</Button>
                        <Button onClick={handleExitQuotation} style={{ width: '13%', backgroundColor: "transparent", textDecoration: 'underline white', border: '0' }} >Exit Quotation</Button>
                    </Col>
                </Row>

                {viewedProduct && (
                    <PopupProduct
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        selectedProduct={viewedProduct}
                        handleFavorite={handleFavorite}
                        justView={true}
                    />
                )}
            </Container>
        </div>
    );
};

export default SupplierOtherProductsPage;
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, Container, Row, Col } from 'react-bootstrap';
import AppColors from '../../Common/AppColors.jsx';

import {useQuotations}  from '../../Providers/quotationProvider.jsx';


const ManageQuotationsPage = () => {

    const {quotations} = useQuotations();


    return (
        <Container className='p-4'>
            <h2 className='fw-bold mt-4 mb-4'>Quotations</h2>
            {
                quotations.map((quotation)=>(
                    <Card key={quotation.id} className="mb-3 px-2 py-2" style={{ borderRadius: '10px', border: '0', backgroundColor: '#F2F2F2', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
                        <Card.Body>
                            <Row className="d-flex align-items-center justify-content-between">
                                <Col xs={1} className="d-flex justify-content-center">
                                    <Card.Title>#{quotation.id}</Card.Title>
                                </Col>
                                <Col xs={1}>
                                    <img src={quotation.supplierLogo} alt={quotation.supplierId} style={{ width: '100%', objectFit: 'contain' }}></img>
                                </Col>
                                <Col xs={2}>
                                    <p className='fw-bold mb-0' style={{ fontSize: '0.9rem' }}>{quotation.supplierId}</p>
                                </Col>
                                <Col xs={2}>
                                    <a className='fw-bold mb-0' style={{ fontSize: '0.9rem', color:'black',cursor:'pointer' }}>View Quotation</a>
                                </Col>
                                <Col xs={2}>
                                    <div className='fw-bold mb-0' style={{ fontSize: '0.8rem',width:'100%', padding:'10px',backgroundColor:quotation.status=='Requested'?'#AEADAD': AppColors.primaryColor,color:'white',borderRadius:'5px',textAlign:'center' }}>{quotation.status} Quotation</div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            }
        </Container>
    );
};

export default ManageQuotationsPage;
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import QuotationProduct from '../components/QuotationProduct.jsx';
import '../styles/QuotationProcess.css';

const QuotationCart = ({ requestedProducts, handleDelete, handleIncreaseQuantity, handleDecreaseQuantity, handleNextStep }) => (
    <>
        {requestedProducts.length !== 0 ? (
            <div className='mt-4'>
                {requestedProducts.map((product) => (
                    <QuotationProduct
                        key={product.id}
                        product={product}
                        quantity={product.quantity || 1}
                        onIncrease={() => handleIncreaseQuantity(product.id)}
                        onDecrease={() => handleDecreaseQuantity(product.id)}
                        onDelete={() => handleDelete(product.id)}
                    />
                ))}
            </div>
        ) : (
            <h3 className='d-flex align-content-center justify-content-center mt-5 text-muted'>Your cart is empty!</h3>
        )}

        {requestedProducts.length !== 0 && (
            <Row className="fixed-bottom p-3" style={{ backgroundColor: 'transparent', border: '0' }}>
                <Col className="d-flex align-items-center">
                    <Button onClick={() => handleNextStep()} variant="dark" className="p-2 fw-bold" style={{ width: '20%' }}>Proceed to checkout</Button>
                </Col>
            </Row>
        )}
    </>
);

export default QuotationCart;
// Supplier Part
import { Nav, Navbar, Container } from 'react-bootstrap';
import {Link, Outlet} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import userPic from '../../assets/user.png';
import settingsLogo from '../../assets/settings.png';



export default function Header(){

    return(
      <>
    <Navbar expand="lg" className="justify-content-between align-items-center" style={{backgroundColor:'#BB4430',padding:'17px 0'}}>
      <Container className='gap-4'>
        <Navbar.Brand href="#home" className='fw-bold'><Link to="/" style={{textDecoration:'none',color:'white'}}>Localized</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav justify-content-between gap-4" style={{color:'white'}}>
            <Nav.Link  href='#Dashboard' style={{color:'inherit'}}><Link to="/Dashboard" style={{textDecoration:'none',color:'inherit'}}>Dashboard</Link></Nav.Link>
            <Nav.Link href='#Products' style={{color:'inherit'}}><Link to="/Products"  style={{textDecoration:'none',color:'inherit'}}>Products</Link></Nav.Link>
            <Nav.Link href='#ManageQuotations' style={{color:'inherit'}}><Link to="/ManageQuotations"  style={{textDecoration:'none',color:'inherit'}}>Manage Quotations</Link></Nav.Link>
            <Nav.Link href='#Complaints' style={{color:'inherit'}}><Link to="/Complaints"  style={{textDecoration:'none',color:'inherit'}}>Complaints</Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <img src={settingsLogo} style={{width:'2.4rem'}}/>
        <img src={userPic} style={{width:'2.6rem'}}/>
      </Container>
    </Navbar>  
    <Outlet />
     </>
    );
}

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
                <Button   className='rounded-pill px-5 py-2 d-flex align-content-center' style={{backgroundColor:'#BB4430',border:'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize:'14px'}}>{buttonText}</Button>

            </Card.Body>
        </Card>
    );
};

export default ManagementSection;
import 'bootstrap/dist/css/bootstrap.min.css';
import pic from '../../assets/user.png';

import ManagementSection from './ManagmentSection.jsx';
import { FaUserCircle, FaStore, FaQuestionCircle } from 'react-icons/fa'; 
import { Container } from 'react-bootstrap';

const SupplierPage = () => {
    return (

        <>
        <div style={{height:'110vh',width:'70vw', flexDirection:'column'}} className='container d-flex justify-content-center text-dark'>
           <div className='d-flex justify-content-between gap-3 mt-5' >
             <div>
               <h2 className='fw-bold'>Welcome, Supplier!</h2>
               <h5>Complete your profile information</h5>
             </div>
             <img src={pic} alt='Logo' width='40px' height='40px'/>
           </div>
           <Container className="mt-4 px-0 d-flex flex-column gap-3">
            <ManagementSection
                icon={<FaUserCircle color="#A93C3C" />}
                title="Manage Profile"
                description="Complete your profile information"
                buttonText="Manage"
                progress={60} // example progress bar value
            />
            <ManagementSection
                icon={<FaStore color="#A93C3C" />}
                title="Manage Establishment"
                description="Edit / Update information"
                buttonText="Manage"
            />
            <ManagementSection
                icon={<FaQuestionCircle color="#A93C3C" />}
                title="Manage Quotations"
                description="See and manage your quotations"
                buttonText="Manage"
            />
        </Container>
      </div>
      </>

    );
  };
  
  export default SupplierPage;
  // Sign up part

  import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import './styles/signUp.css';
import retailerPic1 from '../../assets/retailer1.png';
import retailerPic2 from '../../assets/retailer2.png';
import supplierPic1 from '../../assets/supplier1.png';
import supplierPic2 from '../../assets/supplier2.png';

import SignUpStep1 from './SignUpStep1.jsx';
import SignUpStep2 from './SignUpStep2.jsx';
import SignUpStep3 from './SignUpStep3.jsx';
import SignUpStep4 from './SignUpStep4.jsx';
import AppColors from '../Common/AppColors.jsx';

const SignUp = () => {

const pics = {
    'retailer':[retailerPic1,retailerPic2],
    'supplier':[supplierPic1,supplierPic2],
}

const [currentStep, setCurrentStep] = useState(1);
const [isChecked, setIsChecked] = useState(false);


const handleCurrentStep = (step)=>{
    setCurrentStep(step);
}

const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };
    
const [formData, setFormData] = useState({
    position: 'retailer',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    website: '',
    address: '',
    street:'',
    buildingNo:'',
    description: '',
    logo: null,
    category: [],
});

const nextStep = () => {
    setCurrentStep(currentStep + 1);
};


 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

const handleFileUpload = (e) => {
    setFormData({
        ...formData,
        logo: e.target.files[0]
    });
};

const renderStep = () => {
    switch (currentStep) {
        case 1:
            return (
                <SignUpStep1
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextStep={nextStep}
                    isChecked={isChecked}
                    handleCheckboxChange={handleCheckboxChange}
                />
            );
        case 2:
            return (
                <SignUpStep2
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileUpload={handleFileUpload}
                    nextStep={nextStep}
                />
            );
        case 3:
            return (
                <SignUpStep3
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextStep={nextStep}
                />
            );
        case 4: return (
          <SignUpStep4 formData={formData} />
        );
        default:
            return null;
    }
};



    return (
      <div  style={{height:'100vh'}} className='d-flex align-items-center'>
        <div className={`${(currentStep===1||currentStep===2) && 'container'} px-5 py-4 d-flex justify-content-center align-items-center text-light`}  style={{backgroundColor:AppColors.primaryColor, height:'max-content',minHeight:'100%',width: `${(currentStep === 1 || currentStep === 2) ? '45vw' : '100vw'}`
               ,flexDirection:'column',boxShadow: '5px 0px 6px rgba(0, 0, 0, 0.5)'}}>

            {renderStep()}
            <div className='d-flex gap-1 mt-2'>
                <div 
                    onClick={()=>handleCurrentStep(1)}
                    className='lvl-1' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 1 ? 'white' : 'black', 
                        borderRadius: '100px'
                }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(2)}
                    className='lvl-2' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 2 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(3)}
                    className='lvl-3' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 3 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
                <div 
                    onClick={()=>isChecked && handleCurrentStep(4)}
                    className='lvl-4' 
                    style={{
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: currentStep === 4 ? 'white' : 'black', 
                        borderRadius: '100px'
                    }}>
                </div>
            </div>
        </div>
       { (currentStep===1 || currentStep===2) && <div className='w-75 d-flex justify-content-center align-items-center'  style={{ height:'100vh'}}>
            <img src={formData.position==='retailer'? pics['retailer'][currentStep-1]:pics['supplier'][currentStep-1]} className='w-20' style={{width:'40vw'}} alt={formData.position} />
        </div>}
      </div>
    );
  };
  
  export default SignUp;import React, {useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import './styles/signUp.css';
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
import React, { useState } from 'react';
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
  const [selectedCategories, setSelectedCategories] = useState(formData.category || []);

  const handleCategoryClick = (category) => {
    if (formData.position === 'supplier') {
      // Supplier can select only one category
      setSelectedCategories([category]);
      handleInputChange({ target: { name: 'category', value: [category] } });
    } else {
      // Retailer can select multiple categories
      const isSelected = selectedCategories.includes(category);
      const newSelection = isSelected
        ? selectedCategories.filter(cat => cat !== category)
        : [...selectedCategories, category];
      setSelectedCategories(newSelection);
      handleInputChange({ target: { name: 'category', value: newSelection } });
    }
  };

  return (
    <Container fluid className="h-100 text-center p-0 mr-0 ml-0">
      <div className='d-flex justify-content-center align-items-center' style={{ flexDirection: 'column' }}>
        <h3 className='mb-0 mt-0'>Localized</h3>
        <h6 className='mt-0 mb-2'>Set up your {formData.position} account</h6>
      </div>
      <Row className="justify-content-center">
        {categories.map((category, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card 
              className={`h-100 category-card p-0 ${selectedCategories.includes(category.name) ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedCategories.includes(category.name) ? '#FFFFFF' : 'transparent',
                border: '1px solid white',
                borderRadius: '5px',
                textAlign: 'center',
                color: selectedCategories.includes(category.name) ? '#000' : '#fff',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="category-icon mb-1" style={{ fontSize: '3rem' }}>{category.icon}</div>
              <h5 className="category-name">{category.name}</h5>
            </Card>
          </Col>
        ))}
      </Row>
      <Button onClick={nextStep} disabled={selectedCategories.length === 0} variant='dark' className='mt-2 mb-2 px-5 py-14 w-50 fw-bold' style={{ boxShadow: '0px 0px 14px rgba(0, 0, 0, 1)' }}>
        Continue
      </Button>
    </Container>
  );
};

export default SignUpStep3;
import React from 'react';
import { Button, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import emailPic from '../../assets/email.png';



const SignUpStep4 = ({ formData }) => {

    console.log(formData);

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
