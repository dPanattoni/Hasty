import { lazy } from 'react';
const Landing = lazy(() => import('../pages/landing/Landing'));

const routes = [
  {
    path: '/',
    name: 'Landing',
    exact: true,
    element: Landing,
    roles: [],
    isAnonymous: true,
  },
];

let allRoutes = [...routes];

export default allRoutes;
