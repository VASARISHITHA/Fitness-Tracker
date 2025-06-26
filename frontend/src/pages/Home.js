import React from 'react';
import '../styles/home.css'
import exercise from '../assests/exercise.jpg';
import { AppBar, Toolbar, Box,Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Signup from './Signup';
import app from '../assests/app.png';
const Home = () => {
  return (
    <><AppBar position="static" color="default" elevation={1} style={{background:'#333'}}>
          <Toolbar sx={{justifyContent:'space-between'}}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={app} alt="Logo" style={{ height: 40, width:40, marginRight: 8,borderRadius:'30%'}} />
              <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' ,fontSize:'24px',fontWeight:'bold'}}>
                  Fitness Tracker
              </Typography>
            </Box>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button style={{color:'white',background:'#333',fontWeight:'bold',fontSize:'16px'}}>Login</Button>
              </Link>
          </Toolbar>
      </AppBar>
      <div className="home-container">
              <div className="image-container">
                  <img src={exercise} alt="Exercise" />
              </div>
              <div className="text-container">
                 <Signup/>
              </div>
          </div></>
  );
};

export default Home;
