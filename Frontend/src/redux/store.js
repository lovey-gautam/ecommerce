import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import productSlice from './productSlice'
import userReducer from "./userSlice"
import productReducer from './productSlice'
import {
  
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "EKart",
  storage,
  whitelist: ["user", "product"], // persist these slices

}

const rootReducer = combineReducers({
    user:userReducer,
    product:productReducer
})
const persistedUserReducer = persistReducer(persistConfig, userReducer)

const store = configureStore({
  reducer: 
  {
    user: persistedUserReducer,
    product:productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(store)
export default store