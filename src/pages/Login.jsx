import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/SignUp.css';
import Signup1 from '../assets/signup.png';
import Logo1 from '../assets/Logo1.png';
import { jwtDecode } from 'jwt-decode';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setremember] = useState(false);
  let BaseUrl = process.env.REACT_APP_Base_Url; // Ensure this is defined in your .env file
  let navigate= useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token'); // Prefer checking the token over 'user'
    const user =JSON.parse(localStorage.getItem('user')); // Prefer checking the token over 'user'
    if (token && user.role=="Mentor") {
      navigate("/");
    }else if(token && user.role=="Client"){
      navigate("/clientDashboard");
    }else if(token && user.role=="Admin"){
      navigate("/superAdminDashboard");
    }
    // Removed `navigate` from the dependency array to prevent re-triggering by navigate changes
  }, []); 

  const handleSubmit = async (event) => {
    event.preventDefault();


    // console.log(remember,email,password);
    // return;

    try {
      const response = await axios.post(`${BaseUrl}/api/user/login`, {
        email: email,
        password,
        remember
      });

      if (response.data) {
        let token = response.data.token;
        let user = response.data.user;
        const decodedToken = jwtDecode(token);

        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));

        if(user.role=='Mentor'){
          navigate("/");
        }else if(user.role=='Client'){
          navigate("/clientDashboard");
        }else if(token && user.role=="Admin"){
          navigate("/superAdminDashboard");
        }
        // Redirect to home page
      }
    } catch (error) {
      console.error('Login error', error.response || error);
      alert('Failed to login. Please check your username and password.');
    }
  };

  return (
    <div className='signup_page'>
      <img src={Signup1} alt="SignUp" />
      <form className='form-container' onSubmit={handleSubmit}>
        <img src={Logo1} alt="Logo" />
        <p className='sign_as_mentor'>Sign In As Mentor</p>
        <p className='mb-[1rem] max-sm:[300px]'>Enter your email and password to Sign In</p>

        <div className="form-group">
          <input 
            type="email" 
            placeholder='Email' 
            id="email" 
            name="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className="form-group ">
          <input 
            type="password" 
            placeholder='Current Password' 
            id="password" 
            name="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div className="form-group password-container">
          <label className="switch">
            <input type="checkbox" id='remember'
            onChange={(e) => setremember(e.target.checked)}
             />
            <span className="slider"></span>
          </label>
          <p className='mt-[4px]'>Remember Me</p>
        </div>

        <div className="form-group">
          <button className='submit' type="submit">SIGN IN</button>
        </div>

        {/* <p> Don't have an account?<b>Sign Up</b> </p> */}
      </form>
    </div>
  );
};

export default Signin;
