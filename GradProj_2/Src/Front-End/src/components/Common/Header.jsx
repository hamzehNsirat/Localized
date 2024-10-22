import { Nav, Navbar, NavDropdown, Container, Button } from 'react-bootstrap';
import {Outlet,Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Header(){
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
    return(
      <>
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between align-items-center" style={{padding:'17px 0'}}>
      <Container>
        <Navbar.Brand href="#home" className='fw-bold'><Link to="/" style={{textDecoration:'none',color:'inherit'}}>Localized</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav justify-content-between gap-4 fw-bold text-dark">
            <Nav.Link  href='#about'><Link to="/about" style={{textDecoration:'none',color:'inherit'}}>About</Link></Nav.Link>
            <Nav.Link href='#contactUs'><Link to="/contactUs"  style={{textDecoration:'none',color:'inherit'}}>Contact Us</Link></Nav.Link>
            <NavDropdown title="Members" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action1">Mohammad Abuayyash</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Hamzeh Nsirat</NavDropdown.Item>
              <NavDropdown.Item href="#action3">Rafeeq Alshareef</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Hosam Osama</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Button onClick={handleLoginClick}  className='rounded-pill px-4 py-2' style={{backgroundColor:'#BB4430',border:'none', boxShadow: '-4px 3px 1px rgba(0, 0, 0, 1)', fontSize:'14px'}}>Sign Up/Log In</Button>
      </Container>
    </Navbar>
     <Outlet/>     
     </>
    );
}

