document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));

  if (!productId) {
    alert('Product not found.');
    return;
  }

  fetch('./json files/store.json')
    .then(response => response.json())
    .then(data => {
      const product = data.products.find(p => p.id === productId);
      if (product) {
        displayProductDetails(product);
        displayReviews(productId);
        initReviewForm(productId);
      } else {
        alert('Product not found.');
      }
    })
    .catch(error => console.error('Error fetching product data:', error));
});

function displayProductDetails(product) {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-image" style="background-image: url('${product.image}')"></div>
      <div class="product-detail-info">
        <h1>${product.title}</h1>
        <p class="product-detail-price">NRP. ${product.price.toFixed(2)}</p>
        <div class="product-detail-colors">
          ${product.colours.map(color => `<span class="color-option color-display" style="background-color: ${color};" data-color="${color}"></span>`).join('')}
        </div>
        <p class="product-detail-description">${product.description || 'No description available.'}</p>
      </div>
    </div>
  `;
}

function displayReviews(productId) {
  const reviewsContainer = document.getElementById('reviews-container');
  if (!reviewsContainer) return;

  const reviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
  reviewsContainer.innerHTML = reviews.map(review => `
    <div class="review">
      <div class="review-stars">${generateStars(review.rating)}</div>
      <p>${review.text}</p>
    </div>
  `).join('');
}

function initReviewForm(productId) {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const rating = parseInt(form.querySelector('input[name="rating"]:checked').value);
    const text = form.querySelector('textarea[name="review"]').value;

    const reviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
    reviews.push({ rating, text });
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(reviews));

    displayReviews(productId);
    form.reset();
  });
}

function generateStars(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '<i class="fas fa-star fa-beat"></i>' : '<i class="far fa-star"></i>';
  }
  return stars;
}

const starRating = document.getElementById('star-rating');
        const stars = starRating.querySelectorAll('label i');

        starRating.addEventListener('click', (event) => {
          if (event.target.tagName === 'LABEL' || event.target.tagName === 'I') {
        const selectedValue = event.target.closest('label').getAttribute('data-value');
        stars.forEach((star, index) => {
          if (index < selectedValue) {
            star.classList.remove('far');
            star.classList.add('fas');
          } else {
            star.classList.remove('fas');
            star.classList.add('far');
          }
        });
          }
        });
