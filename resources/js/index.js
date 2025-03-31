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
const worksheetDiv = document.getElementById("worksheet");

// ====================================================
// GENERATE PROBLEMS
// ====================================================
function generateProblems() {
  const problemsPerPage = parseInt(problemsPerPageInput.value);
  const numPages = parseInt(numPagesInput.value);
  const minNumber = parseInt(minNumberInput.value);
  const maxNumber = parseInt(maxNumberInput.value);
  const operation = operationSelect.value;

  let allProblems = [];

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

  renderProblems(allProblems);
}

// ====================================================
// RENDER PROBLEMS WITH DYNAMIC GRID LAYOUT
// ====================================================
function renderProblems(allProblems) {
    worksheetDiv.innerHTML = "";
  
    const problemsPerPage = parseInt(problemsPerPageInput.value);
    const numRows = Math.ceil(Math.sqrt(problemsPerPage)); // Square root for balanced grid
    const numCols = Math.ceil(problemsPerPage / numRows); // Columns based on rows
  
    // Set dynamic grid template
    worksheetDiv.style.display = "grid";
    worksheetDiv.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    worksheetDiv.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    worksheetDiv.style.gap = "1rem"; // Maintain consistent spacing
  
    allProblems.forEach((problems) => {
      problems.forEach((problem) => {
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
  
        // Add problem to the dynamically generated grid
        worksheetDiv.appendChild(problemContainerDiv);
      });
    });
  
    // Enable the download button after generating
    downloadButton.disabled = false;
    downloadButton.classList.add("enabled");
}

// ====================================================
// DOWNLOAD PDF FUNCTION
// ====================================================
async function downloadPDF() {
  const input = document.getElementById("worksheet");
  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("math-worksheet.pdf");
}

// ====================================================
// EVENT LISTENERS
// ====================================================
generateButton.addEventListener("click", generateProblems);
downloadButton.addEventListener("click", downloadPDF);

// ====================================================
// AUTO-GENERATE ON PAGE LOAD
// ====================================================
window.onload = () => {
    generateProblems();
};