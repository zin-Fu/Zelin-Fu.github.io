// 页面加载优化 - 立即执行
(function() {
    // 立即隐藏加载指示器
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // 预加载关键图片
    const profileImg = document.querySelector('.sidebar-profile img');
    if (profileImg && profileImg.src) {
        const img = new Image();
        img.src = profileImg.src;
    }
})();

// 延迟加载非关键资源
document.addEventListener('DOMContentLoaded', function() {
    // ClustrMaps加载处理
    setTimeout(function() {
        const clustrContainer = document.getElementById('clstr_globe');
        const loadingDiv = document.getElementById('visitor-map-loading');
        
        if (clustrContainer && loadingDiv) {
            // 等待地图加载完成后隐藏加载指示器
            setTimeout(function() {
                loadingDiv.style.opacity = '0';
                setTimeout(function() {
                    loadingDiv.style.display = 'none';
                }, 300);
                clustrContainer.style.opacity = '1';
            }, 2000); // 给地图2秒时间加载
        }
    }, 500);
    
    // 预加载其他图片
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
});

// 优化的平滑滚动
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
