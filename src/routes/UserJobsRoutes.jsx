// src/routes/UserJobsRoutes.js
import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// Page
const UserJobs = Loadable(lazy(() => import('views/UserJobs')));

const UserJobsRoutes = {
    path: '/',
    element: <DashboardLayout />,
    children: [
        {
            path: '/Jobs',
            element: <UserJobs />
        }
    ]
};

export default UserJobsRoutes;
