import {Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer.jsx';
import pic from "../../assets/landingPagePic.png";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function LandingPage(){
    return(
    <>
    <div  style={{backgroundColor:'#BB4430', height:'100vh'}} className='d-flex justify-content-center align-items-center position-relative'>
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

