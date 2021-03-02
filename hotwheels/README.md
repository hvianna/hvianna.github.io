# Searchable gallery using Google Sheets + Photos as a simple database

## Data spreadsheet

1. Open your Google Sheet and go to *File* > *Publish to the web*
1. Choose **Link**, select the sheet and the *CSV* option
1. Copy the generated link and use it on [Papa Parse](https://www.papaparse.com/docs#remote-files)

Based on the [Tabletop.js tutorial](https://github.com/jsoma/tabletop)

## Images

1. Images from Google Photos must be on a public album (shared by link)
1. Open an image and get its direct URL, it will be something like:
  `https://lh3.googleusercontent.com/pw/ACtC-3eFyDXi_sVW22DHH9OiRJwjp6fK6ovnWAHYW6DR9KWH7GFH8lpFBGuSw2vBRc_ubVmntcc6vlQF78NBr34wTzTY1VUckYPSFs2pB281FCf49bYnL-QH-Eg6230TPvdyjlFS9XCumI_oIRaftAMx8EMg=w1303-h977-no?authuser=0`
1. Image width and height can be adjusted by changing the values after the `=` sign at the end of the URL

## Search

The search function works directly on the DOM elements, by simply hiding the gallery items whose `innerText` (or specific `data-` attribute) don't match the search string.

