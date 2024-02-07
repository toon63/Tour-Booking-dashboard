import React, { Component } from 'react'
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import {  Typography, Grid ,Box} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from "react";
import axios from 'axios';

import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';

import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import Download from '@mui/icons-material/Download';
import InsertLink from '@mui/icons-material/InsertLink';
import Crop from '@mui/icons-material/Crop';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';

import Card from '@mui/joy/Card';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
export default function Review({ onLogin }) {
  
   const [tour, settour] = useState('');  
   const [reviewDetail, setReviewDetail] = useState({
     reviewtitle: '',
     user_name: '',
     tour_name: '',
     rating: '',
     comment: ''
   });
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [image, setImage] = React.useState(null);

  console.log(reviewDetail)
  console.log(selectedImage)
  const fileInputRef = React.useRef(null);
  
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const imageUrl = URL.createObjectURL(selectedFile);
    setSelectedImage(imageUrl);

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = {
        data: new Uint8Array(reader.result),
        contentType: selectedFile.type,
      };

      setImage(imageData);
  };
  if (selectedFile) {
    reader.readAsArrayBuffer(selectedFile);
  }
}

  const handleTourChange = (event) => {
    const { name, value } = event.target;
    settour(value);
    setReviewDetail((prevReviewDetail) => ({
      ...prevReviewDetail,
      [name]: value,
    }));
  };
      const handleChange = (event) => {
        const { name, value } = event.target;
        setReviewDetail((prevReviewDetail) => ({
          ...prevReviewDetail,
          [name]: value,
        }));
      };
      
    
    
        const handleReviewSubmit = async () => {
          if (
            reviewDetail.reviewtitle.trim() === '' ||
            reviewDetail.user_name.trim() === '' ||
            reviewDetail.tour_name.trim() === '' ||
            reviewDetail.comment.trim() === '' ||
            !selectedImage
          ) {
            // Display an error message or handle the validation as needed
            alert('Please fill in all required fields.');
            return;
          }
    
          const formData = new FormData();
          formData.append('image', new Blob([image.data], { type: image.contentType }));
          formData.append('reviewDetail', JSON.stringify(reviewDetail));

          console.log(formData)

          try {
            // Assuming you have a server running at http://localhost:3001
            // const response = await axios.post('http://localhost:3001/postreview', formData);
            const response = await axios.post('https://tourapi-hazf.onrender.com/postreview', formData);
            // const response = await axios.post('https://tourapi-hazf.onrender.com/postreview', reviewDetail);
            console.log(response.data); // Handle the server response as needed
            if(response){
              alert('Add review complete');
              return;
            }
          } catch (error) {
            console.error('Error submitting review:', error);
          }
        };
    const drawerWidth = 240;
    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
          color: theme.palette.action.disabled,
        },
      }));
      
      const customIcons = {
        1: {
          icon: <SentimentVeryDissatisfiedIcon color="error" />,
          label: 'Very Dissatisfied',
        },
        2: {
          icon: <SentimentDissatisfiedIcon color="error" />,
          label: 'Dissatisfied',
        },
        3: {
          icon: <SentimentSatisfiedIcon color="warning" />,
          label: 'Neutral',
        },
        4: {
          icon: <SentimentSatisfiedAltIcon color="success" />,
          label: 'Satisfied',
        },
        5: {
          icon: <SentimentVerySatisfiedIcon color="success" />,
          label: 'Very Satisfied',
        },
      };
      
      function IconContainer(props) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
      }
      
      IconContainer.propTypes = {
        value: PropTypes.number.isRequired,
      };
      
    return (
        <>
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} >
           <Toolbar>
           <Typography variant="h6" noWrap component="div">
              Editor Review
                   </Typography>
                 </Toolbar>
              </AppBar>
              <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft:'8%',
        '& > :not(style)': {
          m: 1,
          width: '90%',
          height: 128,
        },
      }}
    >
    
      <Paper elevation={3} style={{padding:'10px',height:'100%'}} >
      <TextField
          id="outlined-multiline-flexible"
          label="Review title"
          multiline
          maxRows={4}
          style={{float:'left',width:'49%',marginBottom:'10px'}}
          name="reviewtitle"       
          onChange={handleChange}
          required/>
        <TextField
          id="outlined-multiline-flexible"
          label="User Name"
          multiline
          maxRows={4}
          style={{float:'right',width:'49%',marginBottom:'10px'}}
          name="user_name" 
           onChange={handleChange}
          required/>

   
      <FormControl fullWidth style={{width:'49%',float:'left'}}>
        <InputLabel id="demo-simple-select-label">Tour</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tour}
          label="Tour"
        
          name="tour_name"
          onChange={handleTourChange}
          required
        
        >
                                <MenuItem value={'Bangkok Grand Tour'}>Bangkok grand tour</MenuItem>
                    <MenuItem value={'Bangkok unseen Tour'}>Bangkok unseen tour</MenuItem>
                    <MenuItem value={'Bkk Instagram TikTok Tour (For whose who love photos)'}>BKK Instagram/TikTok</MenuItem>
                    <MenuItem value={'The ultimate of the floating market tour'}>The ultimate of the floating market</MenuItem>
                    <MenuItem value={'Half day floating market tour'}>Half day floating market</MenuItem>
                    <MenuItem value={'The sacred tattoo tour (Sakyant)'}>The sacred tattoo tour</MenuItem>
                    <MenuItem value={'Ayutthaya highlight tour'}>Ayutthaya highlight tour</MenuItem>
                    <MenuItem value={'The Scenic farm tour'}>The scenic farm tour</MenuItem>
                    <MenuItem value={'Cooking class'}>Cooking class</MenuItem>
                 
        </Select>
      </FormControl>
      <div style={{width:'13%',float:'left',marginBottom:'10px'}}>
              <Stack spacing={1} style={{ margin: '15px' }}>
                <Rating name="rating" precision={0.5} onChange={(event, value) => handleChange({ target: { name: 'rating', value } })} />
              </Stack>
              </div>
    
    
  
      <Sheet  variant="outlined" color="neutral" sx={{ p: 5 }} style={{width:'49%',float:'left',marginRight:'10px',marginTop:'20px',}}>
   
      <Button
        variant="outlined"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => document.getElementById('fileInput').click()}
      >
        Upload a file
      </Button>
      <input
        id="fileInput"
        type="file"
        ref={(input) => (fileInputRef.current = input)}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* <VisuallyHiddenInput
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        aria-label="Upload file"
      /> */}
      {selectedImage && (
        <div>
          <h2>Preview Image:</h2>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </div>
      )}
     
      </Sheet>
<TextField
                name="comment"
                label="Review Detail"
                multiline
                rows={4}
                style={{float:'left',marginTop:'10px',width:'49%'}}
                onChange={handleChange}
                required
              />
        
        {/* <Paper elevation={3} style={{width:'49%',float:'right',marginTop:"10px",height:'100%',padding:'4%'}}>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
    </Paper> */}
     {/* ___________________________________________ */}
    
    {/* ___________________________________________ */}
    {/* <Box
        sx={{
          border: '1px solid',
          borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
          alignSelf: 'center',
          maxWidth: '100%',
          minWidth: { xs: 220, sm: 360 },
          mx: 'auto',
          boxShadow: 'sm',
          borderRadius: 'md',
          overflow: 'auto',
        }}
      >
        <Sheet
          sx={{
            borderWidth: '0 0 1px 0',
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
          }}
        >
          <Typography level="h2" fontSize="md">
            Photo upload
          </Typography>
          <IconButton size="sm" variant="plain" color="neutral" sx={{ ml: 'auto' }}>
            <Close />
          </IconButton>
        </Sheet>


        <Sheet sx={{ p: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              overflow: 'auto',
              borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
              bgcolor: 'background.level1',
            }}
          >
            <AspectRatio>
              <img alt="" src="/static/images/cards/yosemite.jpeg" />
            </AspectRatio>
            <Box
              sx={{
                display: 'flex',
                p: 1.5,
                gap: 1.5,
                '& > button': { bgcolor: 'background.surface' },
              }}
            >
              <IconButton
                color="danger"
                variant="plain"
                size="sm"
                sx={{ mr: 'auto' }}
              >
                <Delete />
              </IconButton>
              <IconButton color="neutral" variant="outlined" size="sm">
                <Download />
              </IconButton>
              <IconButton color="neutral" variant="outlined" size="sm">
                <InsertLink />
              </IconButton>
              <IconButton color="neutral" variant="outlined" size="sm">
                <Crop />
              </IconButton>
            </Box>
          </Sheet>
        </Sheet>
        <Sheet
          sx={{
            display: 'flex',
            p: 2,
            borderTop: '1px solid',
            borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
            gap: 1,
          }}
        >
          <Button size="md" variant="plain" sx={{ ml: 'auto' }}>
            Replace photo
          </Button>
          <Button size="md">Upload</Button>
        </Sheet>
      </Box> */}
  
<Button variant="outlined" color="error" style={{marginTop:'10px',marginRight:"10px",float:'left'}}>
 Cancle
</Button>
    <Button variant="contained" color="success" style={{marginTop:'10px',float:'right'}} onClick={handleReviewSubmit}>
 Done
</Button>
        </Paper>
    </Box>
     
      </>
    )
  }