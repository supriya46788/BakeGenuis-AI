// Auto-scroll for recipe carousels
// This script scrolls the trending and featured carousels automatically and loops them.

function autoScrollCarousel(carouselId, speed = 1) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    let scrollAmount = 0;
    let direction = 1;
    let isHovered = false;

    // Pause on hover
    carousel.addEventListener('mouseenter', () => { isHovered = true; });
    carousel.addEventListener('mouseleave', () => { isHovered = false; });

    function scrollStep() {
        if (!isHovered) {
            carousel.scrollLeft += speed * direction;
            scrollAmount += speed * direction;
            // If reached end, loop back
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
                carousel.scrollLeft = 0;
                scrollAmount = 0;
            }
            // If at start, go forward
            if (carousel.scrollLeft <= 0) {
                direction = 1;
            }
        }
        requestAnimationFrame(scrollStep);
    }
    requestAnimationFrame(scrollStep);
}

document.addEventListener('DOMContentLoaded', function() {
    autoScrollCarousel('trendingRecipes', 1);
    autoScrollCarousel('featuredRecipes', 1);
});
