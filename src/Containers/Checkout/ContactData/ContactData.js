import React, { Component } from 'react';
import {connect} from 'react-redux';

import Input from '../../../Components/UI/Input/Input'
import Button from '../../../Components/UI/Button/Button';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index';
import { updateObjects,checkValidity } from '../../../shared/utility';


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

    //handles inputs and binds it to orderForm

     inputChangedHandler = (event, inputIdentifier) => {
         //console.log(event.target.value);
            //deep cloning-- using utility SHARED property
        const updatedFormElement= updateObjects(this.state.orderForm[inputIdentifier], {
            value:  event.target.value ,
            valid: checkValidity(event.target.value,
                this.state.orderForm[inputIdentifier].validation) ,
            touched: true
        });

        const updatedOrderForm= updateObjects(this.state.orderForm,{
            [inputIdentifier]:updatedFormElement
        });

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
};

const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return{
        onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
    }
} 

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios))  ; 