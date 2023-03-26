import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openModal } from "../modal/modalSlice";

const url = "https://course-apis.com/react-useReducer-cart-project/";

const initialState = {
  cartItems: [],
  amount: 2,
  total: 0,
  price: 0,
  isloading: true,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    try {
      //console.log(name); // pass parameter from component
      console.log(thunkAPI);
      //console.log(thunkAPI.getState()); // access whole application state
      //thunkAPI.dispatch(openModal()) // access actions from another feature
      
      const res = await axios(url);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },

    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== itemId
      );
    },

    increaseCartItemAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find(
        (item) => item.id === payload.id
      );
      cartItem.amount += 1;
      //cartItem.price += cartItem.price;
    },

    decreaseCartItemAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find(
        (item) => item.id === payload.id
      );
      cartItem.amount -= 1;
      //cartItem.price -= cartItem.price;
    },

    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },

  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isloading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      //console.log(action);
      state.isloading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      state.isloading = false;
      console.log(action);
    },
  },
});

export const {
  clearCart,
  removeItem,
  increaseCartItemAmount,
  decreaseCartItemAmount,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
