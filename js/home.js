/**
 * Home Page Logic
 * Manages slider, category filters, sorting, and product grid rendering.
 */

let currentCategory = 'all';
let sliderInterval = null;

/** Initializes all home page components. */
function initHomePage() {
  NavBuilder.build();
  buildCategoryList();
  buildSlider();
  renderProducts();

  document.getElementById('sort-select').addEventListener('change', renderProducts);
}

/** Builds category sidebar buttons with Font Awesome icons. */
function buildCategoryList() {
  const container = document.getElementById('category-list');
  const categories = ProductManager.getCategories();
  const labels = {
    all: '<i class="fa-solid fa-tags"></i> All',
    school: '<i class="fa-solid fa-book"></i> School',
    clothes: '<i class="fa-solid fa-shirt"></i> Clothes',
    makeup: '<i class="fa-solid fa-wand-magic-sparkles"></i> Makeup',
    phones: '<i class="fa-solid fa-mobile-screen"></i> Phones'
  };

  container.innerHTML = categories.map(cat =>
    `<button class="${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">${labels[cat]}</button>`
  ).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
  });
}

/** Sets up the hero slider with auto-play and dot navigation. */
function buildSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  /** Transitions to a specific slide index. */
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
  }

  sliderInterval = setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 4000);
}

/** Renders the product grid based on current filters and sort. */
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const sortBy = document.getElementById('sort-select').value;
  const products = ProductManager.filterProducts({ category: currentCategory, sortBy });

  if (products.length === 0) {
    grid.innerHTML = '<p style="padding:2rem;color:var(--text-light)">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-card-image ${ProductManager.getCategoryColor(product.category)}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p class="price">${product.price}$</p>
      </div>
      <div class="product-card-actions">
        <button class="btn btn-outline" onclick="event.stopPropagation(); window.location.href='product.html?id=${product.id}'">
          <i class="fa-solid fa-eye"></i> View
        </button>
        <button class="btn btn-accent" onclick="event.stopPropagation(); addToCartQuick(${product.id})">
          <i class="fa-solid fa-plus"></i> Cart
        </button>
      </div>
    </div>
  `).join('');
}

/** Adds a product to cart directly from the grid. */
function addToCartQuick(productId) {
  CartManager.addItem(productId, 1);
  Toast.show('Added to cart!', 'success');
}

document.addEventListener('DOMContentLoaded', initHomePage);
