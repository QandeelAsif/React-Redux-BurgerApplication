import * as actionTypes from '../actions/actionTypes';
import {updateObjects} from '../../shared/utility'
 

const initialState= {
    orders: [],
    loading:false,
    purchased:false
}

const purchaseInit = (state,action) => {
    return updateObjects(state, {purchased:false})
}  
const purchaseBurgerStart = (state,action) => {
    return updateObjects(state, {loading:true })
}
const purchaseBurgerSuccess = (state,action) => {
    const newOrder = updateObjects( action.orderData, {id:action.orderId} )
            return updateObjects(state,{
                loading:false,
                purchased:true,
                orders:state.orders.concat(newOrder)
                })
}
const purchaseBurgerFailed = (state,action) => {
    return updateObjects(state, {loading:false})
}


        //fetching orders from sever
const fetchOrdersStart = (state,action) => {
    return updateObjects(state,{loading:true})
}
const fetchOrdersSuccess= (state,action) => {
    return updateObjects(state, {
        orders:action.orders,
        loading:false
    })
}
const fetchOrdersFailed= (state,action) => {
    return updateObjects (state, {loading:false})
}


        //CONTROLLER REDUCER///
const reducer = (state=initialState,action) => {
    switch(action.type){
        case actionTypes.PURCHASE_INIT: return purchaseInit(state,action)
        case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerStart(state,action)
        case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess(state,action)
        case actionTypes.PURCHASE_BURGER_FAILED:
            return purchaseBurgerFailed(state,action)

            ////////////////fetching orders from server
            
        case actionTypes.FETCH_ORDERS_START:
               return fetchOrdersStart(state,action)
        case actionTypes.FETCH_ORDERS_SUCCESS:
                return fetchOrdersSuccess(state,action)
        case actionTypes.FETCH_ORDERS_FAILED:
                   return fetchOrdersFailed(state,action)
        default:       return state;
    }
};

export default reducer;