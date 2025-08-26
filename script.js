// 页面加载优化 - 立即执行
(function() {
    // 立即隐藏页面级加载指示器（如果存在）
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
    // 访客地图加载监测与占位符处理
    const clustrContainer = document.getElementById('clstr_globe');
    const loadingDiv = document.getElementById('visitor-map-loading');

    if (clustrContainer && loadingDiv) {
        // 初始隐藏地图容器，待渲染后再显示
        clustrContainer.style.opacity = '0';

        // 使用 MutationObserver 监听容器内是否出现子节点（canvas/iframe/svg 等）
        let rendered = false;
        const observer = new MutationObserver(function(mutations) {
            if (clustrContainer.childNodes && clustrContainer.childNodes.length > 0) {
                rendered = true;
                // 渲染成功：淡出loading，淡入地图
                loadingDiv.style.opacity = '0';
                setTimeout(function() { loadingDiv.style.display = 'none'; }, 300);
                clustrContainer.style.opacity = '1';
                observer.disconnect();
            }
        });
        observer.observe(clustrContainer, { childList: true, subtree: true });

        // 双保险：定时轮询（部分脚本可能一次性替换innerHTML，错过Mutation）
        const pollStart = Date.now();
        const pollTimer = setInterval(function() {
            if (clustrContainer.childNodes && clustrContainer.childNodes.length > 0) {
                rendered = true;
                loadingDiv.style.opacity = '0';
                setTimeout(function() { loadingDiv.style.display = 'none'; }, 300);
                clustrContainer.style.opacity = '1';
                clearInterval(pollTimer);
            }
            // 超时10秒仍未渲染，给出错误提示
            if (Date.now() - pollStart > 10000 && !rendered) {
                clearInterval(pollTimer);
                loadingDiv.innerHTML = '<div style="color:#dc3545; text-align:center; font-size:12px;">Map Unavailable<br/>Check network/ad-block</div>';
                loadingDiv.style.opacity = '1';
            }
        }, 300);
    }

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
