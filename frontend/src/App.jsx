import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout (Navbar) */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/candidates" element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { Provider, useSelector } from 'react-redux'
// import { persistor, store } from './store/store'
// import Home from './pages/Home'
// import Jobs from './pages/Jobs'
// import Candidates from './pages/Candidates'
// import Login from './components/auth/Login'
// import Register from './components/auth/Register'
// import Dashboard from './components/dashboard/Dashboard'
// import Layout from './components/Layout'
// import { PersistGate } from 'redux-persist/integration/react'

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { token } = useSelector((state) => state.auth)
//   return token ? children : <Navigate to="/login" replace />
// }

// function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//           {/* Protected Routes with Layout (Navbar) */}
//           <Route element={<Layout />}>
//             <Route path="/" element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             } />
//             <Route path="/jobs" element={
//               <ProtectedRoute>
//                 <Jobs />
//               </ProtectedRoute>
//             } />
//             <Route path="/candidates" element={
//               <ProtectedRoute>
//                 <Candidates />
//               </ProtectedRoute>
//             } />
//             <Route path="/dashboard" element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } />
//           </Route>
//         </Routes>
//       </Router>
//       </PersistGate>
//     </Provider>
//   )
// }

// export default App