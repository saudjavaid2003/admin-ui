import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root"; 
import User from "./pages/users/User";
export const router=createBrowserRouter([
    {
        path:"/",
        element:<Root/>,
        children:[
              {
        path:"",
        element:<Dashboard/>,
        children:[
            {
                path:"",
                index:true,
                element:<HomePage/>
            },
             {
                path:"users",
                element:<User/>
            }
        ]
    },
    {
        path:"/auth",
        element:<NonAuth/>,
        children:[
            {
                path:"login",
                element:<Login/>
            }
        ]
    }

        ]
    }
  
])