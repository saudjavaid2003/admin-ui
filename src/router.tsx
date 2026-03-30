import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/login';
import Dashboard from './layouts/Dashboard';
import NonAuth from './layouts/NonAuth';
import Root from './layouts/Root';
import Users from './pages/users/User';
import Tenants from './pages/tenants/Tenants';
import Products from './pages/products/Products';
// 1. Import your Categories component
// import Categories from './pages/categories/categoires'; 

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dashboard />,
                children: [
                    {
                        path: '',
                        element: <HomePage />,
                    },
                    {
                        path: '/users',
                        element: <Users />,
                    },
                    {
                        path: '/restaurants',
                        element: <Tenants />,
                    },
                    {
                        path: '/products',
                        element: <Products />,
                    },
                    // 2. Add the Categories route here
                    // {
                    //     path: '/categories',
                    //     element: <Categories />,
                    // }
                ],
            },
            {
                path: '/auth',
                element: <NonAuth />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                ],
            },
        ],
    },
]);