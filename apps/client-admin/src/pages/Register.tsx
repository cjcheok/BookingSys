import axios from 'axios';
import React, { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
    const [ first_name, setFirstName] = useState('');
    const [ last_name, setLastName] = useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [ passwordConfirm, setPasswordConfirm] = useState('');

    const [ state, setState] = useState( {redirect:false} );

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(123123);

        await axios.post('register',
        {
            first_name,
            last_name,
            email,
            password,
            password_confirm: passwordConfirm
        });

        setState({redirect:true});
    }
    if( state.redirect ){
        return <Navigate to={'/login'} />;
    }

    return (


<main className="form-signin w-100 m-auto">
  <form  onSubmit={submit}>

    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

    <div className="form-floating">
      <input  className="form-control" placeholder="First Name" onChange={ e => setFirstName(e.target.value)}/>
      <label>First Name</label>
    </div>

    <div className="form-floating">
      <input  className="form-control" placeholder="Last Name"  onChange={ e => setLastName(e.target.value)}/>
      <label>Last Name</label>
    </div>

    <div className="form-floating">
      <input type="email" className="form-control" placeholder="name@example.com"  onChange={ e => setEmail(e.target.value)}/>
      <label htmlFor='floatingInput'>Email address</label>
    </div>

    <div className="form-floating">
      <input type="password" className="form-control" placeholder="Password" onChange={ e => setPassword(e.target.value)} />
      <label>Password</label>
    </div>

    <div className="form-floating">
      <input type="password" className="form-control" placeholder="Password Confirm" onChange={ e => setPasswordConfirm(e.target.value)} />
      <label>Password</label>
    </div>

    <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
  </form>
</main>  
    );
}

export default Register;