// routes/UsersRoutes.js
import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - user page
// ✅ CORRECT - adjust path to actual file location
const UsersPage = Loadable(lazy(() => import('views/UsersPage')));
const AddNewUser = Loadable(lazy(() => import('views/AddNewUser')));
const EditUser = Loadable(lazy(() => import('views/EditUser')));

// ==============================|| USERS ROUTING ||============================== //
const UsersRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/users',
      element: <UsersPage />
    },
    {
      path: 'users/add',
      element: <AddNewUser />
    },
    {
      path: 'users/edit',
      element: <EditUser />
    }
  ]
};

export default UsersRoutes;
