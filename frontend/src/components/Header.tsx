// src/components/Header.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo.png';
import Divider from "@mui/material/Divider";

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link
                to="/"
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <img src={logo} alt="CGV Logo" style={{ height: '50px', marginRight: '10px' }} />
              Cinema
            </Link>
          </Typography>
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
                  <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                      {user.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {user.email}
                    </Typography>
                  </Box>,
                  <Divider sx={{ borderStyle: 'dashed' }} />,
                  <Box sx={{ p: 1 }}>
                    <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  </Box>
                ]
            ) : (
                <Box sx={{ p: 1 }}>
                  <Button fullWidth color="error" size="medium" variant="text" component={Link} to="/login" onClick={handleMenuClose}>
                    Đăng nhập
                  </Button>
                </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
  );
}