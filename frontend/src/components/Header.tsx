import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, AccountCircle, Language } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png';
import Divider from "@mui/material/Divider";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
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
              {t('app.name')} {/* "Cinema" hoặc "Rạp phim" */}
            </Link>
          </Typography>
         
          <IconButton color="inherit" onClick={handleLanguageMenuOpen}>
            <Language />
          </IconButton>
          <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
          >
            <MenuItem onClick={() => handleChangeLanguage('vi')}>Tiếng Việt (VI)</MenuItem>
            <MenuItem onClick={() => handleChangeLanguage('en')}>English (EN)</MenuItem>
          </Menu>
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
                  <Box key="user-info" sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {user.email}
                    </Typography>
                  </Box>,
                  <Divider key="divider" sx={{ borderStyle: 'dashed' }} />,
                  <Box key="logout" sx={{ p: 1 }}>
                    <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
                      {t('nav.logout')} {/* "Đăng xuất" hoặc "Logout" */}
                    </Button>
                  </Box>
                ]
            ) : (
                <Box sx={{ p: 1 }}>
                  <Button
                      fullWidth
                      color="error"
                      size="medium"
                      variant="text"
                      component={Link}
                      to="/login"
                      onClick={handleMenuClose}
                  >
                    {t('nav.login')} {/* "Đăng nhập" hoặc "Login" */}
                  </Button>
                </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
  );
}