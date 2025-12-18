// project-imports
import chartsMaps from './charts-maps';
import formComponents from './forms';
import navigation from './navigation';
import other from './other';
import pages from './pages';
import tableComponents from './tables';
import uiComponents from './ui-components';
import UsersMenu from '../menu-items/Users';

import RequirmentMenu from './Requirments';
import DepartmentMenu from './Department';
import UserJobsMenu from '../menu-items/UserJobs';
import UserApplicationMenu from './UserApplicationMenu';

// ==============================|| MENU ITEMS ||============================== //

// Get role from localStorage
const role = localStorage.getItem("role");

let items = [];

// Role-based menu
if (role === "ADMIN") {
  items = [navigation, UsersMenu, RequirmentMenu,DepartmentMenu];
} else if (role === "USER") {
  items = [navigation, UserJobsMenu, UserApplicationMenu];
} else {
  // default/fallback if no role
  items = [navigation];
}

const menuItems = {
  items
};

export default menuItems;
