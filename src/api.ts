import { JSDOM } from "jsdom"

import type { constructSearchURLParams, Entry } from "~types"

import Selector from "./models/Selectors.js"

export async function fetchConfig(): Promise<any> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/obsfx/libgen-downloader/configuration/config.json"
    )
    const json = await response.json()
    const conf = json as Record<string, unknown>

    return {
      latestVersion: (conf["latest_version"] as string) || "",
      mirrors: (conf["mirrors"] as string[]) || [],
      searchReqPattern: (conf["searchReqPattern"] as string) || "",
      searchByMD5Pattern: (conf["searchByMD5Pattern"] as string) || "",
      MD5ReqPattern: (conf["MD5ReqPattern"] as string) || "",
      columnFilterQueryParamKey:
        (conf["columnFilterQueryParamKey"] as string) || "",
      columnFilterQueryParamValues:
        (conf["columnFilterQueryParamValues"] as Record<string, string>) || {}
    }
  } catch (e) {
    throw new Error("Error occured while fetching configuration.")
  }
}

export async function findMirror(
  mirrors: string[],
  onMirrorFail: (failedMirror: string) => void
): Promise<string | null> {
  for (let i = 0; i < mirrors.length; i++) {
    const mirror = mirrors[i]
    try {
      await fetch(mirror)
      return mirror
    } catch (e) {
      onMirrorFail(mirror)
    }
  }
  return null
}

export function constructSearchURL({
  query,
  pageNumber,
  pageSize,
  mirror,
  searchReqPattern,
  columnFilterQueryParamKey,
  columnFilterQueryParamValue
}: constructSearchURLParams): string {
  let url = searchReqPattern
    .replace("{mirror}", mirror)
    .replace("{query}", query.trim().replace(/ /g, "+"))
    .replace("{pageNumber}", pageNumber.toString())
    .replace("{pageSize}", pageSize.toString())

  if (columnFilterQueryParamValue) {
    url += `&${columnFilterQueryParamKey}=${columnFilterQueryParamValue}`
  }

  return url
}

export async function getDocument(searchURL: string): Promise<Document> {
  try {
    const response = await fetch(searchURL)
    const htmlString = await response.text()

    return new JSDOM(htmlString).window.document
  } catch (e) {
    throw new Error(`Error occured while fetching document of ${searchURL}`)
  }
}

export function parseEntries(
  document: Document,
  throwError?: (message: string) => void
): Entry[] | undefined {
  const entries: Entry[] = []
  const containerTable = document.querySelector<HTMLTableElement>(
    Selector.TABLE_CONTAINER_SELECTOR
  )

  if (!containerTable) {
    if (throwError) {
      throwError("containerTable is undefined")
    }
    return
  }

  // Get rid of table header by slicing it
  const entryElements = Array.from(containerTable.children).slice(1)

  for (let i = 0; i < entryElements.length; i++) {
    const element = entryElements[i]

    const id = element.children[0]?.textContent || ""
    const authors = element.children[1]?.textContent || ""
    const title = element.children[2]?.textContent || ""
    const publisher = element.children[3]?.textContent || ""
    const year = element.children[4]?.textContent || ""
    const pages = element.children[5]?.textContent || ""
    const language = element.children[6]?.textContent || ""
    const size = element.children[7]?.textContent || ""
    const extension = element.children[8]?.textContent || ""
    const mirror = element.children[9]?.children[0]?.getAttribute("href") || ""

    entries.push({
      id,
      authors,
      title,
      publisher,
      year,
      pages,
      language,
      size,
      extension,
      mirror
    })
  }

  return entries
}
