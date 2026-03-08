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
        document.querySelectorAll('img[src*="favicon.png"], .sidebar-new-chat-icon, img[alt="App Logo"]').forEach(img => {
            img.src = url;
            img.srcset = url;
        });
    }

    // 2. Menu Injection Logic
    function injectMenus() {
        const sidebar = document.querySelector('.sidebar') || document.querySelector('nav') || document.querySelector('[role="navigation"]');
        if (!sidebar) return;
        if (document.getElementById('valhalla-workflows-link')) return;

        // Find a suitable insertion point: Workspace, or the first list of links
        const anchors = Array.from(sidebar.querySelectorAll('a'));
        let targetLink = anchors.find(a => a.innerText.toLowerCase().includes('workspace') || a.href.includes('/workspace'));
        
        // Fallback: If no workspace link, find the last link in the primary navigation group
        if (!targetLink && anchors.length > 0) {
            targetLink = anchors[anchors.length - 1];
        }

        if (targetLink) {
            const parent = targetLink.closest('div.flex.flex-col') || targetLink.parentElement;
            
            // Workflows Link
            const workflowsDiv = document.createElement('div');
            workflowsDiv.className = targetLink.parentElement.className;
            workflowsDiv.innerHTML = `
                <a id="valhalla-workflows-link" class="${targetLink.className}" href="/workflows" style="cursor:pointer">
                    <div class="self-center flex items-center justify-center size-9">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <div class="flex flex-1 self-center translate-y-[0.5px]">
                        <div class=" self-center text-sm font-primary font-bold uppercase tracking-widest opacity-80">Workflows</div>
                    </div>
                </a>
            `;
            targetLink.parentElement.after(workflowsDiv);

            // Dashboards Link
            const dashboardsDiv = document.createElement('div');
            dashboardsDiv.className = targetLink.parentElement.className;
            dashboardsDiv.innerHTML = `
                <a id="valhalla-dashboards-link" class="${targetLink.className}" href="/dashboards" style="cursor:pointer">
                    <div class=" self-center flex items-center justify-center size-9">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                        </svg>
                    </div>
                    <div class="flex flex-1 self-center translate-y-[0.5px]">
                        <div class=" self-center text-sm font-primary font-bold uppercase tracking-widest opacity-80">Dashboards</div>
                    </div>
                </a>
            `;
            workflowsDiv.after(dashboardsDiv);
        }
    }

    // 3. IFrame Mounting logic
    function showIframe(type) {
        const main = document.querySelector('main');
        if (!main) return;

        // Hide Chat Content
        Array.from(main.children).forEach(child => {
            if (child.id !== 'valhalla-frame') child.style.display = 'none';
        });

        let valhallaFrame = document.getElementById('valhalla-frame');
        if (!valhallaFrame) {
            valhallaFrame = document.createElement('iframe');
            valhallaFrame.id = 'valhalla-frame';
            valhallaFrame.style = "width:100%; height:100%; border:none; background:#020617";
            main.appendChild(valhallaFrame);
        }
        valhallaFrame.style.display = 'block';
        valhallaFrame.src = type === 'n8n' ? '/n8n/' : '/superset/';
    }

    // 4. Click Interceptor
    document.addEventListener('click', (e) => {
        const link = e.target.closest('#valhalla-workflows-link, #valhalla-dashboards-link');
        if (link) {
            e.preventDefault();
            const type = link.id.includes('workflows') ? 'n8n' : 'superset';
            showIframe(type);
        }
        
        // Return to chat if anything else is clicked in sidebar
        const otherLink = e.target.closest('a, button');
        if (otherLink && !otherLink.id.includes('valhalla-')) {
            const valhallaFrame = document.getElementById('valhalla-frame');
            if (valhallaFrame) valhallaFrame.style.display = 'none';
            const main = document.querySelector('main');
            if (main) {
                Array.from(main.children).forEach(child => {
                    if (child.id !== 'valhalla-frame') child.style.display = '';
                });
            }
        }
    });

    // 5. Custom UI Button Injection
    function injectThemeCustomizer() {
        if (document.getElementById('valhalla-theme-customizer')) return;
        
        const sidebarBottom = document.querySelector('.sidebar.sticky.bottom-0') || document.querySelector('nav')?.parentElement?.querySelector('.sticky.bottom-0');
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
                    <div class="self-center text-xs font-primary uppercase tracking-widest font-black text-blue-500">Custom UI</div>
                </div>
            </button>
        `;
        customizerBtn.onclick = openThemeModal;
        sidebarBottom.prepend(customizerBtn);
    }

    function openThemeModal() {
        const modal = document.createElement('div');
        modal.id = "valhalla-modal";
        modal.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4";
        modal.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] w-full max-w-[450px] shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
                <div class="space-y-1">
                    <h2 class="text-3xl font-black text-white tracking-tight italic uppercase">Branding</h2>
                    <p class="text-gray-500 text-[10px] uppercase font-black tracking-[0.3em] ml-1">Valhalla OS Customization</p>
                </div>
                
                <div class="space-y-6">
                    <div class="space-y-3">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-1 text-blue-500">Theme Identity</label>
                        <div class="flex gap-4">
                            <input type="color" id="valhalla-color-picker" value="${getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2563eb'}" class="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-gray-700 cursor-pointer overflow-hidden p-0 shadow-xl">
                            <div class="flex-1 flex flex-col justify-center">
                                <input type="text" id="valhalla-hex-input" class="bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm font-mono text-white outline-none focus:border-blue-600 transition-colors shadow-inner" placeholder="#2563EB">
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-1 text-blue-500">Corporate Logo URL</label>
                        <input type="text" id="valhalla-logo-input" value="${localStorage.getItem('valhalla_logo_url') || ''}" class="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-600 transition-colors shadow-inner" placeholder="https://corp.com/logo.png">
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button id="valhalla-save-theme" class="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-blue-600/20 transition-all text-white active:scale-95">Commit Changes</button>
                    <button id="valhalla-cancel" class="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] text-gray-400 transition-all active:scale-95">Cancel</button>
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
            window.location.reload();
        };
    }

    // Initial load
    applyTheme();
    
    const observer = new MutationObserver(() => {
        injectMenus();
        injectThemeCustomizer();
        const logo = localStorage.getItem('valhalla_logo_url');
        if (logo) updateLogos(logo);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    injectMenus();
    injectThemeCustomizer();
})();
