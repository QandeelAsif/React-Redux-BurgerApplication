import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../Components/UI/Button/Button';
import Input from'../../Components/UI/Input/Input';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { updateObjects , checkValidity } from '../../shared/utility';

class Auth extends Component{

    state={
        controls:{
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your Email Address'
                },
                value:'',
                validation:{
                    required:true,
                    isEmail:true
                },
                valid:false,
                touched:false
            },
            password:{
                elementType:'input',
                elementConfig:{
                    type:'password',
                    placeholder:'Password'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:6
                },
                valid:false,
                touched:false
            }
        },
        isSignup:true,
    }

    componentDidMount() {
        if( !this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath(); 
        }
    }

    inputChangedHandler = (event,controlName) => {
        const updatedControls = updateObjects( this.state.controls , {
            [controlName]: updateObjects(this.state.controls[controlName] , {
                value:event.target.value,
                valid:checkValidity(event.target.value,this.state.controls[controlName].validation),
                touched:true
            })
        });
        this.setState({controls:updatedControls})
}

submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignup)
}

switchAuthModeHandler = () => {
    this.setState(prevState => {
        return{ isSignup : !prevState.isSignup}
    })
}

    render(){

        const formElementArray =[];
        for(let key in this.state.controls){
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formElementArray.map( formeElement => (
            <Input 
                        key={formeElement.id}
                         elementType={formeElement.config.elementType}
                        elementConfig= {formeElement.config.elementConfig}
                        value={formeElement.config.value}
                        invalid={!formeElement.config.valid}
                        touched={formeElement.config.touched}
                        shouldValidate={formeElement.config.validation}
                        changed={(event)=> this.inputChangedHandler(event, formeElement.id)}
                    />
        ))
        
        if(this.props.loading){
            form= <Spinner/>
        }

        //using firebase provided error message
        let errorMessage = null;
        if(this.props.error){
            console.log(this.props.error)
            errorMessage=(
                <p>{this.props.error.message}</p>
            )
        } 

        ///// Reirection if uthenticated
        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to ={this.props.authRedirectPath} />
        }

        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit= {this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button btnType="Danger"
                clicked={this.switchAuthModeHandler}>
                {this.state.isSignup ? 'SIGN IN' : 'SIGN UP' }</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated :state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath

    }
};

const mapDispatchToProps = dispatch =>{
    return{
        onAuth: (email,password,isSignup) => dispatch(actions.auth(email,password,isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Auth);