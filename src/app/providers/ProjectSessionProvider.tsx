import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { sampleBudgetLines, sampleFunding, sampleProfile } from '../../data/sampleMarcheKarim'
import { emptyProfile } from '../../domain/schemas/project.schema'
import { buildProjectResults, type ProjectResults } from '../../domain/summary/buildProjectSummary'
import type { BudgetLine, FundingSource, Lang, ProjectProfile } from '../../domain/types'

const KEY = 'tunistart-session-v1'

export interface SessionState {
  profile: ProjectProfile
  /** True once the diagnostic has been validated and results generated. */
  completed: boolean
  step: number
  prepared: Record<string, boolean>
  budgetLines: BudgetLine[]
  funding: FundingSource[]
}

type Action =
  | { type: 'patch'; patch: Partial<ProjectProfile> }
  | { type: 'step'; step: number }
  | { type: 'complete' }
  | { type: 'toggle-doc'; id: string }
  | { type: 'reset-docs' }
  | { type: 'set-lines'; lines: BudgetLine[] }
  | { type: 'set-funding'; funding: FundingSource[] }
  | { type: 'load-sample'; lang: Lang }
  | { type: 'load-sample-budget'; lang: Lang }
  | { type: 'reset-budget' }
  | { type: 'clear' }

export const initialSession = (): SessionState => ({
  profile: emptyProfile(),
  completed: false,
  step: 1,
  prepared: {},
  budgetLines: [],
  funding: [],
})

export function sessionReducer(s: SessionState, a: Action): SessionState {
  switch (a.type) {
    case 'patch':
      return { ...s, profile: { ...s.profile, ...a.patch, isSample: a.patch.isSample ?? false } }
    case 'step':
      return { ...s, step: Math.min(7, Math.max(1, a.step)) }
    case 'complete':
      return { ...s, completed: true }
    case 'toggle-doc':
      return { ...s, prepared: { ...s.prepared, [a.id]: !s.prepared[a.id] } }
    case 'reset-docs':
      return { ...s, prepared: {} }
    case 'set-lines':
      return { ...s, budgetLines: a.lines }
    case 'set-funding':
      return { ...s, funding: a.funding }
    case 'load-sample':
      return {
        profile: { ...sampleProfile },
        completed: true,
        step: 7,
        prepared: {},
        budgetLines: sampleBudgetLines(a.lang),
        funding: sampleFunding(a.lang),
      }
    case 'load-sample-budget':
      return { ...s, budgetLines: sampleBudgetLines(a.lang), funding: sampleFunding(a.lang) }
    case 'reset-budget':
      return { ...s, budgetLines: [], funding: [] }
    case 'clear':
      return initialSession()
  }
}

function load(): SessionState {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SessionState
      if (parsed && parsed.profile) return { ...initialSession(), ...parsed, profile: { ...emptyProfile(), ...parsed.profile } }
    }
  } catch {
    /* ignore corrupted session */
  }
  return initialSession()
}

export interface SessionValue {
  state: SessionState
  dispatch: React.Dispatch<Action>
  results: ProjectResults | null
}

export const ProjectSessionContext = createContext<SessionValue | null>(null)

export function ProjectSessionProvider({ children, initial }: { children: ReactNode; initial?: SessionState }) {
  const [state, dispatch] = useReducer(sessionReducer, undefined, () => initial ?? load())

  useEffect(() => {
    try {
      // Session-scoped only; never sent anywhere.
      sessionStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const results = useMemo(
    () => (state.completed ? buildProjectResults(state.profile, state.budgetLines, state.funding) : null),
    [state.completed, state.profile, state.budgetLines, state.funding],
  )

  return <ProjectSessionContext.Provider value={{ state, dispatch, results }}>{children}</ProjectSessionContext.Provider>
}
