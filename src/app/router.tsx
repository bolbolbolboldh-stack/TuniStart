import { createBrowserRouter } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { ResultsLayout } from '../components/layout/ResultsLayout'
import { BudgetPage } from '../pages/BudgetPage'
import { DiagnosticPage } from '../pages/DiagnosticPage'
import { DocumentsPage } from '../pages/DocumentsPage'
import { GlossaryPage } from '../pages/GlossaryPage'
import { GuidePage } from '../pages/GuidePage'
import { HomePage } from '../pages/HomePage'
import { LegalNoticePage } from '../pages/LegalNoticePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OrientationPage } from '../pages/OrientationPage'
import { ResourcesPage } from '../pages/ResourcesPage'
import { ResultsPage } from '../pages/ResultsPage'
import { SummaryPage } from '../pages/SummaryPage'
import { TimelinePage } from '../pages/TimelinePage'

export const routes = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/guide', element: <GuidePage /> },
      { path: '/diagnostic', element: <DiagnosticPage /> },
      {
        path: '/resultats',
        element: <ResultsLayout />,
        children: [
          { index: true, element: <ResultsPage /> },
          { path: 'orientation', element: <OrientationPage /> },
          { path: 'documents', element: <DocumentsPage /> },
          { path: 'parcours', element: <TimelinePage /> },
          { path: 'budget', element: <BudgetPage /> },
          { path: 'synthese', element: <SummaryPage /> },
        ],
      },
      { path: '/ressources', element: <ResourcesPage /> },
      { path: '/glossaire', element: <GlossaryPage /> },
      { path: '/mentions', element: <LegalNoticePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const createRouter = () => createBrowserRouter(routes)
