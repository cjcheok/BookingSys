import axios from 'axios';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import { Booking } from '../models/booking';

const Bookings = () => {

  const [bookings,setBookings] = useState<Booking[]>([]);
  const [state, setState] = useState({startDate:new Date()});

  useEffect( () => {
    (
      async () => {
        //const arr = [];
        const dt = state.startDate.getFullYear() + "-" + ("0"+(state.startDate.getMonth() + 1)).slice(-2) + "-" + ("0"+state.startDate.getDate()).slice(-2);
        //arr.push(`dt=${dt}`);
        const {data} = await axios.get(`bookings`);
        setBookings( data );
      }

    )();
  }, []);

  const handleChange = async (date: Date) => {
    setState({  
      startDate: date  
    });

    const arr = [];
    const dt = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2);
    arr.push(`dt=${dt}`);
    const {data} = await axios.get(`bookings?${arr.join('&')}`);
    setBookings( data );
  }

  const del = async ( id:number) =>{
    if( window.confirm('Are you sure?') ){
        await  axios.delete(`bookings/${id}`);
        setBookings( bookings.filter( p=> p.id != id ))
    }
}

    return (
<Layout>

  <h1>Bookings</h1>
  <hr className="hidethis" />
  <div className="form-floating hidethis">
  <ReactDatePicker
className="form-control"
              selected={ state.startDate }  
              onChange={ handleChange }  
              name="startDate"  
              dateFormat="yyyy-MM-dd"
          />  
    <label >View bookings by date</label>
</div>
<hr/>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
          {bookings.map( booking => {

            let dt = new Date(booking.book_dt + ':00:00');
              return (
            <tr>
              <td>{booking.id}</td>
              <td>{booking.first_name} {booking.last_name}</td>
              <td>{booking.email}</td>
              <td>{booking.book_dt.substr(0,10)} </td>
              <td>{("0"+dt.getHours()).substr(-2)}:{("0"+dt.getMinutes()).substr(-2)}</td>
              <td>
                
                  <Link to={`/bookings/${booking.id}`}>Edit</Link>&nbsp;
                  <a href="#" onClick={() => del(booking.id)}>Delete</a>
              </td>
            </tr>
              );
            })}
          </tbody>
        </table>

      </div>
      </Layout>

    );
}

export default Bookings;