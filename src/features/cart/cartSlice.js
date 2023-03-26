import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const url = "https://course-api.com/react-useReducer-cart-project/";

const initialState = {
  cartItems: [],
  amount: 2,
  total: 0,
  price: 0,
  isloading: true,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  () => {
    return fetch(url)
      .then((res) => res.json())
      .catch((err) => console.log(err));
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
      console.log(action);
      state.isloading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state) => {
      state.isloading = false;
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
