/**
 * Configuration centralisée des routes avec lazy loading
 */

import { lazy } from 'react';
import { ROUTES, SCHOOLS } from '../constants/routes';
import SchoolAuth from '../components/student/SchoolAuth';
import AdminAuth from '../components/admin/AdminAuth';

// Lazy load toutes les pages pour améliorer les performances
const SalesLandingPage = lazy(() => import('../pages/SalesLandingPage'));
const SelectSchoolPage = lazy(() => import('../pages/SelectSchoolPage'));
const EugeniaSchoolPage = lazy(() => import('../pages/EugeniaSchoolPage'));
const AlbertSchoolPage = lazy(() => import('../pages/AlbertSchoolPage'));
const EugeniaLoginPage = lazy(() => import('../pages/EugeniaLoginPage'));
const AlbertLoginPage = lazy(() => import('../pages/AlbertLoginPage'));
const LeaderboardPage = lazy(() => import('../pages/LeaderboardPage'));
const SubmitActionPage = lazy(() => import('../pages/SubmitActionPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const AmbassadeursPage = lazy(() => import('../pages/AmbassadeursPage'));
const AssociationsPage = lazy(() => import('../pages/AssociationsPage'));
const StudentProfilePage = lazy(() => import('../pages/StudentProfilePage'));
const StudentPublicProfilePage = lazy(() => import('../pages/StudentPublicProfilePage'));
const ReportIssuePage = lazy(() => import('../pages/ReportIssuePage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminGuide = lazy(() => import('../pages/AdminGuide'));
const ValidationQueue = lazy(() => import('../components/admin/ValidationQueue'));
const ReportsQueue = lazy(() => import('../components/admin/ReportsQueue'));
const ActionTypeEditor = lazy(() => import('../components/admin/ActionTypeEditor'));
const LeaderboardConfig = lazy(() => import('../components/admin/LeaderboardConfig'));
const AutomationConfig = lazy(() => import('../components/admin/AutomationConfig'));
const LandingConfig = lazy(() => import('../components/admin/LandingConfig'));
const Analytics = lazy(() => import('../pages/Analytics'));
const GoogleOAuthCallback = lazy(() => import('../pages/GoogleOAuthCallback'));
const GoogleSheetsSetup = lazy(() => import('../pages/GoogleSheetsSetup'));
const AssociationManagementPage = lazy(() => import('../pages/AssociationManagementPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * Crée les routes étudiantes pour une école
 */
export function createStudentRoutes(school) {
  const schoolPath = school === SCHOOLS.EUGENIA ? '/eugenia-school' : '/albert-school';
  const LoginPage = school === SCHOOLS.EUGENIA ? EugeniaLoginPage : AlbertLoginPage;
  const SchoolPage = school === SCHOOLS.EUGENIA ? EugeniaSchoolPage : AlbertSchoolPage;

  return [
    {
      path: `${schoolPath}/login`,
      element: <LoginPage />
    },
    {
      path: `${schoolPath}`,
      element: (
        <SchoolAuth school={school}>
          <SchoolPage />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/portfolio`,
      element: (
        <SchoolAuth school={school}>
          <PortfolioPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/ambassadeurs`,
      element: (
        <SchoolAuth school={school}>
          <AmbassadeursPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/associations`,
      element: (
        <SchoolAuth school={school}>
          <AssociationsPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/associations/agenda`,
      element: (
        <SchoolAuth school={school}>
          <AssociationsPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/leaderboard`,
      element: (
        <SchoolAuth school={school}>
          <LeaderboardPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/submit`,
      element: (
        <SchoolAuth school={school}>
          <SubmitActionPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/report`,
      element: (
        <SchoolAuth school={school}>
          <ReportIssuePage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/student/profile`,
      element: (
        <SchoolAuth school={school}>
          <StudentProfilePage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/notifications`,
      element: (
        <SchoolAuth school={school}>
          <NotificationsPage school={school} />
        </SchoolAuth>
      )
    },
    {
      path: `${schoolPath}/association/:id/manage`,
      element: (
        <SchoolAuth school={school}>
          <AssociationManagementPage school={school} />
        </SchoolAuth>
      )
    }
  ];
}

/**
 * Crée les routes admin pour une école
 */
export function createAdminRoutes(school) {
  const schoolPath = school === SCHOOLS.EUGENIA ? '/eugenia-school' : '/albert-school';

  return [
    {
      path: `${schoolPath}/admin`,
      element: (
        <AdminAuth school={school}>
          <AdminPage school={school} />
        </AdminAuth>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard school={school} />
        },
        {
          path: 'validate',
          element: <ValidationQueue school={school} />
        },
        {
          path: 'reports',
          element: <ReportsQueue school={school} />
        },
        {
          path: 'actions',
          element: <ActionTypeEditor school={school} />
        },
        {
          path: 'leaderboard',
          element: <LeaderboardConfig school={school} />
        },
        {
          path: 'automations',
          element: <AutomationConfig school={school} />
        },
        {
          path: 'analytics',
          element: <Analytics school={school} />
        },
        {
          path: 'google-sheets',
          element: <GoogleSheetsSetup school={school} />
        },
        {
          path: 'rewards',
          element: <LandingConfig school={school} />
        },
        {
          path: 'texts',
          element: <LandingConfig school={school} />
        },
        {
          path: 'guide',
          element: <AdminGuide school={school} />
        }
      ]
    }
  ];
}

/**
 * Routes publiques
 */
export const publicRoutes = [
  {
    path: ROUTES.HOME,
    element: <SalesLandingPage />
  },
  {
    path: ROUTES.SELECT_SCHOOL,
    element: <SelectSchoolPage />
  },
  {
    path: ROUTES.GOOGLE_OAUTH_CALLBACK,
    element: <GoogleOAuthCallback />
  },
  {
    path: ROUTES.PROFILE_PUBLIC,
    element: <StudentPublicProfilePage />
  }
];

/**
 * Toutes les routes combinées
 */
export function getAllRoutes() {
  return [
    ...publicRoutes,
    ...createStudentRoutes(SCHOOLS.EUGENIA),
    ...createStudentRoutes(SCHOOLS.ALBERT),
    ...createAdminRoutes(SCHOOLS.EUGENIA),
    ...createAdminRoutes(SCHOOLS.ALBERT),
    {
      path: '*',
      element: <NotFoundPage />
    }
  ];
}


