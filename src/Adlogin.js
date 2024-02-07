import { useState } from "react";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Image } from "react-bootstrap";
import button from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import bg from './pic/bg.jpg'
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
export const Adlogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const response = await axios.post('http://localhost:3001/adminlogin', { email, password });
      const response = await axios.post('https://tourapi-hazf.onrender.com/adminlogin', { email, password });
      console.log(email, password)
      const token = response.data.token;

      localStorage.setItem('token', token);

      onLogin(true);

      navigate('/dashboard/AdHome');

      // Redirect to the homepage or another route
      // window.location.href = '/dashboard/AdHome';
    } catch (error) {
      console.error('Error during login:', error.response.error);
      setError('Invalid username or password');
      // Handle login error, e.g., display an error message to the user
    }finally {
      setLoading(false); 
    }
  };
  return (
   
    // <div className="wrapper">
    <div className="bg" style={{backgroundImage:`url(${bg})`,backgroundPosition:'bottom',objectFit:'cover'}}>
      {/* <Container style={{ marginBottom: "20px" }}> */}
      <Container>
        <Row>
          
          <Col>
            <div className="bgblur"  >
       
              <div class="row flex-nowrap justify-content-between align-items-center">
                <div
                  class="col-12 text-center"
                  style={{
                   
                    marginBottom: "20px",
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <p style={{color:'white',fontWeight:'bold',fontSize:'45px'}}>ADMIN LOGIN</p>
                </div>
              </div>

              <Row className="marginlog">
  
       
    
                <Form >
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="email"
                  >
                    <Col sm="10">
                      <Form.Label  style={{float:'left',color:'black'}}>
                      <p style={{color:'white',fontWeight:'bold',fontSize:'20px'}}>Email</p>
                      </Form.Label>
                      <Form.Control type="email" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="password"
                  >
                    <Col sm="10">
                      <Form.Label style={{float:'left',color:'black'}}>
                        <p  style={{color:'white',fontWeight:'bold',fontSize:'20px'}}>password</p>
                      </Form.Label>
                      <Form.Control type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)}
                      />
                    </Col>
                  </Form.Group>

                  {loading ? (
                      // <div style={{marginLeft:'-20px'}}>Logging In...</div>
                      <Box sx={{ width: '82%' }}>
                      <LinearProgress />
                    </Box>
                    ) : (
                      <>{error && (
                          <div style={{ color: 'red', display:'inline-block',float:'left' }}>
                            {error}
                          </div>
                        )}
              <Button
                   onClick={handleLogin}
                   className='button buttonlog'  size="sm" >Sign In</Button>
            </>
          )}

                 
                </Form>
              </Row>
                      
  <div className="d-grid gap-2 buttonlog" >

  </div></div>
          </Col>


        </Row>
      </Container>

      {/* </Container> */}
    </div>

  // </div>
  );
}
export default Adlogin;