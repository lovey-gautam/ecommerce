import { createSlice } from "@reduxjs/toolkit";

const initialSelectedAddress = JSON.parse(localStorage.getItem('selectedAddress')) || null;
const initialAddresses = JSON.parse(localStorage.getItem('addresses')) || [];

const initialCart = JSON.parse(localStorage.getItem('cart')) || {
  items: [],
  totalPrice: 0,
  totalQuantity: 0
};
const productSlice = createSlice({
    name:'product',
    initialState:{
        products:[],
        cart:initialCart,
        addresses:initialAddresses,
        selectedAddress:initialSelectedAddress,
        /*{
             items: [], 
             totalPrice: 0 ,
            totalQuantity:0},// empty array */
    },
    reducers:{

        setProducts:(state,action)=>{
            state.products = action.payload
        },


setCart:(state,action)=>{ 
    state.cart = action.payload 
  localStorage.setItem('cart', JSON.stringify(state.cart)) // persist cart

},
//Address management
addAddress:(state,action)=>{
    if(!state.addresses) state.addresses=[];
    state.addresses.push(action.payload)
    localStorage.setItem('addresses', JSON.stringify(state.addresses));

},

setSelectedAddress:(state,action)=>{
    state.selectedAddress = action.payload
        localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));

},
deleteAddress:(state,action)=>{
    state.addresses = state.addresses.filter((_,index)=>index !== action.payload)
        localStorage.setItem('addresses', JSON.stringify(state.addresses));


//reset selecet address if it was delted
if(state.selectedAddress === action.payload){
    state.selectedAddress=null
    localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));

}
}  
    }
})

export const {setProducts,setCart,setSelectedAddress,deleteAddress,addAddress}= productSlice.actions
export default productSlice.reducer