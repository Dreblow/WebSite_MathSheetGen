// ====================================================
// GET REFERENCES TO INPUTS & BUTTONS
// ====================================================
const problemsPerPageInput = document.getElementById("problemsPerPage");
const numPagesInput = document.getElementById("numPages");
const minNumberInput = document.getElementById("minNumber");
const maxNumberInput = document.getElementById("maxNumber");
const operationSelect = document.getElementById("operation");
const generateButton = document.getElementById("generateButton");
const downloadButton = document.getElementById("downloadButton");

// References to worksheet sections
const headerDiv = document.querySelector(".worksheet-header");
const worksheetDiv = document.querySelector(".worksheet");
const problemsDiv = document.querySelector(".worksheet-problems");


// ====================================================
// RENDER HEADER FUNCTION
// ====================================================
function renderHeader(headerDiv) {
    // Clear previous content
    headerDiv.innerHTML = "";
  
    // Name section
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("header-item");
    nameDiv.innerHTML = `
      <label>Name:</label>
      <span class="name-line"></span>
    `;
  
    // Date section
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("header-item");
    dateDiv.innerHTML = `
      <label>Date:</label>
      <span class="date-line"></span>
    `;
  
    // Add name and date to header
    headerDiv.appendChild(nameDiv);
    headerDiv.appendChild(dateDiv);
  }

// ====================================================
// GENERATE PROBLEMS
// ====================================================
function generateProblems() {
  const MAX_PROBLEMS_PER_PAGE = 64;
  const numPages = parseInt(numPagesInput.value);
  const minNumber = parseInt(minNumberInput.value);
  const maxNumber = parseInt(maxNumberInput.value);
  const operation = operationSelect.value;

  var problemsPerPage = parseInt(problemsPerPageInput.value);

  let allProblems = [];

  // Clear worksheet-container in index.html
  const worksheetContainer = document.querySelector(".worksheet-container");
  const pagebreakContainer = document.querySelector(".worksheet-pagebreak-container");
  pagebreakContainer.innerHTML = "";

  // Check for max problems
  if (problemsPerPage > MAX_PROBLEMS_PER_PAGE) {
    problemsPerPage = MAX_PROBLEMS_PER_PAGE;
    problemsPerPageInput.value = MAX_PROBLEMS_PER_PAGE; // Updates the webpage input
  }

  for (let page = 0; page < numPages; page++) {
    let problems = [];

    for (let i = 0; i < problemsPerPage; i++) {
      const a = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      const b = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let problem = "";

      // Select operation based on dropdown
      switch (operation) {
        case "add":
          problem = `${a} + ${b} = ____`;
          break;
        case "subtract":
          const maxVal = Math.max(a, b);
          const minVal = Math.min(a, b);
          problem = `${maxVal} - ${minVal} = ____`;
          break;
        case "mixed":
          const isAddition = Math.random() > 0.5;
          if (isAddition) {
            problem = `${a} + ${b} = ____`;
          } else {
            const maxMixVal = Math.max(a, b);
            const minMixVal = Math.min(a, b);
            problem = `${maxMixVal} - ${minMixVal} = ____`;
          }
          break;
      }

      problems.push(problem);
    }

    allProblems.push(problems);
  }
  

  // For each page of problems, create a page div
  allProblems.forEach((problems) => {
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("worksheet", "page-break");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("worksheet-header");

    const problemsDiv = document.createElement("div");
    problemsDiv.classList.add("worksheet-problems");

    pageDiv.appendChild(headerDiv);
    pageDiv.appendChild(problemsDiv);

    pagebreakContainer.appendChild(pageDiv);

    renderHeader(headerDiv);
    renderProblems(problemsDiv, problems);
  });

    
  // Enable the download button after generating
  downloadButton.disabled = false;
  downloadButton.classList.add("enabled");
}

// ====================================================
// RENDER PROBLEMS FUNCTION
// ====================================================
function renderProblems(problemsDiv, allProblems) {
    problemsDiv.innerHTML = "";
  
    const problemsPerPage = parseInt(problemsPerPageInput.value);
    const numRows = Math.ceil(Math.sqrt(problemsPerPage)); // Square root for balanced grid
    const numCols = Math.ceil(problemsPerPage / numRows); // Columns based on rows
  
    // Set dynamic grid template
    problemsDiv.style.display = "grid";
    problemsDiv.style.gridTemplateColumns = `repeat(${numCols}, auto)`;
    problemsDiv.style.gridTemplateRows = `repeat(${numRows}, auto)`;
    problemsDiv.style.gap = "1rem"; // Maintain consistent spacing
  
    allProblems.forEach((problem) => {
      const problemContainerDiv = document.createElement("div");
      problemContainerDiv.classList.add("problem-container");

      const problemDiv = document.createElement("div");
      problemDiv.classList.add("problem");

      // Extract numbers and operator
      const match = problem.match(/(\d+)\s*([\+\-])\s*(\d+)/);
      if (match) {
        let num1 = match[1];
        const operator = match[2];
        let num2 = match[3];

        // Add non-breaking space for single digits to align properly
        if (num1.length === 1) {
          num1 = `&nbsp;&nbsp;${num1}`; // Add space to align single digits
        }
        if (num2.length === 1) {
          num2 = `&nbsp;&nbsp;${num2}`;
        }

        // Create the problem layout
        problemDiv.innerHTML = `
          <div class="top-number">${num1}</div>
          <div class="bottom-number">${operator} ${num2}</div>
          <div class="answer-line"></div>
        `;
      }

      // Add problem to the problem container
      problemContainerDiv.appendChild(problemDiv);
      problemsDiv.appendChild(problemContainerDiv);
    });
}

// ====================================================
// DOWNLOAD PDF FUNCTION
// ====================================================
async function downloadPDF() {
  const pages = document.querySelectorAll(".worksheet");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i]);
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (i > 0) {
      pdf.addPage(); // Add new page after first
    }

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString().replace(/\//g, "-");
  const formattedTime = now.toLocaleTimeString().replace(/:/g, "-");

  const fileName = `math-worksheet-${formattedDate}_${formattedTime}.pdf`;
  pdf.save(fileName);
}

// ====================================================
// EVENT LISTENERS
// ====================================================
generateButton.addEventListener("click", generateProblems);
downloadButton.addEventListener("click", downloadPDF);

// ====================================================
// AUTO-SELECT INPUT CONTENT ON CLICK
// ====================================================
const allInputs = document.querySelectorAll("input");

allInputs.forEach((input) => {
  input.addEventListener("click", (event) => {
    event.target.select();
  });
});

// ====================================================
// AUTO-GENERATE ON PAGE LOAD
// ====================================================
window.onload = () => {
    generateProblems();
};