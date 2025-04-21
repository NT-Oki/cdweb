import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton } from '@mui/material';
import { Search, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // 👉 Thêm dòng này

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Tìm kiếm:', searchQuery);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#111', width: '100%', top: 0 }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/CGV_Logo.svg" alt="CGV Logo" style={{ height: '40px', marginRight: '10px' }} />
          CGV
        </Typography>

        {/* Menu */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button href='/movielist' color="inherit">Phim</Button>
          <Button href='/cinemalist' color="inherit">Rạp</Button>
          <Button href='/showtimeschedule' color="inherit">Lịch chiếu</Button>
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
        <IconButton color="inherit" component={Link} to="/login"> {/* 👉 Link tới trang đăng nhập */}
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
