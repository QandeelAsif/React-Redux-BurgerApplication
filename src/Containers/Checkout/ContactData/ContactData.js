import React, { Component } from 'react';
import {connect} from 'react-redux';

import Input from '../../../Components/UI/Input/Input'
import Button from '../../../Components/UI/Button/Button';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'


class ContactData extends Component {
    state = {
        orderForm:{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipcode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'ZIP CODE'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touched:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true
                }, 
                valid:false,
                touched:false
            },
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your E-Mail'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[
                        {value: 'fastest', displayValue: 'Fastest' },
                        {value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                validation:{
                    required:true
                },
                value:'fastest',
                valid:true
            }
        },
        formIsValid: false
    }

    orderHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        //-----setting form values to inputted values---///
        const formData={};
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

            ///passiing data to firebase
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,    
            orderData: formData,
            userId:this.props.userId
        }
        this.props.onOrderBurger(order,this.props.token);
    }


    ///////////////////FORM VALIDATION////////////

    checkValidity (value, rules) {
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== ' ' && isValid;
        }
        if(rules.required){
            isValid= value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        if(rules.isEmail){
            const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            isValid=pattern.test(value) && isValid
        }
        if(rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid=pattern.test(value) && isValid
        }
        return isValid;
    }
    //handles inputs and binds it to orderForm
     inputChangedHandler = (event, inputIdentifier) => {
         //console.log(event.target.value);
            //deep cloning-------
        const updatedOrderForm= {
            ...this.state.orderForm
        };
        const updatedFormElement= {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value= event.target.value;
        updatedFormElement.valid=this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched= true;

            //checking validity of complete form
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm){
            formIsValid= updatedOrderForm[inputIdentifier].value && formIsValid
        }
        // console.log(updatedFormElement)
        this.setState({ orderForm: updatedOrderForm , formIsValid:formIsValid});
     }


    render () {

        const formElementArray =[];
        for(let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementArray.map( formeElement => (
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
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }


        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
    }
} 

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios))  ; 