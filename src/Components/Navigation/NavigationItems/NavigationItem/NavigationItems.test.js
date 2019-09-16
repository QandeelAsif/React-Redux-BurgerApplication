import React from 'react';

import NavigationItems from '../NavigationItems';
import NavigationItem from './NavigationItem';

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure( {adapter: new Adapter() } );

describe('<NavigationItems />', () => {

    let wrapper=null;

    beforeEach( () =>{
        wrapper =shallow ( <NavigationItems/>);
    });

    it('should render two <NavigationItem/> if not authenticated', () => {
        expect (wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render three <NavigationItem/> if authenticated', () => {
        wrapper.setProps( {isAuthenticated:true} )
        expect (wrapper.find(NavigationItem)).toHaveLength(3) ;
    });

    it('should have <NavigationItem/> logout', () => {
        wrapper.setProps( {isAuthenticated:true} )
        expect (wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    });
})