import React, { Component } from 'react';
import {connect} from 'react-redux';

import Input from '../../../Components/UI/Input/Input'
import Button from '../../../Components/UI/Button/Button';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';


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
        
        loading: false,
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
            orderData: formData 
        }
        axios.post( '/orders.json', order )
            .then( response => {
                this.setState( { loading: false } );
                this.props.history.push('/');
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } ); 
    }


    ///////////////////FORM VALIDATION////////////

    checkValidity (value, rules) {
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== ' ' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
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
        if ( this.state.loading ) {
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData); 