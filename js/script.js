// TMDB API Configuration
const API_KEY = '39eeeb8954057e8ebe007dba5672b740'; // Replace with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Language mapping for TMDB
const LANGUAGE_MAP = {
    'telugu': 'te',
    'tamil': 'ta',
    'hindi': 'hi',
    'english': 'en',
    'malayalam': 'ml',
    'kannada': 'kn',
    'marathi': 'mr',
    'bengali': 'bn',
    'gujarati': 'gu',
    'punjabi': 'pa',
    'urdu': 'ur'
};

// Genre mapping
const GENRE_MAP = {
    'action': 28,
    'adventure': 12,
    'animation': 16,
    'comedy': 35,
    'crime': 80,
    'documentary': 99,
    'drama': 18,
    'family': 10751,
    'fantasy': 14,
    'history': 36,
    'horror': 27,
    'music': 10402,
    'mystery': 9648,
    'romance': 10749,
    'science fiction': 878,
    'thriller': 53,
    'war': 10752,
    'western': 37
};

// Current theme
let currentTheme = 'dark';

// Initialize the app
function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Check if API key is set
    if (API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        addBotMessage('⚠️ Please set your TMDB API key in the code to use this chatbot. You can get a free API key from https://www.themoviedb.org/settings/api');
    }
}

// Theme functions
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Message handling
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendQuickMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process the message
    processMessage(message);
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    hideTypingIndicator();
    
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'block';
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// Message processing
async function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    try {
        // Extract language and genre from message
        const language = extractLanguage(lowerMessage);
        const genre = extractGenre(lowerMessage);
        
        // Search for movies
        const movies = await searchMovies(language, genre, lowerMessage);
        
        if (movies && movies.length > 0) {
            displayMovies(movies, language, genre);
        } else {
            addBotMessage('Sorry, I couldn\'t find any movies matching your request. Try asking for different genres or languages! 🎬');
        }
    } catch (error) {
        console.error('Error processing message:', error);
        addBotMessage('Sorry, I encountered an error while searching for movies. Please try again! 🔄');
    }
}

function extractLanguage(message) {
    for (const [lang, code] of Object.entries(LANGUAGE_MAP)) {
        if (message.includes(lang)) {
            return code;
        }
    }
    return null;
}

function extractGenre(message) {
    for (const [genre, id] of Object.entries(GENRE_MAP)) {
        if (message.includes(genre)) {
            return id;
        }
    }
    return null;
}

// TMDB API functions
async function searchMovies(language, genre, query) {
    if (API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        // Return mock data for demo
        return getMockMovies();
    }
    
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=1`;
    
    if (language) {
        url += `&with_original_language=${language}`;
    }
    
    if (genre) {
        url += `&with_genres=${genre}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results?.slice(0, 10) || [];
}

function getMockMovies() {
    return [
        {
            id: 1,
            title: 'RRR',
            original_title: 'RRR',
            overview: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
            poster_path: '/fake-poster-1.jpg',
            vote_average: 8.5,
            release_date: '2022-03-24',
            original_language: 'te'
        },
        {
            id: 2,
            title: 'Baahubali 2',
            original_title: 'बाहुबली 2: द कन्क्लूजन',
            overview: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers.',
            poster_path: '/fake-poster-2.jpg',
            vote_average: 8.2,
            release_date: '2017-04-28',
            original_language: 'te'
        }
    ];
}

// Display functions
function displayMovies(movies, language, genre) {
    const languageName = getLanguageName(language);
    const genreName = getGenreName(genre);
    
    let responseMessage = `Here are some great ${languageName ? languageName + ' ' : ''}${genreName ? genreName + ' ' : ''}movies I found for you! 🎬`;
    
    addBotMessage(responseMessage);
    
    // Create movie carousel
    const carousel = createMovieCarousel(movies);
    addBotMessage(carousel);
}

function createMovieCarousel(movies) {
    let carouselHTML = '<div class="movie-carousel">';
    
    movies.forEach(movie => {
        const posterUrl = movie.poster_path ? 
            `${IMAGE_BASE_URL}${movie.poster_path}` : 
            'https://via.placeholder.com/200x280?text=No+Poster';
        
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
        
        carouselHTML += `
            <div class="movie-card" onclick="showMovieDetails(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')">
                <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x280?text=No+Poster'">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-rating">
                        <span class="rating-star">⭐</span>
                        <span>${rating}</span>
                    </div>
                    <div class="movie-year">${year}</div>
                </div>
            </div>
        `;
    });
    
    carouselHTML += '</div>';
    return carouselHTML;
}

function showMovieDetails(movieId, movieTitle) {
    addBotMessage(`You clicked on "${movieTitle}"! 🎬 Would you like more information about this movie or similar recommendations?`);
}

// Helper functions
function getLanguageName(languageCode) {
    const reverseMap = Object.fromEntries(Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k]));
    return reverseMap[languageCode] ? reverseMap[languageCode].charAt(0).toUpperCase() + reverseMap[languageCode].slice(1) : '';
}

function getGenreName(genreId) {
    const reverseMap = Object.fromEntries(Object.entries(GENRE_MAP).map(([k, v]) => [v, k]));
    return reverseMap[genreId] ? reverseMap[genreId].charAt(0).toUpperCase() + reverseMap[genreId].slice(1) : '';
}

// Initialize the app when the page loads
window.addEventListener('load', init);