// App.js
import './App.css'; // Import main CSS for global styles
import HomePage from './pages/HomePage/HomePage';
import ListPage from './pages/ListPage/ListPage';
import SinglePage from './pages/SinglePage/SinglePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar'; // Import Navbar directly
import RequireAuth from './pages/Layout/RequireAuth';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'; // Import Outlet
import ProfUpdatePage from './pages/ProfUpdatePage/ProfUpdatePage';
import NewPostPage from './pages/NewPostPage/NewPostPage';
import { listPageLoader, ProfilePageLoader, singlePageLoader } from './lib/loaders';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

function App() {
  // Define routes using createBrowserRouter
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar /> {/* Directly include the Navbar */}
          <Outlet /> {/* Render child routes here */}
        </>
      ),
      children: [
        { path: '/', element: <HomePage /> }, // Home page
        { path: '/list', element: <ListPage />, loader: listPageLoader }, // List of properties
        { path: '/:id', element: <SinglePage />, loader: singlePageLoader }, // Single property details
        { path: '/register', element: <Register /> }, // Registration page
        { path: '/login', element: <Login /> }, // Login page
        { path: '/add', element: <NewPostPage /> }, // Add new post page
        {
          path: '/profile',
          element: (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          ), // Profile page with authentication required
          loader: ProfilePageLoader,
        },{
          path: '/admin',
          element: (
            <RequireAuth>
              <AdminDashboard/>
            </RequireAuth>
          ),
        },
        {
          path: '/profile/update',
          element: (
            <RequireAuth>
              <ProfUpdatePage />
            </RequireAuth>
          ), // Profile update page with authentication required
        },
      ],
    },
  ]);

  // Render the RouterProvider with the defined router
  return <RouterProvider router={router} />;
}

export default App;
