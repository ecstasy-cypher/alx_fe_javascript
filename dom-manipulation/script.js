const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Inspiration" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Inspiration" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Inspiration" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Inspiration" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}" - ${randomQuote.author} (${randomQuote.category})</blockquote>`;
}

newQuoteBtn.addEventListener('click', showRandomQuote);

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      author: "Anonymous", // You can allow users to enter author if needed
      category: newQuoteCategory
    };

    quotes.push(newQuote);
    showRandomQuote(); // Display the newly added quote

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Initial quote display
showRandomQuote();