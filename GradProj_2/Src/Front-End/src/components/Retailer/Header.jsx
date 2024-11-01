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
            <Nav.Link href='#Marketplace' style={{color:'inherit'}}><Link to="/Marketplace"  style={{textDecoration:'none',color:'inherit'}}>Marketplace</Link></Nav.Link>
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

