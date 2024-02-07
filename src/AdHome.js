import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AppBar, Typography, Grid } from '@mui/material';
import MainCard from './components/MainCard';
import OrdersTable from './pages/dashboard/OrdersTable';
import Toolbar from '@mui/material/Toolbar';
import { useState,useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { selectClasses } from '@mui/joy/Select';

export default function AdHome({ onLogin }) {
const drawerWidth = 240;
const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'nametour', label: 'Nametour', minWidth: 170 },
  { id: 'person', label: 'Person', minWidth: 170 },
  { id: 'tourdate', label: 'tourdate', minWidth: 170 },
  { id: 'price', label: 'price', minWidth: 170 },
  { id: 'order_date', label: 'order_date', minWidth: 170 },
];
const [selectedPastTours, setSelectedPastTours] = useState('');
const [selectedFutureTours, setSelectedFutureTours] = useState('');
const [aid, setAid] = useState('');

const handlePastTourChange = (event, newValue) => {
  setSelectedPastTours(newValue);
};
const handleFutureTourChange = (event, newValue) => {
  setSelectedFutureTours(newValue);
};

const [pastrows, setPastRows] = useState([]);
const [futurerows, setFutureRows] = useState([]);


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
      console.log(_id)
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

useEffect(() => {
  // axios.post('http://localhost:3001/pastorder', { admin_id:aid,tour_name:selectedPastTours})
  axios.post('https://tourapi-hazf.onrender.com/pastorder', { admin_id:aid,tour_name:selectedPastTours})
    .then((response) => {
      const data = response.data; // Updated this line based on the actual structure

      // Map the pastOrders to the format expected by createData and set it in the state
      const pastRows = data.pastOrders.map(order => createData(
        order.user_firstname,
        order.tour_name,
        order.quantity,
        dayjs(order.tour_date).format('DD / MM / YYYY'),
        order.total_price,
        dayjs(order.createdAt).format('DD / MM / YYYY')
      ));

      setPastRows(pastRows);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [aid,selectedPastTours]);

useEffect(() => {
  // axios.post('http://localhost:3001/futureorder', { admin_id:aid,tour_name:selectedFutureTours})
  axios.post('https://tourapi-hazf.onrender.com/futureorder', { admin_id:aid,tour_name:selectedFutureTours})
    .then((response) => {
      const data = response.data; // Updated this line based on the actual structure

      // Map the futureOrders to the format expected by createData and set it in the state
      const futureRows = data.futureOrders.map(order => createData(
        order.user_firstname,
        order.tour_name,
        order.quantity,
        dayjs(order.tour_date).format('DD / MM / YYYY'),
        order.total_price,
        dayjs(order.createdAt).format('DD / MM / YYYY')
      ));

      setFutureRows(futureRows);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [aid,selectedFutureTours]);

function createData(name, nametour,person,tourdate,price,order_date) {
  return { name, nametour, person,tourdate, price, order_date };
}

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    
    <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} >
       <Toolbar>
       <Typography variant="h6" noWrap component="div">
          Home
               </Typography>
             </Toolbar>
          </AppBar>
         
    <Paper sx={{ width: '90%', overflow: 'hidden' ,marginLeft:'5%',marginBottom:'50px'}}> <h1>Order</h1>
    <Select 
       placeholder="selectedTours"
       indicator={<KeyboardArrowDown />}
       className='selectt'
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
        onChange={handleFutureTourChange}>
  <Option value="">All Tours</Option>
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
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {futurerows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={futurerows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

    <Paper sx={{ width: '90%', overflow: 'hidden' ,marginLeft:'5%'}}> <h1>Order History</h1>
    <Select 
       placeholder="selectedTours"
       indicator={<KeyboardArrowDown />}
       className='selectt'
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
        onChange={handlePastTourChange}>
  <Option value="">All Tours</Option>
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
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pastrows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={pastrows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
}


