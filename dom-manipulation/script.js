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
    quoteDisplay.textContent = "No quotes found in this category."; // Corrected line
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}" - ${randomQuote.author} (${randomQuote.category})</blockquote>`;

  // Update session storage with the last viewed quote (optional)
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// ... (rest of the code remains the same)