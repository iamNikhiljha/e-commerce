
async function fetchData(searchQuery = '') {
  try {
    const url = `https://dummyjson.com/products/search?q=${searchQuery}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

async function getProductsByCategory(category) {
  try {
    const url = `https://dummyjson.com/products/category/${category}`;
    const response = await fetch(url);
    const data = await response.json();
    const products = data.products;
    createProductCards(products);
  } catch (error) {
    console.log('Error:', error);
  }
}


async function fetchCategories() {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    // const categories = data|| [];
    // console.log('API Response:', data);
    return data;
  } catch (error) {
    console.log('Error:', error);
    return [];
  }

}



function createProductCards(products) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    // console.log('Processing product:', product.title);

    const mainImage = document.createElement('img');
    mainImage.src = mainImage.src = product.images[0];; // Use the product image URL from the API response
    mainImage.alt = product.title;
    card.appendChild(mainImage);

    const title = document.createElement('h3');
    title.classList.add('title');
    title.innerText = product.title;
    card.appendChild(title);

    const price = document.createElement('p');
    price.classList.add('price');
    price.innerText = `Price: $${product.price}`;
    card.appendChild(price);

    const thumbnailImage = document.createElement('img');
    thumbnailImage.classList.add('thumbnail');
    thumbnailImage.src = product.thumbnail; // Use the same product image URL for the thumbnail
    thumbnailImage.alt = product.title[0];
    card.appendChild(thumbnailImage);

    const rating = document.createElement('p');
    rating.classList.add('rating');
    rating.innerText = `Rating: ${product.rating}`;
    card.appendChild(rating);


    const showDescription = document.createElement('p');
    showDescription.classList.add('show-description');
    showDescription.innerText = 'Show Description';
    showDescription.addEventListener('click', () => {
      description.style.display = 'block';
    });
    card.appendChild(showDescription);

    const lessDescription = document.createElement('p');
    lessDescription.classList.add('less-description');
    lessDescription.innerText = 'Less Description';
    lessDescription.addEventListener('click', () => {
      description.style.display = 'none';
    });
    card.appendChild(lessDescription);

    const description = document.createElement('div');
    description.classList.add('description');
    description.innerText = product.description;
    card.appendChild(description);

    container.appendChild(card);
  });
}
//creating categories

function createCategoryRadios(categories) {
  const radioContainer = document.getElementById('categoryRadios');
  radioContainer.innerHTML = '';

  if (categories.length === 0) {
    return;
  }

  categories.forEach(category => {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'category';
    radioInput.value = category;
    radioInput.id = category;

    const radioLabel = document.createElement('label');
    radioLabel.htmlFor = category;
    radioLabel.innerText = category;

    radioContainer.appendChild(radioInput);
    radioContainer.appendChild(radioLabel);

    radioInput.addEventListener('change', (e) => {
      const category = e.target.value;
      getProductsByCategory(category);
    });
  });
}


function clearCategories() {
  const radioInputs = document.querySelectorAll('input[name="category"]');
  radioInputs.forEach(radio => {
    radio.checked = false;
  });

  fetchData().then(data => {
    const products = data.products;
    createProductCards(products);
  });
  // Clear the search input field
  const searchInput = document.getElementById('searchInput');
  searchInput.value = '';
}


function sortPriceLowToHigh() {
  const sortedProducts = products.sort((a, b) => a.price - b.price);
  createProductCards(sortedProducts);
}

function sortPriceHighToLow() {
  const sortedProducts = products.sort((a, b) => b.price - a.price);
  createProductCards(sortedProducts);
}

function sortRatingHighToLow() {
  const sortedProducts = products.sort((a, b) => b.rating - a.rating);
  createProductCards(sortedProducts);
}

function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();

  if (searchQuery !== '') {
    fetchData(searchQuery)
      .then(data => {
        const searchedProducts = data.products;
        createProductCards(searchedProducts);
      })
      .catch(error => console.log('Error:', error));
  }
}

 // Function to handle search when Enter key is pressed
 function handleSearchOnEnter(event) {
  if (event.key === 'Enter') {
    searchProducts();
  }
}

let products = [];
fetchData()
  .then(data => {
    products = data.products;
    createProductCards(products);
  })
  .catch(error => console.log('Error:', error));

//fetch cateogory
fetchCategories()
  .then(categories => {
    createCategoryRadios(categories);
  })
  .catch(error => console.log('Error:', error));

const categoryRadios = document.querySelectorAll('input[name="category"]');
categoryRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    const category = e.target.value;
    getProductsByCategory(category);
  });
});

function clearSearches() {
  // Clear the search input field
  const searchInput = document.getElementById('searchInput');
  searchInput.value = '';

  // Fetch all products again
  fetchData().then(data => {
    const products = data.products;
    createProductCards(products);
  });
}
document.addEventListener('DOMContentLoaded', () => {

  // ... Your existing JavaScript ...

  let selectedCategory = ''


  // Function to toggle the dropdown options
  function toggleDropdownOptions() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
  }

  // Variable to store the default text for the dropdown button
  const defaultDropdownText = 'Select Category';

  // Function to select a category from the dropdown
  function selectCategory(category) {
    const dropdownButton = document.getElementById('dropdownButton');
    dropdownButton.textContent = category;
    toggleDropdownOptions();

    // Update the selectedCategory variable
    selectedCategory = category;

    // Filter products by the selected category
    getProductsByCategory(category);
  }

  // Attach event listener to toggle the dropdown options
  document.getElementById('dropdownButton').addEventListener('click', toggleDropdownOptions);

  // Function to clear the selected category field
  function clearCategories() {
    const dropdownButton = document.getElementById('dropdownButton');

    // Reset the value of the dropdown button to the default text
    dropdownButton.textContent = defaultDropdownText;

    // Update the selectedCategory variable to an empty string
    selectedCategory = '';

    // Fetch all products again
    fetchData().then(data => {
      const products = data.products;
      createProductCards(products);
    });
  }

  // Fetch and create category radios (options) for the dropdown
  fetchCategories()
    .then(categories => {
      const dropdownOptions = document.getElementById('dropdownOptions');
      categories.forEach(category => {
        const option = document.createElement('li');
        option.textContent = category;
        option.addEventListener('click', () => selectCategory(category));
        dropdownOptions.appendChild(option);
      });

      // Add the event listener to the radio buttons
      const categoryRadios = document.querySelectorAll('input[name="category"]');
      categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          const category = e.target.value;
          getProductsByCategory(category);
        });
      });
    })
    .catch(error => console.log('Error:', error));



  document.getElementById('clearSearchesButton').addEventListener('click', clearSearches);
  document.getElementById('clearCategoriesButton').addEventListener('click', clearCategories);
  document.getElementById('sortPriceLowToHigh').addEventListener('click', () => sortPriceLowToHigh(products));
  document.getElementById('sortPriceHighToLow').addEventListener('click', () => sortPriceHighToLow(products));
  document.getElementById('sortRatingHighToLow').addEventListener('click', () => sortRatingHighToLow(products));
  document.getElementById('searchInput').addEventListener('keypress', handleSearchOnEnter);
  document.getElementById('searchButton').addEventListener('click', searchProducts);



});