// routes/UsersRoutes.js
import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - user page
// ✅ CORRECT - adjust path to actual file location
const RequirmentPage = Loadable(lazy(() => import('views/RequirmentPage')));
const AddNewRequirement = Loadable(lazy(() => import('views/NewRequirment'))); 
const ApplicantsForJob = Loadable(lazy(() => import('views/ApplicantsForJob')));

// ==============================|| USERS ROUTING ||============================== //
const RequirmentRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/Requirment',
      element: <RequirmentPage />
    },
    {
      path: 'Requirment/add',
      element: <AddNewRequirement />
    }
    ,
    {
      path: 'Requirment/Applicants',
      element: <ApplicantsForJob />
    }
  ]
};

export default RequirmentRoutes;
