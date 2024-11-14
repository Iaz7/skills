document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.badge').forEach((badge, index) => {
        badge.addEventListener('mouseenter', () => {
            const descriptionBanner = document.getElementById('description-banner');
            descriptionBanner.textContent = window.electronics[index].description;
            descriptionBanner.style.display = 'block';
        });

        badge.addEventListener('mouseleave', () => {
            const descriptionBanner = document.getElementById('description-banner');
            descriptionBanner.style.display = 'none';
        });
    });
});