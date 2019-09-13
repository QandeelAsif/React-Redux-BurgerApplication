import React, { Component } from 'react';
import { Route, Switch, withRouter,Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './Containers/BurgerBuilder/BurgerBuilder';
import Logout from './Containers/Auth/Logout/Logout'

import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent( () => {
  return import('./Containers/Checkout/Checkout')
});

const asyncOrder = asyncComponent( () => {
  return import('./Containers/Orders/Orders')
});

const asyncAuth = asyncComponent( () => {
  return import('./Containers/Auth/Auth')
});

class App extends Component {

  componentDidMount(){
    this.props.onTryAutoSignup();
  }

  render () {

    let routes =(
      <Switch>
            <Route path="/" exact component={BurgerBuilder} />
            <Route path="/auth" component={asyncAuth} />
            <Redirect to ="/"/>
      </Switch>
    );

    if(this.props.isAuthenticated){
        
      routes=(
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrder} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to ="/"/>
        </Switch>
      );
    }

    return (
      <div> 
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return{
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    onTryAutoSignup : () => dispatch(actions.authCheckState())
}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps) (App));
