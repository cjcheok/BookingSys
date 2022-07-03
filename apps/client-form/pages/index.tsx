import { SyntheticEvent, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Head from "../node_modules/next/head";
import "react-datepicker/dist/react-datepicker.css";  
import axios from "../node_modules/axios/index";
import constants from '../constants';
import HTMLReactParser from 'html-react-parser';
import { Booking } from "../models/booking";
import { useRouter } from "next/router";




export default function Home() {

  const router = useRouter();
  

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
  else
    sdt.setDate( dt.getDate() + 2 );
  mdt.setDate( dt.getDate() + 21 );




  const changeDate = (date:Date) => {
    setSelectedDate( date );
    getBookings(date);
    setBookDate( getDT(date) );
  }

  const getDT = (date:Date) => {
    return date.getFullYear() + "-" + ( "0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  }
  
  const [selcted_date, setSelectedDate] = useState( sdt );
  const [book_date, setBookDate] = useState( getDT(sdt) );
  const [book_time, setBookTime] = useState('');
  const [timeslots, setTimeslots] = useState('');

  const [err_first_name, setErrFirstName] = useState('');
  const [err_last_name, setErrLastName] = useState('');
  const [err_email, setErrEmail] = useState('');
  const [err_book_date, setErrBookDate] = useState('');
  const [err_book_time, setErrBookTime] = useState('');

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');


  const [notify, setNotify] = useState({
    show:false,
    error: false,
    message: '',
});

  const getBookings = async ( dt:Date) => {
    const arr = [];
    arr.push( `dt=${getDT(dt)}` );
    const {data} = await axios.get(`${constants.endpoint}bookings?${arr.join('&')}`);

    let slots: Booking[] = data;
    let sslots = '';

    for( let i=9; i<18; i++ )
    {
      let j = ("0" + i).slice(-2);

      let t = slots.filter( b => b.book_dt.indexOf(" " + j) >= 0 );
      let selected ='';
      let fulltext = '';
      if( t.length > 0){
          selected = 'disabled';
          fulltext = ' - Full';
      }
      sslots += `<option value="${j}" ${selected}>${j}:00${fulltext}</option>`;
    }
    setTimeslots(sslots);
  }

  const submit = async(e:SyntheticEvent) => {
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

    try{
      const {data} = await axios.post(`${constants.endpoint}bookings`,{
        first_name,
        last_name,
        email,
        book_dt: book_date + " " + book_time.slice(0,2)
      });

      router.push('/success');

      
    }catch(e){
      setNotify({
          show:true,
          error:true,
          message: 'Unexpected error.'
      });
  }finally{
      setTimeout( () => {
          setNotify({
              show:false,
              error:false,
              message: ''
          });

          
      },3000);
  }

  }

  useEffect( () => {
    (
      async () => {
        getBookings(sdt);
      }
    )()
  }, []);

  let info;

  
  if( notify.show ){
    info = (
        <div className='col-md-12 mb-4'>
            <div className={notify.error ? "alert alert-danger" : "alert alert-info"} role="alert">
                {notify.message}
            </div>
        </div>
    )
}

const getCSSClass = ( v ) => {

  if( v == "" ) {
    return "form-control";
  }else{
    return "form-control is-invalid"
  }

}

  return (
    <>
      <Head>
        <title>Booking Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous" />

      </Head>
      <div className="container">
  <main>
    <div className="py-5 text-center">
      <h2>Booking form</h2>
      <p className="lead">Operation hours from 9 AM to 6 PM - Monday to Friday<br/>
      Booking must be made 2 business days in advance and not more than 3 weeks in advance.
      </p>
    </div>
    
    {info}

    <div className="row g-5">
      <div className="col-md-12 col-lg-12">
        <h4 className="mb-3">Billing address</h4>
        <form className="needs-validation" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-sm-6">
              <label htmlFor="firstName" className="form-label">First name</label>
              <input type="text" className={getCSSClass(err_first_name)} id="firstName" placeholder="" onChangeCapture={e => setFirstName(e.target.value)}/>
              <div className="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div className="col-sm-6">
              <label htmlFor="lastName" className="form-label">Last name</label>
              <input type="text" className={getCSSClass(err_last_name)} id="lastName" placeholder="" onChangeCapture={e => setLastName(e.target.value)}/>
              <div className="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className={getCSSClass(err_email)} id="email" placeholder="you@example.com" onChangeCapture={e => setEmail(e.target.value)}/>
              <div className="invalid-feedback">
              Valid email is required.
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">Date</label>
              <ReactDatePicker
              className={getCSSClass(err_book_date)}
              dateFormat="yyyy-MM-dd"
      selected={ selcted_date }
      minDate={sdt}
      maxDate={mdt}
      onChange={changeDate}
      isClearable
      placeholderText="I have been cleared!"
    />


              <div className="invalid-feedback">
                Please select a date between Monday and Friday.
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">Time</label>
              
<select className={getCSSClass(err_book_time)} onChangeCapture={e => setBookTime(e.target.value)}>
<option selected>Select Time</option>
{HTMLReactParser(timeslots)}
</select>
              <div className="invalid-feedback">
                Please select a time slot between 9 AM to 5 PM.
              </div>
            </div>
            

          </div>

          <hr className="my-4"/>



          <button className="w-100 btn btn-primary btn-lg" type="submit">Book Now</button>
        </form>
      </div>
    </div>
  </main>
      </div>
    </>
  )
}
