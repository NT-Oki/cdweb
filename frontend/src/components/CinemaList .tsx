import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

const cinemas = [
  {
    id: '1',
    name: 'CGV Vincom',
    showtimes: ['10:00', '13:30', '17:00', '20:00'],
  },
  {
    id: '2',
    name: 'CGV Aeon Mall',
    showtimes: ['11:00', '14:30', '18:00'],
  },
  {
    id: '3',
    name: 'CGV Landmark 81',
    showtimes: ['12:00', '15:30', '19:00'],
  },
  {
    id: '4',
    name: 'BHD Star Cineplex',
    showtimes: ['09:30', '12:00', '15:30', '18:30'],
  },
];

const CinemaList = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Danh Sách Rạp Chiếu Phim
      </Typography>

      {/* Dùng Box thay cho Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {cinemas.map((cinema) => (
          <Box
            key={cinema.id}
            sx={{
              width: { xs: '100%', sm: '48%', md: '32%' }, // Điều chỉnh kích thước
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {cinema.name}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Các lịch chiếu:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cinema.showtimes.map((time, idx) => (
                    <Button key={idx} variant="outlined" color="primary">
                      {time}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CinemaList;
