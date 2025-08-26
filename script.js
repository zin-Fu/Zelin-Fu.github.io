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
    const container = document.getElementById('clstr_globe');
    const loadingDiv = document.getElementById('visitor-map-loading');
    const embedScript = document.getElementById('mmvst_globe');

    if (container && loadingDiv) {
        // 初始隐藏地图容器，待渲染后再显示
        container.style.opacity = '0';

        let rendered = false;
        function markRendered() {
            if (rendered) return;
            rendered = true;
            loadingDiv.style.opacity = '0';
            setTimeout(function(){ loadingDiv.style.display = 'none'; }, 300);
            container.style.opacity = '1';
        }

        // 1) 监听容器内部
        const containerObserver = new MutationObserver(function() {
            const hasChild = container.querySelector('canvas,iframe,svg');
            if (hasChild) {
                markRendered();
                containerObserver.disconnect();
            }
        });
        containerObserver.observe(container, { childList: true, subtree: true });

        // 2) 监听脚本相邻（部分第三方会在脚本后插入canvas到兄弟节点）
        if (embedScript) {
            const parent = embedScript.parentNode || document.body;
            const scriptObserver = new MutationObserver(function() {
                const siblingCanvas = document.querySelector('#mmvst_globe + canvas, #mmvst_globe + * canvas');
                if (siblingCanvas) {
                    // 如果画布被插在脚本后面，把它移到容器内以便样式控制
                    if (!container.contains(siblingCanvas)) {
                        container.appendChild(siblingCanvas);
                    }
                    markRendered();
                    scriptObserver.disconnect();
                }
            });
            scriptObserver.observe(parent, { childList: true, subtree: true });
        }

        // 3) 轮询兜底 + 超时静态图后备
        const start = Date.now();
        const pollTimer = setInterval(function() {
            const ok = container.querySelector('canvas,iframe,svg') || document.querySelector('#mmvst_globe + canvas, #mmvst_globe + * canvas');
            if (ok) {
                if (ok.parentNode && ok.parentNode !== container) {
                    container.appendChild(ok);
                }
                markRendered();
                clearInterval(pollTimer);
            }
            if (Date.now() - start > 10000 && !rendered) {
                clearInterval(pollTimer);
                // 隐藏loading并切换为静态图片后备（ClustrMaps静态图）
                loadingDiv.style.opacity = '0';
                setTimeout(function(){ loadingDiv.style.display = 'none'; }, 300);
                container.style.opacity = '1';
                container.innerHTML = '<img alt="Visitors Map" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" src="https://clustrmaps.com/map_v2.png?d=JDmE01DZdGkXQ0lEhwzVqn7jQF83J8xE415Ecdxcg4U&cl=ffffff&w=150&t=n" />';
            }
        }, 300);
    }

    // 预加载其他图片
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img){ if (img.dataset.src) img.src = img.dataset.src; });
});

// 优化的平滑滚动
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
        anchor.addEventListener('click', function(e){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
        });
    });
});
