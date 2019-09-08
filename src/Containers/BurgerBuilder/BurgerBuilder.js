import React,{Component} from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions'

import  Burger from '../../Components/Burger/Burger'
import BuildControls from '../../Components/Burger/BuildControls/BuildControls'

import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../Components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import Aux from '../../hoc/Auxiliiary/Auxiliary';

class BurgerBuilder extends Component{

    state={

        totalPrice:4,
        purchasing:false,
        loading:false,
        error:false
    } 

    componentDidMount (){
        axios.get('https://burger-builder-d1368.firebaseio.com/ingredients.json')
            .then( response => {
                this.setState ({ingredients:response.data})
            })
            .catch(error => {
                this.setState({error:true})
            });
    }

    updatePurchaseState(ingredients){
         const sum=Object.keys(ingredients)
         .map( igKey => {
             return ingredients[igKey];
         }).reduce((sum,el)=>{
             return sum + el;
         },0);
         return sum > 0;
    }

    purchaseHandler=() =>{
        this.setState({purchasing:true}) 
    }

    purchaseCancel=()=>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler=(props)=>{
        this.props.history.push('/checkout')
    }

    render() { 

        const disabledInfo={
            ...this.props.ings
        }; 
          
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key] <= 0
        }

        let orderSummary=null;
        let burger = this.state.error ? <h4>Ingredients can't be loaded</h4> : <Spinner/>
        
        if(this.state.ingredients){
            burger=(
            <Aux>
                <Burger ingredients={this.props.ings}/> 
                <BuildControls
                    ingredientsAdded={this.props.onIngredientAdded}
                    ingredientsRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    totalPrice={this.props.price}
                    purchaseable={this.updatePurchaseState(this.props.ings)}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler}
                    />  
                    
            </Aux>
            );
            orderSummary= <OrderSummary 
                ingredients={this.props.ings }
                purchaseCancelled={this.purchaseCancel}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}
                />
        };

        
        if(this.state.loading){
            orderSummary=<Spinner/>
        }
 

        return(
            <Aux>
                <Modal show={this.state.purchasing}
                modalClosed={this.purchaseCancel}>
                    {orderSummary}                    
                </Modal>
                    {burger}
            </Aux>
        );
    }
}

const mapStateToProps= state =>{
    return {
        ings:state.ingredients,
        price:state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return { 
        onIngredientAdded: (ingName) => dispatch({type:actionTypes.ADD_INGREDIENT,ingredientName:ingName}),
        
        onIngredientRemoved: (ingName) => dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredientName:ingName}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder , axios));