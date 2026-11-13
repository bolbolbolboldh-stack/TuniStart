import { useContext } from 'react'
import { ProjectSessionContext } from '../app/providers/ProjectSessionProvider'

export function useProjectSession() {
  const ctx = useContext(ProjectSessionContext)
  if (!ctx) throw new Error('useProjectSession must be used inside <ProjectSessionProvider>')
  return ctx
}
