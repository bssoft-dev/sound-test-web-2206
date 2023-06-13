import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useCtx } from '../../../context/Context';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const navigate = useNavigate('/login');
  const context = useCtx();
  const { setToken } = context;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('is_hyperuser')
    setToken(false);
    navigate('/login')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="userIcon"
        aria-controls={open ? 'UserMenu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleLogout}
        color="inherit"
        sx={{height: '100%', paddingInline: '16px'}}
      >
        <Avatar 
            sx={{ width: 24, height: 24, marginRight: 1}}>
            <PersonIcon />
        </Avatar>
        로그아웃
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
