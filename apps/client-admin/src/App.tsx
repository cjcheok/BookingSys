import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Bookings from './pages/Bookings';
import Register from './pages/Register';
import Login from './pages/Login';
import BookingForm from './pages/BookingForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Bookings/>} />
          <Route path={'/login'} element={<Login/>} />
          <Route path={'/register'} element={<Register/>} />
          <Route path={'/bookings/:id'} element={<BookingForm/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
