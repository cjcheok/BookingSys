import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { User } from '../models/user';

const Nav = (props: {user:User | null}) => {
    return (
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">IsAwesome Inc.</a>
            <div className="navbar-nav">
                <div className="nav-item text-nowrap">
                <a href='#' className="nav-link px-3">{props.user?.first_name} {props.user?.last_name}</a>
                <Link className="nav-link px-3" to={'/login'} onClick={async () => await axios.post('logout')}>Sign out</Link>
                </div>
            </div>
        </header>
    )
}

const mapStateToProps = ( state: {user:User} ) => ({
    user: state.user
  })
  
  export default connect(
    ( state: {user:User} ) => ({
      user: state.user
    })
  )(Nav);