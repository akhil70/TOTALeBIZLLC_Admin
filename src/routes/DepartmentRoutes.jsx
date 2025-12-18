// routes/UsersRoutes.js
import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - user page
// ✅ CORRECT - adjust path to actual file location
const DepartmentPage = Loadable(lazy(() => import('views/DepartmentPage')));
const AddNewRequirement = Loadable(lazy(() => import('views/NewRequirment'))); 
const ApplicantsForJob = Loadable(lazy(() => import('views/ApplicantsForJob')));

// ==============================|| USERS ROUTING ||============================== //
const DepartmentRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/Department',
      element: <DepartmentPage />
    },
    
  ]
};

export default DepartmentRoutes;
