import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ProjectSessionProvider } from '../../app/providers/ProjectSessionProvider'
import { ThemeProvider } from '../../app/providers/ThemeProvider'
import { routes } from '../../app/router'
import { ToastProvider } from '../../components/ui/Toast'
import { I18nProvider } from '../../i18n/I18nProvider'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <ThemeProvider>
      <I18nProvider initial="fr">
        <ProjectSessionProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ProjectSessionProvider>
      </I18nProvider>
    </ThemeProvider>,
  )
}

describe('Diagnostic wizard', () => {
  it('blocks Next with a French error, then advances and preserves the answer', async () => {
    sessionStorage.clear()
    const user = userEvent.setup()
    renderAt('/diagnostic')
    expect(screen.getByRole('heading', { level: 1, name: /activité principale/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Suivant/ }))
    expect(screen.getAllByRole('alert')[0]).toHaveTextContent(/Choisissez une activité/)
    await user.click(screen.getByRole('radio', { name: /Commerce de détail/ }))
    await user.click(screen.getByRole('button', { name: /Suivant/ }))
    expect(await screen.findByRole('heading', { level: 1, name: /Combien de personnes/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Précédent/ }))
    expect(await screen.findByRole('radio', { name: /Commerce de détail/ })).toHaveAttribute('aria-checked', 'true')
  })

  it('shows a friendly empty state on results without a session', () => {
    sessionStorage.clear()
    renderAt('/resultats/budget')
    expect(screen.getByText(/Aucun projet en cours/)).toBeInTheDocument()
  })
})
