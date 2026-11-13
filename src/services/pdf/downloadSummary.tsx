import type { SummaryModel } from '../export/summaryModel'
import { downloadBlob, slug } from '../../lib/download'

/** Generates the PDF entirely in the browser (lazy-loaded) and downloads it. */
export async function downloadSummaryPdf(m: SummaryModel, projectName: string) {
  const [{ pdf }, { ProjectSummaryPdf, registerPdfFonts }] = await Promise.all([import('@react-pdf/renderer'), import('./ProjectSummaryPdf')])
  registerPdfFonts(window.location.origin)
  const blob = await pdf(<ProjectSummaryPdf m={m} />).toBlob()
  downloadBlob(blob, `tunistart-synthese-${slug(projectName)}.pdf`)
}
