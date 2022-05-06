/*

  Digital Confession

  by

  CHAN Man Hin (Chinny)

  Final Project for Course SM3809 Software Art Studio (Daniel HOWE),
  City University of Hong Kong,
  Semester B 2021-2022.

  This is a proof of concept only since database is not setup for this version
  
*/

// indicators for the states of the program
let confessing = false;
let searching = false;

let div1, div2; // corresponding div element for the states of the webpage

// text elements to display messages on the screen
let message = ""; // the code of the confession OR general message
let name = ""; // the name of the person confessing
let timeOfConfess = ""; // the time of the confession is made

// the unique code of a confession is designed to match a YouTube video ID
let sz = 11;
let characters =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ-_";
// try your luck with your confession ID on YouTube!

// time events inside the program
let currentTime, lastConfess, lastDisplay, lastSearch, lastLUpdate, lastGUpdate;

//array for listing global & lcoal confessions
let records;
let localCfs = [];
let noOfRecords;
let noOfLocal;

// for demo only
let testNames = [
  "Donald T.",
  "E. M.",
  "Joe Mama",
  "CHAN Man Hin",
  "Chinny CHAN",
  "Thomas CHAN",
  "Yami Yugi",
  "BEWD",
  "Stupid Name",
];
// end of for demo only

function preload() {
  records = loadJSON("https://c-mhin.github.io/SM3809/data.json");
}

function setup() {
  noCanvas(); // no canvas is needed for the webpage
  currentTime = 0;
  lastConfess = currentTime;
  lastDisplay = currentTime;
  lastLUpdate = currentTime;
  lastGUpdate = currentTime;
  div1 = document.getElementById("confesses");
  div2 = document.getElementById("searches");
  noOfRecords = records.data.length;
  noOfLocal = localCfs.length;
}

function draw() {
  currentTime = millis(); // update the runtime of webpage for time events

  let span; // display message depends on state of webpage

  if (confessing) {
    // for confessing
    span = document.getElementById("main");
    span.innerText = `${name} 
                      ${message}
                      ${timeOfConfess}`;

    if (currentTime - lastConfess >= 7000) {
      // change back to default confessing state after 7s
      confessing = !confessing;
      span.innerText = "Please Confess";
    }
  }

  if (searching) {
    // for searching arecord(s)
    span = document.getElementById("main");
    span.innerText = `${name}
                      ${timeOfConfess}
                      ${message}`;

    if (currentTime - lastSearch >= 7000) {
      // change back to default searching state after 7s
      searching = !searching;
      span.innerText = "Enter a NAME or a CODE to Search";
    }
  }

  // update local list if there are changes
  if (localCfs.length > noOfLocal) {
    displayYours(); // display local list on the rightbox
    noOfLocal = localCfs.length;
  }

  // update global list if there are changes
  if (records.data.length >= 7) {
    if (records.data.length > noOfRecords) {
      displayLatest();
      noOfRecords = records.data.length;
    }
  }
  // for demo only
  testLastest();
  // end of for demo only

}

function confess() {
  // a function to generate a record to the global list/database
  if (searching) {
    searching = !searching;
  }

  if (!confessing) {
    // initialize all text elements
    name = "";
    message = "";
    timeOfConfess = "";

    let temp1 = document.getElementById("input").value;
    let temp2 = document.getElementById("name").value;

    if (checkVaildConfession(temp1)) {
      // check if there is any input in confession; if yes, confession proceeds
      let code = createCode(); // create a unique code for the confession
      message = code;
      if (temp2 === "") {
        name = "Anonymous #" + message; // if there is no name, the name for that confession will be "Anonymous #(generated code)"
      } else {
        name = temp2;
      }
      timeOfConfess = Date();
      records.data.push({ name: name, code: message, date: timeOfConfess }); // create a new record to the database
      addToYours(name, message); // add a new record to local list;
      confessing = true; // change state to confessing so the messages can be displayed
      lastConfess = currentTime; // update time event for confessing state;
    }

    // initialize inputs in the webpage
    document.getElementById("input").value = "";
    document.getElementById("name").value = "";
  }
}

function search() {
  // a function to search a record in the global list/database
  if (confessing) {
    confessing = !confessing;
  }
  if (!searching) {
    // initialize all text elements
    name = "";
    message = "";
    timeOfConfess = "";

    let temp1 = document.getElementById("sname").value;
    let temp2 = document.getElementById("scode").value;

    if (checkExistingName(temp1) && checkExistingCode(temp2)) { // using both name & code to search
      name = temp1;
      message = temp2;
      timeOfConfess = findDate(message);// if both name & code exist, we only need to find the date of the confession
      
    } else if (checkExistingName(temp1)) { // using a name to search
      name = temp1;
      let codes = findCode(name);
      
      if (codes.length > 1) { // for when there are multiple records 
        
        let text = codes.join(" ");
        message = text;
        timeOfConfess = "Multiple Records Found"; // will not display date for multiple records
        
      } else { // for when there is only one records 
        
        message = codes[0];
        timeOfConfess = findDate(message);
      }
    } else if (checkExistingCode(temp2)) { // using a code to search
      
      message = temp2;
      name = findName(message);
      timeOfConfess = findDate(message);
      
    } else {
      message = "No Result";
    }
    
    // initialize inputs in the webpage  
    document.getElementById("sname").value = "";
    document.getElementById("scode").value = "";
    
    searching = true; // change state to searching so the messages can be displayed
    lastSearch = currentTime; // update time event for searching state;
  }
}

function toConfess() { // function for changing to confession
  if (window.getComputedStyle(searches).display === "block") {
    div2.style.display = "none";
  }
  div1.style.display = "block";
  let span = document.getElementById("main");
  span.innerText = "Please Confess";
}

function toSearch() { // function for changing to search
  if (window.getComputedStyle(confesses).display === "block") {
    div1.style.display = "none";
  }
  div2.style.display = "block";
  
  let span = document.getElementById("main");
  span.innerText = "Enter a NAME or a CODE to Search";
}

function checkVaildConfession(input) { // check if the cofession input is valid
  
  if (input === "" || input.length <= 0) { // no valid when input is nothing OR input's length is less than or equal to 0
    return false;
  } else {
    return true;
  }
}

function createCode() {
  // generate a new code when a confession is being made
  let temp = "";
  for (let i = 0; i < sz; i++) {
    temp += random(Array.from(characters));
  }
  if (!checkVaildCode(temp)) {
    // function for checking if the code is vaild
    //console.log("DUPED");
    temp = createCode(); // recursion when the new generated code has already exist
  }
  return temp;
}

function checkVaildCode(input) {
  // check if the code is valid
  let error = 0;
  records.data.forEach((c) => {
    if (input === c.code || input === "") {
      // code is not valid when it is on the database
      error++;
    }
  });
  if (error > 0 || input.length != sz) {
    // code is not valid when its length != 11
    return false;
  } else {
    return true;
  }
}

function findName(code) {  // function for searching record(s) using code

  let name = "";
  records.data.forEach((c, i) => {
    if (code === c.code) {
      name = c.name;
    }
  });
  return name;
}

function findCode(name) {  // function for searching record(s) using name

  let code = [];
  records.data.forEach((c, i) => {
    if (name === c.name) {
      code.push(c.code);
    }
  });
  return code; // return an array since a name can have multiple records
}

function findDate(code) {   // function for searching date using code since a code is the only unique elements for a record
  let date = "";
  records.data.forEach((c, i) => {
    if (code === c.code) {
      date = c.date;
    }
  });
  return date;
}
function checkExistingName(input) {   // check if the name exists when searching record(s) using name

  let matching = 0;
  records.data.forEach((c, i) => {
    if (input === c.name) {
      matching++;
    }
  });
  if (matching > 0) {
    return true;
  } else {
    return false;
  }
}

function checkExistingCode(input) {  // check if the code exists when searching record(s) using code

  let matching = 0;
  records.data.forEach((c, i) => {
    if (input === c.code) {
      matching++;
    }
  });
  if (matching > 0) {
    return true;
  } else {
    return false;
  }
}

function addToYours(yname, ycode) { // function for adding a record to the local list
  localCfs.push({ name: yname, code: ycode });
}

function displayYours() { // function to display the local list
  let yoursList = document.getElementById("yours");
  let temp = "";
  if (localCfs.length < 7) {
    for (let i = localCfs.length - 1; i >= 0; i--) {
      temp += `${localCfs[i].name}
               ${localCfs[i].code}

            `;
    }
  } else {
    for (let i = localCfs.length - 1; i >= localCfs.length - 7; i--) {
      temp += `${localCfs[i].name}
               ${localCfs[i].code}

            `;
    }
  }
  yoursList.innerText = temp;
}

function displayLatest() { // function to display the global list
  let latestList = document.getElementById("latest");
  let temp = "";

  for (let i = records.data.length - 1; i >= records.data.length - 7; i--) {
    temp += `${records.data[i].name}
             ${records.data[i].code}

            `;
  }
  latestList.innerText = temp;
}

// for demo only
function testLastest() {
  let testEvent = random();
  if (testEvent > 0.99) {
    let testCode = createCode();
    let testName = "Anonymous #" + testCode;
    testEvent = random();
    if (testEvent > 0.9) {
      testName = testNames[floor(random(0, testNames.length))];
    }
    let testDate = Date();
    records.data.push({ name: testName, code: testCode, date: testDate });
  }
}
// end of for demo only
