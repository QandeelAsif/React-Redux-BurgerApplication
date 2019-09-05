import React from 'react';
import Aux from '../../../hoc/Auxiliiary/Auxiliary'
import Button from '../../UI/Button/Button'

const orderSummary=(props)=>{
    const ingredientsSummary = Object.keys(props.ingredients).map(igKEy => {
        return <li key={igKEy}>
        <span style={{textTransform:'capitalize'}}>{igKEy}</span>
        : {props.ingredients[igKEy]}</li>
    })

    return(
        <Aux>
            <h3>Your Order!!!!</h3>
            <p>Our recipie and your choice</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p><strong>YOUR BILL: {props.price.toFixed(2)}$</strong></p>
            <p>Continue to checkout?</p>
            
            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
        </Aux>
    )
}

export default orderSummary;