import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CGV
        </Typography>
        <Button color="inherit">Lịch chiếu</Button>
        <Button color="inherit">Phim</Button>
        <Button color="inherit">Rạp</Button>
        <Button color="inherit">Thành viên</Button>
        <Button color="inherit">Ưu đãi</Button>
      </Toolbar>
    </AppBar>
  );
}
