import { lazy } from 'react';

const UserAdmin = lazy(() => import('../pages/dashboard/admindash/UserAdmin'));

const dashboardRoutes = [
      {
        path: '/dashboard/admin/users',
        name: 'UserAdmin',
        element: UserAdmin,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
      },
  ];

const allRoutes = [
  ...dashboardRoutes,
];

export default allRoutes;
