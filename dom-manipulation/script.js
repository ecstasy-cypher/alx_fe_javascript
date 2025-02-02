const STORAGE_KEY = 'quotes';
const LAST_FILTER_KEY = 'lastCategoryFilter';
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint
  let quotes = loadQuotesFromLocalStorage(); 
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const importFile = document.getElementById('importFile');
const syncButton = document.getElementById('syncButton'); // Add a button for manual sync

function showRandomQuote(categoryFilter) {
  let filteredQuotes = quotes;

  if (categoryFilter !== "all") {
    filteredQuotes = quotes.filter(quote => quote.category === categoryFilter);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category."; // Corrected line
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}" - ${randomQuote.author} (${randomQuote.category})</blockquote>`;

  // Update session storage with the last viewed quote (optional)
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

function createAddQuoteForm() {
  // ... (same as before)
}

function addQuote() {
  // ... (same as before)

  saveQuotes(); 
  populateCategories(); 
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  return storedQuotes ? JSON.parse(storedQuotes) : [];
}

function exportQuotesToJson() {
  // ... (same as before)
}

function importFromJsonFile(event) {
  // ... (same as before)
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

  // Restore last selected filter
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
// ... (other functions: createAddQuoteForm, addQuote, saveQuotes, 
//       loadQuotesFromLocalStorage, exportQuotesToJson, importFromJsonFile, 
//       populateCategories, filterQuotes)

function syncData() {
  fetch(API_URL) 
    .then(response => response.json())
    .then(serverQuotes => {
      // Simple conflict resolution: Replace local quotes with server quotes
      quotes = serverQuotes.map(serverQuote => ({ 
        text: serverQuote.title, 
        author: 'Server', 
        category: 'Server' 
      })); 

      saveQuotes();
      populateCategories();
      showRandomQuote(categoryFilter.value); 

      // Display a success message
      alert('Data synced successfully from server.');
    })
    .catch(error => {
      console.error('Error syncing data:', error);
      alert('Failed to sync data from server.');
    });
}

syncButton.addEventListener('click', syncData); // Add event listener for manual sync

// Periodically check for updates (e.g., every 5 minutes)
setInterval(syncData, 5 * 60 * 1000); // 5 minutes in milliseconds


newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes); 
createAddQuoteForm();

// Load quotes and populate categories on initialization
loadQuotesFromLocalStorage();
populateCategories();

// Load the last viewed quote from session storage (optional)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
  quoteDisplay.innerHTML = `<blockquote>"${JSON.parse(lastViewedQuote).text}" - ${JSON.parse(lastViewedQuote).author} (${JSON.parse(lastViewedQuote).category})</blockquote>`;
} else {
  showRandomQuote(); 
}

importFile.addEventListener('change', importFromJsonFile);