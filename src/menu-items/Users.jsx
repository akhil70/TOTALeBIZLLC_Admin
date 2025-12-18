// ==============================|| MENU ITEMS - USERS ||============================== //

const UsersMenu = {
  id: 'group-users',
  title: 'Users',
  type: 'group',
  children: [   
    {
            id: 'user-management',
            title: 'User Management',
            type: 'item',
            icon: <i className="ph ph-users" />,
            url: '/users'
        }
  ]
};

export default UsersMenu;
