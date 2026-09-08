import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import companyReducer from './companySlice';
import jobReducer from './jobSlice';
import applicationReducer from './applicationSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  job: jobReducer,
  application: applicationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
