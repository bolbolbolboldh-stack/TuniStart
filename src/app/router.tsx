import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { ResultsLayout } from '../components/layout/ResultsLayout'
import { DiagnosticPage } from '../pages/DiagnosticPage'
import { HomePage } from '../pages/HomePage'

/** Route-level code splitting: secondary pages load on demand. */
const page = <K extends string>(loader: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(async () => ({ default: (await loader())[name] }))

const GuidePage = page(() => import('../pages/GuidePage'), 'GuidePage')
const ResultsPage = page(() => import('../pages/ResultsPage'), 'ResultsPage')
const OrientationPage = page(() => import('../pages/OrientationPage'), 'OrientationPage')
const DocumentsPage = page(() => import('../pages/DocumentsPage'), 'DocumentsPage')
const TimelinePage = page(() => import('../pages/TimelinePage'), 'TimelinePage')
const BudgetPage = page(() => import('../pages/BudgetPage'), 'BudgetPage')
const SummaryPage = page(() => import('../pages/SummaryPage'), 'SummaryPage')
const ResourcesPage = page(() => import('../pages/ResourcesPage'), 'ResourcesPage')
const GlossaryPage = page(() => import('../pages/GlossaryPage'), 'GlossaryPage')
const LegalNoticePage = page(() => import('../pages/LegalNoticePage'), 'LegalNoticePage')
const NotFoundPage = page(() => import('../pages/NotFoundPage'), 'NotFoundPage')

function Loading() {
  return (
    <div className="container-page flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-ink" />
      <span className="sr-only">…</span>
    </div>
  )
}
const S = (n: ReactNode) => <Suspense fallback={<Loading />}>{n}</Suspense>

export const routes = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/guide', element: S(<GuidePage />) },
      { path: '/diagnostic', element: <DiagnosticPage /> },
      {
        path: '/resultats',
        element: <ResultsLayout />,
        children: [
          { index: true, element: S(<ResultsPage />) },
          { path: 'orientation', element: S(<OrientationPage />) },
          { path: 'documents', element: S(<DocumentsPage />) },
          { path: 'parcours', element: S(<TimelinePage />) },
          { path: 'budget', element: S(<BudgetPage />) },
          { path: 'synthese', element: S(<SummaryPage />) },
        ],
      },
      { path: '/ressources', element: S(<ResourcesPage />) },
      { path: '/glossaire', element: S(<GlossaryPage />) },
      { path: '/mentions', element: S(<LegalNoticePage />) },
      { path: '*', element: S(<NotFoundPage />) },
    ],
  },
]

export const createRouter = () => createBrowserRouter(routes)
