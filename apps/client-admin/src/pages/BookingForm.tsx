import axios from 'axios';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Navigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import "react-datepicker/dist/react-datepicker.css";  
import HTMLReactParser from 'html-react-parser';
import { Booking } from '../models/booking';

const BookingForm = () => {

    const dt = new Date();
    const sdt = new Date();
    const mdt = new Date();
  
    if( sdt.getDay() == 5 )
      sdt.setDate( dt.getDate() + 5 );
    else if( sdt.getDay() == 6 )
      sdt.setDate( dt.getDate() + 4 );
    else if( sdt.getDay() == 0 )
      sdt.setDate( dt.getDate() + 3 );
      else if( sdt.getDay() == 4 )
      sdt.setDate( dt.getDate() + 5 );
    else{
        sdt.setDate( dt.getDate() + 2 );
    }
      
    mdt.setDate( dt.getDate() + 21 );

    const [err_first_name, setErrFirstName] = useState('');
    const [err_last_name, setErrLastName] = useState('');
    const [err_email, setErrEmail] = useState('');
    const [err_book_date, setErrBookDate] = useState('');
    const [err_book_time, setErrBookTime] = useState('');

    const [first_name,setFirstName] = useState('');
    const [last_name,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [book_date,setBookDate] = useState('');
    const [book_time,setBookTime] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();

    const [timeslots,setTimeSlots] = useState('');
    const [state, setState] = useState({startDate: sdt});

    useEffect( () => {
        if( id ){
            (
                async () => {
                
                    const {data} = await axios.get(`bookings/${id}`);

                    setFirstName( data.first_name );
                    setLastName( data.last_name );
                    setEmail( data.email);
                    setBookDate( data.book_dt.substr(0,10) );
                    setBookTime( data.book_dt.substr(11) );

                    const dt = new Date(data.book_dt + ':00:00');
                    setState({startDate:dt});

                    updateTS( data.book_dt.substr(0,10), book_time );
                }
            )()
        }
    }, []);

    const handleChange = async (date: Date) => {
        setState({startDate: date});
        let dt = getDT(date);
        setBookDate(dt);
        await updateTS(dt);
    }

    const getDT = (date:Date) =>{
        return date.getFullYear() + "-" + ("0"+ (date.getMonth() + 1)).slice(-2) + "-" + ("0"+ date.getDate()).slice(-2);
    }

    const updateTS = async (dt: string, ts:string = '') => {
        const {data} = await axios.get( `bookings?dt=${dt}` );
        const slots :Booking[] = data;
        let str = '';
        for( let i=9; i<18; i++ )
        {
            let j = ("0"+i).slice(-2);
            let h = i > 12 ? (i - 12) + " PM" : i + "AM";
            let selected = '';
            let fulltext = '';

            let t = slots.filter( b => b.book_dt.indexOf(" " + j) >= 0 );

            if( t.length > 0){
                if( id === t[0].id.toString() ){
                    fulltext = ' - Chosen';
                    selected = "selected";
                }
                else{
                    selected = 'disabled';
                    fulltext = ' - Full';
                }
            }

            str += `<option ${j} ${selected}>${j}:00 ${fulltext}</option>`;
        }
        setTimeSlots(str);
    }

    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        let allgood = true;
        if( first_name == "" ) {setErrFirstName("is-invalid"); allgood = false;}
        else setErrFirstName('');
    
        if( last_name == "" ) {setErrLastName("is-invalid");allgood = false;}
        else setErrLastName('');
    
        if( email == "" ) {setErrEmail("is-invalid");allgood = false;}
        else setErrEmail('');
    
        if( book_date == "" ) {setErrBookDate("is-invalid");allgood = false;}
        else setErrBookDate('');
    
        if( book_time == "" ) {setErrBookTime("is-invalid");allgood = false;}
        else setErrBookTime('');
    
        if( !allgood ) return;


        const data = {
            first_name,
            last_name,
            email,
            book_dt:book_date + " " + book_time.slice(0,2)
        };

        if( id ){
            await axios.put( `bookings/${id}`,data );
        }
        else{
            await axios.post( 'bookings',data );
        }
        setRedirect(true);
    }

    const getCSSClass = ( v:string ) => {
        if( v == "" ) return "form-control";
        else return "form-control is-invalid"
    }

    if( redirect ){
        return <Navigate to={'/'} />
    }

    return (
        <Layout>
            <div className="form-signin w-100 m-auto">
                <form onSubmit={submit}>
                    <h1 className="h3 mb-3 fw-normal">Edit Booking</h1>
                    <div className="form-floating">

                        <ReactDatePicker
                        className={getCSSClass(err_book_date)}
                                    selected={ state.startDate }  
                                    onChange={ handleChange }  
                                    name="startDate"  
                                    dateFormat="yyyy-MM-dd"
                                    minDate={sdt}
                                    maxDate={mdt}
                                />  
                        <label >Date</label>
                    </div>
                    <div className="form-floating">
                        <select className={getCSSClass(err_book_time)} placeholder="Time" onChangeCapture={(e: any) => setBookTime(e.target.value)}>
                            <option>Select</option>
                            {HTMLReactParser(timeslots)}
                        </select>
                        <label >Time</label>
                    </div>
                    <div className="form-floating">
                        <input className={getCSSClass(err_first_name)} placeholder="First Name" value={first_name} 
                        onChangeCapture={(e: any) => setFirstName(e.target.value)} />
                        <label >First Name</label>
                    </div>

                    <div className="form-floating">
                        <input className={getCSSClass(err_last_name)} placeholder="Last Name" value={last_name}
                        onChangeCapture={(e: any) => setLastName(e.target.value)} />
                        <label >Last Name</label>
                    </div>

                    <div className="form-floating">
                        <input className={getCSSClass(err_email)} placeholder="Email" type="email" value={email}
                        onChangeCapture={(e: any) => setEmail(e.target.value)} />
                        <label >Email</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Update</button>
                </form>
            </div>
        </Layout>
    );
};

export default BookingForm;