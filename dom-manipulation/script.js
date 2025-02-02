const STORAGE_KEY = 'quotes';
const LAST_FILTER_KEY = 'lastCategoryFilter';

const quotes = loadQuotesFromLocalStorage(); 
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const importFile = document.getElementById('importFile');

function showRandomQuote(categoryFilter) {
  let filteredQuotes = quotes;

  if (categoryFilter !== "all") {
    filteredQuotes = quotes.filter(quote => quote.category === categoryFilter);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}" - ${randomQuote.author} (${randomQuote.category})</blockquote>`;

  // Update session storage with the last viewed quote
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