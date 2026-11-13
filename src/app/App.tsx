import { useState } from 'react'
import { RouterProvider } from 'react-router'
import { ToastProvider } from '../components/ui/Toast'
import { I18nProvider } from '../i18n/I18nProvider'
import { ProjectSessionProvider } from './providers/ProjectSessionProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { createRouter } from './router'

export function App() {
  const [router] = useState(createRouter)
  return (
    <ThemeProvider>
      <I18nProvider>
        <ProjectSessionProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ProjectSessionProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
