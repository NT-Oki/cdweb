import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import logo from '../assets/images/logo.png';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Tìm kiếm:', searchQuery);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
      <AppBar position="fixed" sx={{ backgroundColor: '#111', width: '100%', top: 0 }}>
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link
                to="/"
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <img src={logo} alt="CGV Logo" style={{ height: '50px', marginRight: '10px' }} />
              Cinema
            </Link>
          </Typography>

          {/* Menu */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/movie" color="inherit">
              Phim
            </Button>
            <Button component={Link} to="/cinemalist" color="inherit">
              Rạp
            </Button>
            <Button component={Link} to="/showtimeschedule" color="inherit">
              Lịch chiếu
            </Button>
            <Button color="inherit">Ưu đãi</Button>
          </Box>

          {/* Tìm kiếm */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            <TextField
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm phim"
                sx={{ backgroundColor: 'white', borderRadius: '5px', marginRight: 1 }}
            />
            <IconButton onClick={handleSearchSubmit} color="inherit">
              <Search />
            </IconButton>
          </Box>

          {/* Tài khoản */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
          >
            {user ? (
                [
                  <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>
                    Hồ sơ
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    Đăng xuất
                  </MenuItem>,
                ]
            ) : (
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  Đăng nhập
                </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
  );
}