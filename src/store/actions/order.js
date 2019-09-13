import * as actionTyps from './actionTypes';
import axios from '../../axios-orders';
 
export const purchaseBurgerSuccess = (id, orderData) => {
     return{
         type:actionTyps.PURCHASE_BURGER_SUCCESS,
         orderId:id,
         orderData:orderData
     }
 };
 export const purchaseBurgerFailed = (error) => {
    return{
        type:actionTyps.PURCHASE_BURGER_FAILED,
        error:error
    }
};
       ////////////////async func///////////
export const purchaseBurgerStart = () => {
    return {
        type:actionTyps.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = ( orderData,token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());

        axios.post( '/orders.json?auth=' + token, orderData )
        .then( response => {
           //console.log(response.data);
           dispatch( purchaseBurgerSuccess(response.data.name,orderData))
        } )
        .catch( error => {
            dispatch( purchaseBurgerFailed ( error ) )
        } ); 
    }
};

export const purchaseInit = () => {
    return {
        type:actionTyps.PURCHASE_INIT
    }
}

        ////////////////////////FETCHING ORDERS FROM SERVER FUNCTION ////////////////

export const fetchOrdersSuccess = (orders) => {
    return{
        type:actionTyps.FETCH_ORDERS_SUCCESS,
        orders:orders
    }
}

export const fetchOrdersFailed = (error) => {
    return{
        type:actionTyps.FETCH_ORDERS_FAILED,
        error:error
        
    }
}

export const fetchOrdersStart =() =>{
    return{
        type:actionTyps.FETCH_ORDERS_START,
    }
}

export const fetchOrders =( token , userId ) => {
    return dispatch => {
        dispatch(fetchOrdersStart())

        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'

        axios.get('/orders.json' + queryParams)
        .then(res => {
            const fetchedOrders = [];
            for (let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            console.log(fetchedOrders)
            dispatch(fetchOrdersSuccess( fetchedOrders )) 
        })
        .catch(err => {
            dispatch(fetchOrdersFailed(err))
        });
    }
}