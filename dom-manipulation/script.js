const STORAGE_KEY = 'quotes'; // Key for local storage

const quotes = loadQuotesFromLocalStorage(); // Load quotes on initialization

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const importFile = document.getElementById('importFile');

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}" - ${randomQuote.author} (${randomQuote.category})</blockquote>`;

  // Update session storage with the last viewed quote (optional)
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      author: "Anonymous",
      category: newQuoteCategory
    };

    quotes.push(newQuote);
    showRandomQuote();
    saveQuotes(); // Save quotes to local storage

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  return storedQuotes ? JSON.parse(storedQuotes) : [];
}

function exportQuotesToJson() {
  const jsonData = JSON.stringify(quotes);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(downloadUrl); // Cleanup
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

newQuoteBtn.addEventListener('click', showRandomQuote);

// Call createAddQuoteForm to add the form to the page
createAddQuoteForm();

// Load the last viewed quote from session storage (optional)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
  quoteDisplay.innerHTML = `<blockquote>"${JSON.parse(lastViewedQuote).text}" - ${JSON.parse(lastViewedQuote).author} (${JSON.parse(lastViewedQuote).category})</blockquote>`;
} else {
  showRandomQuote(); // Display a random quote if no last viewed quote
}

// Event listener for import file
importFile.addEventListener('change', importFromJsonFile);