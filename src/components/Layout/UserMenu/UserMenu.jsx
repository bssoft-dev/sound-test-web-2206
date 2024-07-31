import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { Avatar, Typography } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import { useStore } from '../../../stores/useStore';
// import { shallow } from 'zustand/shallow';

export default function UserMenu() {
  const navigate = useNavigate('/login');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // setToken(null);
    useStore.persist.clearStorage();
    navigate('/login')
  }

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      <Button
        id="userIcon"
        aria-controls={open ? 'UserMenu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleLogout}
        color="secondary"
        sx={{height: '100%', paddingInline: '16px', minWidth: {xs: 'fit-content'}}}
      >
        <Avatar 
            sx={{ width: 24, height: 24, marginRight: 1, display: {xs: 'none', sm: 'flex'}}}>
            <PersonIcon />
        </Avatar>
        <Typography variant='body2' sx={{color: grey[700]}} >로그아웃</Typography>
      </Button>
      {/* <Menu
        id="UserMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'userIcon',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu> */}
    </>
  );
}
