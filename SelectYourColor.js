// JS File for SelectYourColor

// Select necessary DOM elements
const colorDisplay = document.querySelector('#color-display');
const bgHexCodeSpanElement = document.querySelector('#bg-hex-code');
const btn = document.querySelector('#click-btn');
const colorPicker = document.querySelector('#color-picker');
const favoritesList = document.querySelector('#favorites-list');
const favoriteBtn = document.querySelector('#favorite-btn');
let currentColor = '';

// Load favorites from local storage
function loadFavorites() {
  const savedFavorites = localStorage.getItem('favoriteColors');
  if (savedFavorites) {
    const favoriteColors = JSON.parse(savedFavorites);
    favoriteColors.forEach(color => addFavoriteColor(color, false));
  }
}

// Save favorites to local storage
function saveFavorites() {
  const favoriteColors = [];
  document.querySelectorAll('.favorite-item span').forEach(item => {
    favoriteColors.push(item.textContent);
  });
  localStorage.setItem('favoriteColors', JSON.stringify(favoriteColors));
}

// Function to generate a random hex color
function getRandomHexColor() {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
}

// Function to change the color of the display container
function changeContainerColor(color) {
  colorDisplay.style.backgroundColor = color;
  bgHexCodeSpanElement.textContent = `Hex Code: ${color}`;
  currentColor = color;
  favoriteBtn.classList.remove('active');
}

// Function to add a color to the favorites list
function addFavoriteColor(color, save = true) {
  if (!isColorInFavorites(color)) {
    // Create a new favorite item element
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    favoriteItem.setAttribute('draggable', true);

    // Create the color block element
    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = color;
    colorBlock.addEventListener('click', () => changeContainerColor(color));

    // Create the color hex text element
    const colorHex = document.createElement('span');
    colorHex.textContent = color;

    // Create the delete button element
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      favoritesList.removeChild(favoriteItem);
      saveFavorites();
    });

    // Append elements to the favorite item
    favoriteItem.appendChild(colorBlock);
    favoriteItem.appendChild(colorHex);
    favoriteItem.appendChild(deleteBtn);
    favoritesList.appendChild(favoriteItem);

    // Add event listeners for drag-and-drop functionality
    favoriteItem.addEventListener('dragstart', handleDragStart);
    favoriteItem.addEventListener('dragover', handleDragOver);
    favoriteItem.addEventListener('dragleave', handleDragLeave);
    favoriteItem.addEventListener('drop', handleDrop);
    favoriteItem.addEventListener('dragend', handleDragEnd);

    if (save) {
      saveFavorites();
    }
  }
}

// Function to check if a color is already in the favorites list
function isColorInFavorites(color) {
  const favoriteItems = document.querySelectorAll('.favorite-item span');
  for (let item of favoriteItems) {
    if (item.textContent === color) {
      return true;
    }
  }
  return false;
}

// Event handler for generating a random color when the button is clicked
btn.onclick = () => {
  const randomColor = getRandomHexColor();
  changeContainerColor(randomColor);
}

// Event handler for changing the color based on the color picker input
colorPicker.oninput = (event) => {
  const selectedColor = event.target.value;
  changeContainerColor(selectedColor);
}

// Event handler for adding the current color to the favorites list
favoriteBtn.onclick = () => {
  addFavoriteColor(currentColor);
  favoriteBtn.classList.add('active');
}

// Drag-and-drop functionality for favorites list
let draggingElement;

// Handle the start of dragging
function handleDragStart(event) {
  draggingElement = event.target;
  event.target.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
}

// Handle the drag over event
function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const targetElement = event.target.closest('.favorite-item');
  if (targetElement && targetElement !== draggingElement) {
    targetElement.classList.add('dragover');
  }
}

// Handle the drag leave event
function handleDragLeave(event) {
  const targetElement = event.target.closest('.favorite-item');
  if (targetElement) {
    targetElement.classList.remove('dragover');
  }
}

// Handle the drop event
function handleDrop(event) {
  event.preventDefault();
  const targetElement = event.target.closest('.favorite-item');
  if (targetElement && targetElement !== draggingElement) {
    targetElement.classList.remove('dragover');
    const bounding = targetElement.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2);
    const nextSibling = (event.clientY - offset > 0) ? targetElement.nextElementSibling : targetElement;
    favoritesList.insertBefore(draggingElement, nextSibling);
    saveFavorites();
  }
}

// Handle the end of dragging
function handleDragEnd(event) {
  event.target.classList.remove('dragging');
  const items = favoritesList.querySelectorAll('.favorite-item');
  items.forEach(item => item.classList.remove('dragover'));
}

// Apply drag-and-drop functionality to existing items (if any)
document.querySelectorAll('.favorite-item').forEach(item => {
  item.setAttribute('draggable', true);
  item.addEventListener('dragstart', handleDragStart);
  item.addEventListener('dragover', handleDragOver);
  item.addEventListener('dragleave', handleDragLeave);
  item.addEventListener('drop', handleDrop);
  item.addEventListener('dragend', handleDragEnd);
});

// Load favorites from local storage when the page loads
window.onload = loadFavorites;