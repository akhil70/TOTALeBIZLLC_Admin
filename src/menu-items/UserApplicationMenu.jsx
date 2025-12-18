// ==============================|| MENU ITEMS - JOBS ||============================== //

const UserApplicationMenu = {
    id: 'group-jobs',
    title: 'Status',
    type: 'group',
    children: [
        {
            id: 'jobs-section',
            title: 'Application Status',
            type: 'item',
            icon: <i className="ph ph-briefcase" />, 
            url: '/ApplicationStatus'
        }
    ]
};

export default UserApplicationMenu;