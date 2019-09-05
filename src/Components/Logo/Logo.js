import React from 'react';
import Logo from '../../assets/images/27.1 burger-logo.png.png'
import classes from './Logo.css'

const logo=(props)=>(
    <div  className={classes.Logo}>
        <img src={Logo} alt="MyBurger"></img>
    </div>
)
export default logo;