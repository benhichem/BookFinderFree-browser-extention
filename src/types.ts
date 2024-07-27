export interface constructSearchURLParams {
  query: string
  pageNumber: number
  pageSize: number
  mirror: string
  searchReqPattern: string
  columnFilterQueryParamKey: string
  columnFilterQueryParamValue: string | null
}
export interface Entry {
  id: string
  authors: string
  title: string
  publisher: string
  year: string
  pages: string
  language: string
  size: string
  extension: string
  mirror: string
  alternativeDirectDownloadUrl?: string
}
