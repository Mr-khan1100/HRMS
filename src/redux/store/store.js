import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers/rootReducer';
import EncryptedStorage from 'react-native-encrypted-storage';

const encryptedStorage = {
  setItem: async (key, value) => {
    await EncryptedStorage.setItem(key, value);
    return Promise.resolve();
  },
  getItem: async (key) => {
    const value = await EncryptedStorage.getItem(key);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    await EncryptedStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: encryptedStorage,
  whitelist: ['users'],
  stateReconciler: (inboundState, originalState) => ({
    ...originalState,
    users: inboundState.users,
  }),
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
