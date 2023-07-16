const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

// Define the route for app-url/lotNumber
app.get('/:lotNumber', async (req, res) => {
  try {
    const lotNumber = req.params.lotNumber;

    const lotDetails = await getCapturedStrings(lotNumber);
    res.json(lotDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getCapturedStrings(lotNumber) {
  if (!lotNumber) {
    return ''; // Return empty string if no lot number is provided
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(`https://www.copart.com/public/data/lotdetails/solr/${lotNumber}`);
  const pageContent = await page.content();
  const startIndex = pageContent.indexOf('{');
  const endIndex = pageContent.lastIndexOf('}');
  const jsonString = pageContent.substring(startIndex, endIndex + 1);

  const data = JSON.parse(jsonString);
  const lotDetails = data.data.lotDetails;

  await browser.close();

  return lotDetails;
}

const port = 3000; // Change this to the desired port number
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
