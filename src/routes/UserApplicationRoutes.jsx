// src/routes/UserJobsRoutes.js
import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// Page
const UserApplicationStatus = Loadable(lazy(() => import('views/UserApplicationStatus')));

const UserApplicationRoutes = {
    path: '/',
    element: <DashboardLayout />,
    children: [
        {
            path: '/ApplicationStatus',
            element: <UserApplicationStatus />
        }
    ]
};

export default UserApplicationRoutes;
