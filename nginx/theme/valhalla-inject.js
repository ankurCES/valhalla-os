(function() {
    console.log("Valhalla OS Seamless Integration Active");

    // 1. Theme Persistence logic
    const applyTheme = () => {
        const savedColor = localStorage.getItem('valhalla_primary_color');
        if (savedColor) {
            document.documentElement.style.setProperty('--color-primary', savedColor);
        }
        const savedLogo = localStorage.getItem('valhalla_logo_url');
        if (savedLogo) {
            updateLogos(savedLogo);
        }
    };

    function updateLogos(url) {
        // Open WebUI specific logo selectors
        document.querySelectorAll('img[src*="favicon.png"], .sidebar-new-chat-icon, img[alt="App Logo"]').forEach(img => {
            img.src = url;
            img.srcset = url;
        });
    }

    // 2. Custom UI Button Injection
    function injectThemeCustomizer() {
        if (document.getElementById('valhalla-theme-customizer')) return;
        
        // Target the bottom of the sidebar near settings/user
        const sidebarBottom = document.querySelector('.sidebar.sticky.bottom-0') || document.querySelector('nav').parentElement.querySelector('.sticky.bottom-0');
        if (!sidebarBottom) return;

        const customizerBtn = document.createElement('div');
        customizerBtn.id = 'valhalla-theme-customizer';
        customizerBtn.className = "px-[0.4375rem] mb-1";
        customizerBtn.innerHTML = `
            <button class="grow w-full flex items-center space-x-3 rounded-2xl px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition text-gray-800 dark:text-gray-200">
                <div class="self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <div class="flex flex-1 self-center translate-y-[0.5px]">
                    <div class="self-center text-sm font-primary uppercase tracking-tighter font-bold">Custom UI</div>
                </div>
            </button>
        `;
        customizerBtn.onclick = openThemeModal;
        sidebarBottom.prepend(customizerBtn);
    }

    function openThemeModal() {
        const modal = document.createElement('div');
        modal.id = "valhalla-modal";
        modal.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md";
        modal.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] w-[450px] shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
                <div class="space-y-1">
                    <h2 class="text-2xl font-black text-white tracking-tight">Enterprise Branding</h2>
                    <p class="text-gray-500 text-xs uppercase font-bold tracking-widest">Valhalla OS Customization</p>
                </div>
                
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-1">Theme Identity (Primary)</label>
                        <div class="flex gap-3">
                            <input type="color" id="valhalla-color-picker" value="${getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2563eb'}" class="w-14 h-14 rounded-2xl bg-gray-800 border-2 border-gray-700 cursor-pointer overflow-hidden p-0">
                            <input type="text" id="valhalla-hex-input" class="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-4 text-sm font-mono text-white outline-none focus:border-blue-600 transition-colors" placeholder="#2563EB">
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-1">Corporate Logo URL</label>
                        <input type="text" id="valhalla-logo-input" value="${localStorage.getItem('valhalla_logo_url') || ''}" class="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-600 transition-colors" placeholder="https://corp.com/logo.png">
                    </div>
                </div>

                <div class="flex gap-3 pt-2">
                    <button id="valhalla-save-theme" class="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 transition-all text-white">Update Realm</button>
                    <button id="valhalla-cancel" class="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-400 transition-all">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const picker = modal.querySelector('#valhalla-color-picker');
        const hexInput = modal.querySelector('#valhalla-hex-input');
        const logoInput = modal.querySelector('#valhalla-logo-input');
        
        picker.oninput = (e) => { hexInput.value = e.target.value.toUpperCase(); };
        hexInput.oninput = (e) => { 
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                picker.value = e.target.value; 
            }
        };

        modal.querySelector('#valhalla-cancel').onclick = () => modal.remove();
        modal.querySelector('#valhalla-save-theme').onclick = () => {
            const color = picker.value;
            const logo = logoInput.value;
            document.documentElement.style.setProperty('--color-primary', color);
            localStorage.setItem('valhalla_primary_color', color);
            if (logo) {
                localStorage.setItem('valhalla_logo_url', logo);
                updateLogos(logo);
            }
            modal.remove();
            window.location.reload(); // Refresh to ensure all iframes pick up the new theme from Nginx
        };
    }

    // Initialize
    applyTheme();
    
    const observer = new MutationObserver(() => {
        injectThemeCustomizer();
        const logo = localStorage.getItem('valhalla_logo_url');
        if (logo) updateLogos(logo);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    injectThemeCustomizer();
})();
