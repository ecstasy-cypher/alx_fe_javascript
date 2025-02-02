const STORAGE_KEY = 'quotes';
const LAST_FILTER_KEY = 'lastCategoryFilter';
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

let quotes = loadQuotesFromLocalStorage(); 
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const importFile = document.getElementById('importFile');
const syncButton = document.getElementById('syncButton');

function showRandomQuote(categoryFilter) {
  let filteredQuotes = quotes;

  if (categoryFilter !== "all") {
    filteredQuotes = quotes.filter(quote => quote.category === categoryFilter);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
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
    showRandomQuote(categoryFilter.value); 
    saveQuotes(); 
    populateCategories(); 
  }

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
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

  URL.revokeObjectURL(downloadUrl);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories(); 
    showRandomQuote(categoryFilter.value); 
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const uniqueCategories = new Set(quotes.map(quote => quote.category)); 
  uniqueCategories.add("all"); 

  categoryFilter.innerHTML = ""; 

  uniqueCategories.forEach(category => {
    const option = document.createElement('option'); 
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option); 
  });

  const lastFilter = localStorage.getItem(LAST_FILTER_KEY);
  if (lastFilter) {
    categoryFilter.value = lastFilter; 
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(LAST_FILTER_KEY, selectedCategory); 
  showRandomQuote(selectedCategory);
}

async function fetchQuotesFromServer() { 
  try {
    const response = await fetch(API_URL);
    const serverData = await response.json(); 
    return serverData.map(serverItem => ({ 
      text: serverItem.title, 
      author: 'Server', 
      category: 'Server' 
    })); 
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return []; // Return an empty array on error
  }
}

async function syncData() { 
  try {
    const serverQuotes = await fetchQuotesFromServer(); 
    quotes = [...new Set([...quotes, ...serverQuotes])]; 
    saveQuotes();
    populateCategories();
    showRandomQuote(categoryFilter.value); 

    alert('Data synced successfully from server.');
  } catch (error) {
    console.error('Error syncing data:', error);
    alert('Failed to sync data from server.');
  }
}

syncButton.addEventListener('click', syncData); 

// Periodically check for updates (e.g., every 5 minutes)
setInterval(syncData, 5 * 60 * 1000); 

// Load quotes and populate categories on initialization
loadQuotesFromLocalStorage();
populateCategories();

// Load the last viewed quote from session storage (optional)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
  quoteDisplay.innerHTML = `<blockquote>"${JSON.parse(lastViewedQuote).text}" - ${JSON.parse(lastViewedQuote).author} (${JSON.parse(lastViewedQuote).category})</blockquote>`;
} else {
  showRandomQuote(categoryFilter.value); 
}

importFile.addEventListener('change', importFromJsonFile);