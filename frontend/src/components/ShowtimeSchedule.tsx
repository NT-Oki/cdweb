import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import dayjs from 'dayjs';

// Định nghĩa kiểu cho dữ liệu lịch chiếu
type Showtime = {
  cinema: string;
  time: string[];
};

type ShowtimesData = {
  [key: string]: Showtime[]; // Tạo index signature cho các ngày
};

const showtimesData: ShowtimesData = {
  '2025-04-21': [
    { cinema: 'CGV Vincom', time: ['10:00', '13:30', '17:00', '20:00'] },
    { cinema: 'CGV Aeon Mall', time: ['11:00', '14:30', '18:00'] },
  ],
  '2025-04-22': [
    { cinema: 'CGV Landmark 81', time: ['12:00', '15:30', '19:00'] },
  ],
};

const generateNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(dayjs().add(i, 'day'));
  }
  return days;
};

export default function ShowtimeSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const handleDateChange = (_event: React.MouseEvent<HTMLElement>, newDate: string) => {
    if (newDate !== null) {
      setSelectedDate(newDate);
    }
  };

  // Chắc chắn rằng TypeScript nhận diện được kiểu dữ liệu của selectedDate
  const availableShowtimes = showtimesData[selectedDate] || [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Lịch Chiếu
      </Typography>

      {/* Chọn ngày */}
      <ToggleButtonGroup
        value={selectedDate}
        exclusive
        onChange={handleDateChange}
        sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
      >
        {generateNext7Days().map((date) => {
          const formatted = date.format('YYYY-MM-DD');
          return (
            <ToggleButton key={formatted} value={formatted}>
              {date.format('DD/MM')}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>

      {/* Hiển thị lịch */}
      {availableShowtimes.length === 0 ? (
        <Typography>Không có lịch chiếu cho ngày này.</Typography>
      ) : (
        availableShowtimes.map((item, idx) => (
          <Card key={idx} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.cinema}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {item.time.map((t, i) => (
                  <Button key={i} variant="outlined" color="primary">
                    {t}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
