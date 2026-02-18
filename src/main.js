import './style.css'

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkOverlay = document.querySelector('.dark-mode-overlay');
const lightOverlay = document.querySelector('.light-mode-overlay');
const starsContainer = document.getElementById('stars');

// Generate stars
function generateStars() {
  const numberOfStars = 100;
  starsContainer.innerHTML = '';
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star absolute w-[2px] h-[2px] bg-white rounded-full';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    starsContainer.appendChild(star);
  }
}

generateStars();

// Check for saved dark mode preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  body.classList.add('dark');
}

darkModeToggle.addEventListener('click', () => {
  const isDarkModeActive = body.classList.contains('dark');
  
  if (!isDarkModeActive) {
    // Switching to dark mode
    darkOverlay.classList.add('active');
    setTimeout(() => {
      body.classList.add('dark');
    }, 500);
    setTimeout(() => {
      darkOverlay.classList.remove('active');
    }, 1100);
  } else {
    // Switching to light mode
    lightOverlay.classList.add('active');
    setTimeout(() => {
      body.classList.remove('dark');
    }, 500);
    setTimeout(() => {
      lightOverlay.classList.remove('active');
    }, 1100);
  }
  
  localStorage.setItem('darkMode', !isDarkModeActive);
});
