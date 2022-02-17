import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import { NavLink } from 'react-router-dom';
import { navlinkBaseClasses } from '../data/navlinkData';
import LinkComponent from './LinkComponent';
import Row from './Row';
import logo from '../res/images/logo2.png'
import { navbarData } from '../data/navbarData';

const Navbar = () => {
    const { auth, navbarName } = useContext(Context);
    const [greeting, setGreeting] = useState('LOADING...');

    const calcGreeting = () => {
        const date = new Date();
        const time = date.toLocaleString('en-GB', { timeZone: 'UTC' });
        //'Number' constructor removes leading zeros
        const hour = Number(time.slice(12, 14));

        if(hour <= 12){
            setGreeting('Good Morning');
        } else if(hour <= 18){
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }

    useEffect(() => calcGreeting(), [])

    return <Row extraClasses='sticky top-0 left-0 justify-between w-full px-10 min-h-navbar border-b-2 border-adzuna bg-white z-10'>
        <LinkComponent
            to='/'
            extraClasses='no-underline w-32'
        >
            <img src={logo} alt='logo'/>
        </LinkComponent>

        <h1 className='text-adzuna'>{greeting}, {auth.currentUser && auth.currentUser.displayName}</h1>

        <Row extraClasses='justify-between w-1/3'>
            {navbarData.map((curr, index) =>
                <NavLink 
                    key={index} 
                    to={curr.route ? curr.route : `/Profile/${navbarName}`} 
                    className={({ isActive }) => isActive ? `fill-emerald-300 text-adzuna decoration-emerald-300 ${navlinkBaseClasses}` : navlinkBaseClasses}
                >
                    {curr.icon}
                    {curr.text}
                </NavLink>
            )}
        </Row>
    </Row>
};

export default Navbar;