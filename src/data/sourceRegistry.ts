import type { SourceRecord } from '../domain/types'

export const REPORT_TITLE = 'La digitalisation du processus de constitution d’une société en Tunisie'

/** Content version — bump when the data layer is reviewed and redeployed. */
export const CONTENT_VERSION = '1.0.0'

export const sources: SourceRecord[] = [
  {
    id: 'report',
    title: { fr: `Rapport « ${REPORT_TITLE} »`, en: `Report “${REPORT_TITLE}”`, ar: 'تقرير « رقمنة مسار تأسيس شركة في تونس »' },
    description: {
      fr: 'Source principale du contenu. Les données juridiques qui en sont issues restent à vérifier.',
      en: 'Primary content source. Legal data derived from it still needs verification.',
      ar: 'المصدر الرئيسي للمحتوى. البيانات القانونية المستخرجة منه تبقى بحاجة إلى تحقق.',
    },
  },
  {
    id: 'rne',
    title: { fr: 'Registre National des Entreprises', en: 'National Business Register', ar: 'السجل الوطني للمؤسسات' },
    url: 'https://www.registre-entreprises.tn',
    description: { fr: 'Site cité dans le rapport.', en: 'Website cited in the report.', ar: 'موقع مذكور في التقرير.' },
  },
  {
    id: 'apii',
    title: { fr: 'APII — Guichet unique', en: 'APII — One-stop shop', ar: 'وكالة النهوض بالصناعة — الشباك الموحد' },
    url: 'https://www.tunisieindustrie.nat.tn/fr/doc.asp?mcat=16&mrub=186&msrub=269',
    description: { fr: 'Page citée dans le rapport.', en: 'Page cited in the report.', ar: 'صفحة مذكورة في التقرير.' },
  },
  {
    id: 'cnss',
    title: { fr: 'CNSS', en: 'CNSS', ar: 'الصندوق الوطني للضمان الاجتماعي' },
    url: 'https://www.cnss.tn',
    description: { fr: 'Site cité dans le rapport.', en: 'Website cited in the report.', ar: 'موقع مذكور في التقرير.' },
  },
]
