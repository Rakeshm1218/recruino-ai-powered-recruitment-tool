import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import your reducers
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import candidateReducer from './slices/candidateSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  candidates: candidateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// // store.js
// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';

// // Import your reducers
// import authReducer from './slices/authSlice';
// import jobReducer from './slices/jobSlice';
// import candidateReducer from './slices/candidateSlice';

// // Updated persist config
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth', 'jobs', 'candidates'], // Now persisting all three
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   jobs: jobReducer,
//   candidates: candidateReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
// });

// export const persistor = persistStore(store);