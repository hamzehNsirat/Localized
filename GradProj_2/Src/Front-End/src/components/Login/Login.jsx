import 'bootstrap/dist/css/bootstrap.min.css';
import loginPic from '../../assets/loginPic.png';
import LoginForm from './LoginForm';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';




const Login = () => {
    const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signUp');
  };
    return (
        <div  style={{height:'100vh', width:'100vw'}} className='d-flex align-items-center'>
        <div className='container px-5 d-flex justify-content-center align-content text-light'  style={{backgroundColor:'#BB4430', height:'100vh',width:'45vw', flexDirection:'column',boxShadow: '5px 0px 6px rgba(0, 0, 0, 0.5)'}}>
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