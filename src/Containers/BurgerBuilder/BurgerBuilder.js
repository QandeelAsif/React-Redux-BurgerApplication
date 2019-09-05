 import React,{Component} from 'react';
import Aux from '../../hoc/Auxiliiary/Auxiliary';
import  Burger from '../../Components/Burger/Burger'
import BuildControls from '../../Components/Burger/BuildControls/BuildControls'
import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import Spinner from '../../Components/UI/Spinner/Spinner'


const INGREDIENT_PRICES={
    salad:0.5,
    cheese:0.7,
    bacon:1.0,
    meat:1.5
}


class BurgerBuilder extends Component{

    state={
        ingredients:null,
        totalPrice:4,
        purchaseable:false,
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

    addIngredientHandler= (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount= oldCount+1;
        const updatedIngredients= {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceAddition=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice=oldPrice + priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientsHandler =(type)=>{
        const oldCount = this.state.ingredients[type];
            //count of item check so it doesnt crash
         if(oldCount <=0) {return;}

        const updatedCount= oldCount - 1;
        const updatedIngredients= {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceDeduction=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice=oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState(ingredients){
         const sum=Object.keys(ingredients)
         .map( igKey => {
             return ingredients[igKey];
         }).reduce((sum,el)=>{
             return sum + el;
         },0);
         this.setState({purchaseable:sum>0})
    }

    purchaseHandler=() =>{
        this.setState({purchasing:true}) 
    }

    purchaseCancel=()=>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler=(props)=>{
        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search:'?' + queryString
        })

        // this.props.history.push('/checkout');
    }

    render(){ 

        const disabledInfo={
            ...this.state.ingredients
        };
          
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key] <= 0
        }

        let orderSummary=null;
        let burger = this.state.error ? <h4>Ingredients can't be loaded</h4> : <Spinner/>
        
        if(this.state.ingredients){
            burger=(
            <Aux>
                <Burger ingredients={this.state.ingredients}/> 
                <BuildControls
                    ingredientsAdded={this.addIngredientHandler}
                    ingredientsRemoved={this.removeIngredientsHandler}
                    disabled={disabledInfo}
                    totalPrice={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler}
                    />  
                    
            </Aux>
            );
            orderSummary= <OrderSummary 
                ingredients={this.state.ingredients }
                purchaseCancelled={this.purchaseCancel}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
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
export default withErrorHandler(BurgerBuilder , axios);