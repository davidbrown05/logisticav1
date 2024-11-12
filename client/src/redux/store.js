import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  useReducer  from './user/userSlice'
import juridicoReducer from './juridico/juridicoSlice'
import postsReducer from './juridico/postSlice'
import listsReducer from './juridico/deudaGlobalSlice';
import pagosListReducer  from './juridico/pagosPendientesSlice'

import {persistReducer, persistStore} from "redux-persist"
import storage from 'redux-persist/lib/storage';

// Combina los reducers en uno solo
const rootReducer = combineReducers({
user: useReducer,
//posts: postsReducer,
//lists: listsReducer,
//juridico: juridicoReducer,
//pagosLists: pagosListReducer,

});

// Configuración para redux-persist
const persistConfig = {
  key:"root",
  storage,
  version: 1,
}

// Aplicar persistencia al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Crear la tienda con el reducer persistente y middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false,
  }),
})

export const persistor = persistStore(store);

