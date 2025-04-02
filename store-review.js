document.addEventListener("DOMContentLoaded", () => {
  const testimonialsSlider = document.getElementById("testimonials-slider");
  const reviewSidebar = document.createElement("div");
  reviewSidebar.id = "review-sidebar";
  reviewSidebar.className = "review-sidebar";
  reviewSidebar.innerHTML = `
    <div class="review-header">
      <h3>Full Review</h3>
      <button id="closeReviewSidebar"><i class="fas fa-times"></i></button>
    </div>
    <div id="review-content" class="review-content">
      <!-- Full review content will be displayed here -->
    </div>
  `;
  document.body.appendChild(reviewSidebar);

  const closeReviewSidebar = () => {
    reviewSidebar.classList.remove("open");
  };

  document.getElementById("closeReviewSidebar").addEventListener("click", closeReviewSidebar);

  // Function to generate star ratings
  function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star fa-beat"></i>';
    }

    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt fa-beat"></i>';
    }

    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  fetch("json files/store-review.json")
    .then((response) => response.json())
    .then((data) => {
      const reviews = data.reviews;

      if (reviews.length === 0) {
        testimonialsSlider.innerHTML = "<p class='no-reviews'>No reviews available.</p>";
        return;
      }

      testimonialsSlider.innerHTML = reviews
        .map((review, index) => {
          const isLong = review.quote.length > 100;
          const shortQuote = isLong ? review.quote.slice(0, 100) + "... <a href='#' class='read-more' data-index='" + index + "'>Read More</a>" : review.quote;
          return `
          <div class="testimonial" data-index="${index}" style="cursor: pointer;">
            <p class="quote">${shortQuote}</p>
            <p class="author">- ${review.author}</p>
            <p class="stars">${generateStars(review.stars)}</p>
          </div>
        `;
        })
        .join("");

      const openReviewSidebar = (index) => {
        const review = reviews[index]; // Safely access the review
        if (review) {
          document.getElementById("review-content").innerHTML = `
            <p class="author">- ${review.author}</p>
            <p class="stars">${generateStars(review.stars)}</p>
            <p>${review.quote}</p>
          `;
          reviewSidebar.classList.add("open");
        }
      };

      document.querySelectorAll(".read-more").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const index = parseInt(event.target.getAttribute("data-index"), 10); // Ensure index is parsed as an integer
          openReviewSidebar(index);
        });
      });

      document.querySelectorAll(".testimonial").forEach((testimonial) => {
        testimonial.addEventListener("click", (event) => {
          const index = parseInt(testimonial.getAttribute("data-index"), 10); // Ensure index is parsed as an integer
          openReviewSidebar(index);
        });
      });
    })
    .catch((error) => {
      console.error("Error loading reviews:", error);
      testimonialsSlider.innerHTML = "<p class='no-reviews'>Failed to load reviews.</p>";
    });
});
