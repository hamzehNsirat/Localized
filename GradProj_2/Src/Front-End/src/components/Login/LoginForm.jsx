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