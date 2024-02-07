import React, { useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { format } from 'date-fns';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { Calendar } from "react-calendar";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import 'react-calendar/dist/Calendar.css';
import { Grid } from '@mui/material';
import axios from "axios";
import { Switch, FormControlLabel } from '@mui/material';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const drawerWidth = 240;

function Booking({ onLogin }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTours, setSelectedTours] = useState('');
  const [aid, setAid] = useState('');

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const handleTourChange = (event) => {
  //   setSelectedTours(event.target.value);
  // };

  const handleTourChange = (event, newValue) => {
    setSelectedTours(newValue)
  };

  const handleToggleChange = () => {
    setIsAddMode(!isAddMode);

    if (!isAddMode) {
      // If switching to Close, perform POST operation
      postDateToMongoDB(selectedDate);
    } else {
      // If switching to Open, perform DELETE operation
      deleteDateFromMongoDB(selectedDate);
    }
  };
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to the homepage or another route
    window.location.href = '/';
  }
  useEffect(() => {
    
    if (token) {
      try {
        // Split the token into its parts
        const [, payloadBase64,] = token.split('.');
        const decodedPayload = atob(payloadBase64);
  
        // Parse the decoded payload as JSON
        const { _id,email,exp,expiresIn } = JSON.parse(decodedPayload);
        setAid(_id)
        console.log(_id,email,exp,expiresIn )
        document.cookie = `token=${token}; path=/; max-age=${expiresIn}; HttpOnly`;
        if (token) {
          try {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
        
            if (exp * 1000 < Date.now()) {
              // Token expired, remove from localStorage
              localStorage.removeItem('token');
              onLogin(false);
            }
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
  }
  }, []);

  const postDateToMongoDB = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log(formattedDate)
      // await axios.post('http://localhost:3001/disabledate', { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours });
      await axios.post('https://tourapi-hazf.onrender.com/disabledate', { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours });
      console.log('Date posted to MongoDB:', date);
    } catch (error) {
      console.error('Error posting date to MongoDB:', error);
    }
  };

  const deleteDateFromMongoDB = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log(formattedDate)
      // await axios.delete('http://localhost:3001/deletedate', { data: { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours }} );
      await axios.delete('https://tourapi-hazf.onrender.com/deletedate', { data: { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours }});
      console.log('Date deleted from MongoDB:', date);
    } catch (error) {
      console.error('Error deleting date from MongoDB:', error);
    }
  };
  useEffect(() => {
  const fetchMeetings = async () => {
    try {
      // const response = await axios.post('http://localhost:3001/getclosedates', { tour_name:selectedTours});
      const response = await axios.post('https://tourapi-hazf.onrender.com/getclosedates', { tour_name:selectedTours});
      const dates = response.data.map(meeting => meeting.closed_date);
      setHighlightedDates(dates);
      console.log('closed date',dates)
      setIsAddMode(dates.includes(format(selectedDate, 'yyyy-MM-dd')));
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchOrderByDate = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.post('https://tourapi-hazf.onrender.com/orderdate', { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours });
      // const response = await axios.post('http://localhost:3001/orderdate', { admin_id:aid,tour_date:formattedDate,tour_name:selectedTours });
      const responseData = response.data;

    if (responseData && Array.isArray(responseData.orders)) {
      // Add a number to each order for display
      const ordersWithNumbers = responseData.orders.map((order, index) => ({
        ...order,
        orderNumber: index + 1,
      }));

      setOrders(ordersWithNumbers);
      console.log(ordersWithNumbers);
    } else {
      setOrders([])
      console.error('Invalid data received:', responseData);
    }
    } catch (error) {
      setOrders([])
      console.error('Error fetching meetings:', error);
    }
  };

    fetchOrderByDate();
    fetchMeetings();
  }, [selectedDate,selectedTours,aid]);

  const dayClassNames = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const isHighlighted = highlightedDates.includes(formattedDate);
    return isHighlighted ? 'highlighted' : null;
    
  };

  return (
    <div className="containcalen ">

      <Row style={{marginBottom:"50px"}} >
        <Col><AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Calendar
          </Typography>
        </Toolbar>
      </AppBar>
      <div >

        <Select 
        style={{marginBottom:'40px',marginTop:'40px'}}
        placeholder="Select Tour"
        className="fontcalen"
        indicator={<KeyboardArrowDown />}
        // className="selectbook"
        sx={{
         [`& .${selectClasses.indicator}`]: {
           transition: '0.2s',
           [`&.${selectClasses.expanded}`]: {
             transform: 'rotate(-180deg)',
           },
         },
       }}
      id="tourSelect"
      //  value={selectedTours}
        onChange={handleTourChange}>
  <Option value="Bangkok Grand Tour">Bangkok Grand Tour</Option>
  <Option value="Bangkok unseen Tour">Bangkok unseen Tour</Option>
  <Option value="Bkk Instagram TikTok Tour (For whose who love photos)">Bkk Instagram TikTok Tour (For whose who love photos)</Option>
  <Option value="The ultimate of the floating market tour">The ultimate of the floating market tour</Option>
  <Option value="Half day floating market tour">Half day floating market tour</Option>
  <Option value="The sacred tattoo tour (Sakyant)">The sacred tattoo tour (Sakyant)</Option>
  <Option value="Ayutthaya highlight tour">Ayutthaya highlight tour</Option>
  <Option value="The Scenic farm tour">The Scenic farm tour</Option>
  <Option value="Cooking class">Cooking class</Option>
</Select>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        dayClassName={dayClassNames}
        
      />
      </div>
      </Col>
        <Col >
        <Table  className="custom-table opencalen" aria-label="simple table" >
    
    <TableHead >
            <TableRow >
              <TableCell align="center"  style={{ marginTop: '20px' ,width:'50%'}}>Date</TableCell>
              {/* <TableCell align="center">Tour</TableCell> */}
              <TableCell align="center">Status</TableCell>
        
            </TableRow>
          </TableHead>



    <tbody >
      <tr>
        <td>{selectedDate&&selectedTours&& (
      <div style={{ marginTop: '20px' }} >
        <Typography variant="body2">
          Selected Date: {format(selectedDate, 'dd-MM-yyyy')}
        </Typography>
        <Typography variant="body2">
          Selected Tour: {selectedTours}
        </Typography>
      </div>
    )}</td>
   
     
{/* <td >
      
      </td> */}
        <td> {selectedDate&&selectedTours&& (<div style={{ marginTop: '20px'}}>
    <FormControlLabel
        control={
          <Switch
            checked={isAddMode}
            
            onChange={handleToggleChange}
            inputProps={{ 'aria-label': 'controlled' }}
            style={{ color: isAddMode ? 'red' : undefined }}
          />
        }
        label={isAddMode ? 'Close' : 'Open'}
        style={{ color: isAddMode ? 'red' : undefined }}
      />
    </div>)}</td>
    
       
      </tr>
      
    </tbody> 
  </Table>
  </Col>
      </Row>
     


    
     

      

   
       

  <Table striped bordered hover >
        <thead className="styletablecalen" style={{backgroundColor:'rgb(163, 195, 236)'}}>
          <tr>
            <th>#</th>
            <th>Name(person)</th>
            <th>Phone</th>
            <th>Nationality</th>
            <th>Passport_no</th>
            <th>Passport_exp</th>
            <th>Food allergy</th>
            <th>Special req</th>
            {/* Add more columns based on your order structure */}
          </tr>
        </thead>
        <tbody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order._id}  className="styletablecalen" style={{ borderBottom: '1px solid rgb(163, 195, 236)',marginBottom:'30px',height:'70px'}} >
        <td>{order.orderNumber}</td>
        <td>{order.user.fname} {order.user.lname} ({order.quantity} p)</td>
        <td>{order.user.phone}</td>
        <td>{order.user.nationality}</td>
        <td>{order.user.passport_no}</td>
        <td>{format(new Date(order.user.passport_exp), 'dd/MM/yyyy')}</td>
        <td>{order.user.food_allergy}</td>
        <td>{order.user.special_req}</td>
        {/* Add more columns based on your order structure */}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8"  className="styletablecalen"  style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6',backgroundColor:'pink',height:'70px' }}>
        No orders for the selected date.
      </td>
    </tr>
  )}
</tbody>
      </Table>
    </div>
  );
}

export default Booking;