import { Builder, Browser, By, Key, until } from "selenium-webdriver";
// const fs = require("fs");
import fs from "fs";

async function scrapeMedicine_AtoZ() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://www.nhs.uk/medicines/");

    // waiting for the search result to load and locate for specific element
    await driver.wait(until.elementsLocated(By.css(".nhsuk-list")), 5000);

    await driver.findElement(By.css(".nhsuk-list"));

    // space between class names indicated descendant relationships while joining classnames with period withoust space indicates that all those classes are present on same element
    const links = await driver.findElements(
      By.css(".nhsuk-card__content.nhsuk-card__content--feature ul li a")
    );

    // console.log(links);

    const hrefs = [];
    for (const link of links) {
      const href = await link.getAttribute("href");
      hrefs.push(href);
    }

    // writing all the links to the file
    // joining the array elements with a newline charcter
    fs.writeFile("Medicines_A-Z.txt", hrefs.join("\n"), "utf8", (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("File has been written successfully");
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function scrapeEachMedicineLink() {
  let driver;
  let links = [];
  let internalLinks;
  try {
    driver = await new Builder().forBrowser("chrome").build();

    // using promises for better async file handling operations

    // first read the each medicine link
    const data = await fs.promises.readFile("Medicines_A-Z.txt", "utf8");
    links = data.toString().split("\n");


    // then scrape internal links of each medicine
    for (let i = 0; i < links.length; i++) {

      await driver.get(links[i]);
      
      // Extract medicine name from URL for better organization
      const medicineName = links[i].split('/').filter(Boolean).pop();

      try{
        await driver.wait(
          until.elementLocated(By.css(".nhsuk-hub-key-links.beta-hub-key-links")),
          5000
        );
  
        internalLinks = await driver.findElements(
          By.css(".nhsuk-hub-key-links.beta-hub-key-links li a")
        );
      } catch(err){
        console.log(err);
        continue;
      }


      const hrefs = [];
      for (let link of internalLinks) {
        let href = await link.getAttribute("href");
        hrefs.push(href);
      }

      try {
        const separator = `\n---------- MEDICINE: ${medicineName} ----------\n`;
        fs.promises.appendFile(
          "Each-Med-Detail.txt",separator + 
          hrefs.join("\n") + "\n",
          "utf8"
        );
      } catch (err) {
        // adding all the medicines with no internal links to a separate file for further scraping
        console.log(err);
        await fs.promises.appendFile(
          "problematic-links.txt",
          `${links[i]} + \n`,
          "utf8"
        );
      }

      // Add a delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function medDetail(){
  let driver;
  let result = [];
  let medicine_data;
  try{
    driver = await new Builder().forBrowser("chrome").build();

    const data = await fs.promises.readFile("Each-Med-Detail.txt", "utf8");
    let array = data.toString().split("\n");
    
    // creating a format to store final data
    for( let i = 0; i < array.length; i++){
      const line = array[i].trim();

      if(line.startsWith("---------- MEDICINE:")){
        //extract medicine name
        const medName = line.replace('---------- MEDICINE:', '').replace('----------', '').trim();

        medicine_data = {
          medname: medName,
          urls: [],
          details: {} 
        };

        result.push(medicine_data);
      }
      else if(line.startsWith("https://") && medicine_data){
        medicine_data.urls.push(line);
      }
    }

    for(let i = 0; i < result.length; i++){
      const medicine = result[i];

      //processing each url of this medicine
      for(let j = 0; j < medicine.urls.length; j++){
        const url = medicine.urls[j];

        driver.get(url);

        await driver.wait(until.elementsLocated(By.css("article")), 5000);
        
        const sections = await driver.findElements(By.css("article .nhsuk-grid-column-two-thirds section"));

        let content = "";

        //scraping the data and adding it to content
        for(const section of sections) {
          // Extract headings
          const headings = await section.findElements(By.css("h1, h2, h3"));
          for(const heading of headings) {
            const text = await heading.getText();
            content += text.trim() + '\n';
          }
          
          // Extract paragraphs
          const paragraphs = await section.findElements(By.css("p"));
          for(const paragraph of paragraphs) {
            const text = await paragraph.getText();
            content += text.trim() + '\n';
          }
          
          // Extract lists
          const lists = await section.findElements(By.css("ul, ol"));
          for(const list of lists) {
            const items = await list.findElements(By.css("li"));
            for(const item of items) {
              const text = await item.getText();
              content += '- ' + text.trim() + '\n';
            }
          }
          
          content += '\n'; // Add space between sections
        }


         // Parse the URL to get the category
        const urlParts = url.split('/');
        const category = urlParts[urlParts.length - 2]; // Gets the part before the last slash 
        
        // Add to the medicine's details object
        medicine.details[category] = content.trim();
      }
    }

    // 2 refers to indentation for readability
    // When null is passed as the second argument, it means that all properties of the object are included in the resulting JSON string without any modifications 
    await fs.promises.writeFile("MedData.json", JSON.stringify(result, null ,2));

    console.log("Processing complete!");

  }catch(err){
    console.log(err);
  } finally{
    if(driver){
      await driver.quit();
    }
  }
}

// total unique medicines scraped = 252 
// total medicines with timeout errors(pages have different format) = 45
// common questions about each medicine - not scraped (maybe different css structure)

