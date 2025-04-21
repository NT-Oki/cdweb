import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const rows = ['A', 'B', 'C', 'D', 'E'];
const seatsPerRow = 8;

// Giả sử các ghế đã đặt
const bookedSeats = ['A1', 'A2', 'C4', 'D6'];

export default function SeatSelector() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSelect = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const renderSeat = (row: string, number: number) => {
    const seatId = `${row}${number}`;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <Button
        key={seatId}
        variant="contained"
        size="small"
        sx={{
          minWidth: 40,
          bgcolor: isBooked
            ? 'grey.500'
            : isSelected
            ? 'success.main'
            : 'primary.main',
          color: 'white',
          ':hover': {
            bgcolor: isBooked
              ? 'grey.500'
              : isSelected
              ? 'success.dark'
              : 'primary.dark',
          },
        }}
        disabled={isBooked}
        onClick={() => handleSelect(seatId)}
      >
        {number}
      </Button>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Chọn ghế
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {rows.map((row) => (
          <Grid container key={row} spacing={1} alignItems="center">
            <Grid item>
              <Typography>{row}</Typography>
            </Grid>
            {Array.from({ length: seatsPerRow }, (_, idx) => (
              <Grid item key={idx}>
                {renderSeat(row, idx + 1)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>

      {/* Ghế đang chọn */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Ghế bạn đã chọn:</Typography>
        <Typography color="success.main">
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế nào'}
        </Typography>
      </Box>
    </Box>
  );
}
