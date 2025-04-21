import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import SeatSelector from './components/SeatSelector';
import ShowtimeSchedule from './components/ShowtimeSchedule';
import CinemaList from './components/CinemaList ';

function App() {
  return (
    <Router>
      <div>
        <Header />
        {/* <Navbar /> */}
        {/* <Banner /> */}
        <Routes>
        <Route path="/" element={<Banner />} />
          <Route path="/movielist" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/seatselector" element={<SeatSelector />} />
          <Route path="/showtimeschedule" element={<ShowtimeSchedule />} />
          <Route path="/cinemalist" element={<CinemaList />} />

        </Routes>
     
        <Footer />
      </div>
    </Router>
  );
}

export default App;
