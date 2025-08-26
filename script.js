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
    const originalScript = document.getElementById('mmvst_globe');

    if (container && loadingDiv) {
        // 初始隐藏地图容器，待渲染后再显示
        container.style.opacity = '0';

        let rendered = false;
        let retries = 0;
        const MAX_RETRIES = 2;
        const TIMEOUT_MS = 12000;

        function markRendered() {
            if (rendered) return;
            rendered = true;
            loadingDiv.style.opacity = '0';
            setTimeout(function(){ loadingDiv.style.display = 'none'; }, 300);
            container.style.opacity = '1';
        }

        function showError() {
            loadingDiv.innerHTML = '<div style="text-align:center; font-size:12px;">Map failed to load.<br/><button id="retry-map" style="margin-top:8px;padding:4px 10px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">Retry</button></div>';
            const btn = document.getElementById('retry-map');
            if (btn) btn.onclick = function(){ tryReloadScript(true); };
            loadingDiv.style.opacity = '1';
        }

        function tryReloadScript(force) {
            if (force) rendered = false;
            if (retries >= MAX_RETRIES) { showError(); return; }
            retries += 1;
            // 移除旧的同源脚本（若存在）
            const exist = document.getElementById('mmvst_globe_dynamic');
            if (exist && exist.parentNode) exist.parentNode.removeChild(exist);
            // 动态加载脚本（带cache-busting）
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.id = 'mmvst_globe_dynamic';
            s.src = 'https://mapmyvisitors.com/globe.js?d=pMQPVCuywFl4f0vP1BlwcL5h4C-nCnD7v50OwqoGyu4&_=' + Date.now();
            s.onerror = function(){ setTimeout(function(){ if (!rendered) showError(); }, 100); };
            (document.body || document.documentElement).appendChild(s);
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
        const parent = (originalScript && originalScript.parentNode) || document.body;
        const scriptObserver = new MutationObserver(function() {
            const siblingCanvas = document.querySelector('#mmvst_globe + canvas, #mmvst_globe + * canvas, #mmvst_globe_dynamic + canvas, #mmvst_globe_dynamic + * canvas');
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

        // 3) 轮询兜底 + 超时处理（不使用静态图）
        const start = Date.now();
        const pollTimer = setInterval(function() {
            const ok = container.querySelector('canvas,iframe,svg') || document.querySelector('#mmvst_globe + canvas, #mmvst_globe + * canvas, #mmvst_globe_dynamic + canvas, #mmvst_globe_dynamic + * canvas');
            if (ok) {
                if (ok.parentNode && ok.parentNode !== container) {
                    container.appendChild(ok);
                }
                markRendered();
                clearInterval(pollTimer);
            }
            if (Date.now() - start > TIMEOUT_MS && !rendered) {
                clearInterval(pollTimer);
                // 超时：若还没加载过动态脚本，尝试重载一次，否则显示错误
                if (retries === 0) {
                    tryReloadScript(false);
                } else {
                    showError();
                }
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
