import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import { persistReducer , FLUSH,REHYDRATE, PAUSE, PERSIST, PURGE,REGISTER } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import postSlice from "./postSlice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";


const persistConfig = {
    key: 'root', // Key for the persisted state in storage
    storage,      // Define storage (you can use sessionStorage or AsyncStorage)
  };
  
const rootReducer= combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat: chatSlice
})


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store= configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                    },
                }),
});


export default store;