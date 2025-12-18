import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import UsersRoutes from './UsersRoutes';
import RequirmentRoutes from './RequirmentRoutes';
import DepartmentRoutes from './DepartmentRoutes';
import UserJobsRoutes from './UserJobsRoutes';
import UserApplicationRoutes from './UserApplicationRoutes';
// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    PagesRoutes,
    NavigationRoutes,
    UsersRoutes,
    ComponentsRoutes,
    FormsRoutes,
    TablesRoutes,
    ChartMapRoutes,
    OtherRoutes,
    RequirmentRoutes,
    DepartmentRoutes,
    UserJobsRoutes,
    UserApplicationRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);


export default router;
