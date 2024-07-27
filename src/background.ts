import libgen from "libgen"

export {}

const baseUrls = [
  {
    baseUrl: "http://gen.lib.rus.ec",
    canDownloadDirect: false
  },
  {
    baseUrl: "http://libgen.is",
    // if true, '/get.php?md5=' works
    canDownloadDirect: true
  }
]
const options = {
  mirror: "http://gen.lib.rus.ec",
  query: "cats",
  count: 5,
  sort_by: "year",
  reverse: true
}

try {
  const data = await libgen.search(options)
  let n = data.length
  console.log(`${n} results for "${options.query}"`)
  while (n--) {
    console.log("")
    console.log("Title: " + data[n].title)
    console.log("Author: " + data[n].author)
    console.log(
      "Download: " +
        "http://gen.lib.rus.ec/book/index.php?md5=" +
        data[n].md5.toLowerCase()
    )
  }
} catch (err) {
  console.error(err)
}

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  console.log(sender)
})
