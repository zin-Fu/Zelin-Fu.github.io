// 页面加载优化 - 立即执行
(function() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'none';

    const profileImg = document.querySelector('.sidebar-profile img');
    if (profileImg && profileImg.src) {
        const img = new Image();
        img.src = profileImg.src;
    }
})();

// 预加载非关键图片
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img){ if (img.dataset.src) img.src = img.dataset.src; });
});

// 平滑滚动
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
        anchor.addEventListener('click', function(e){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
        });
    });
});
