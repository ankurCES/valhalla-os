(function() {
    console.log("Valhalla OS Seamless Integration Active");

    function injectMenus() {
        const sidebar = document.querySelector('.sidebar') || document.querySelector('nav');
        if (!sidebar) return;
        if (document.getElementById('valhalla-workflows-link')) return;

        const workspaceLink = Array.from(sidebar.querySelectorAll('a')).find(a => a.href.includes('/workspace'));
        if (workspaceLink) {
            const parent = workspaceLink.parentElement;
            
            // Workflows Link
            const workflowsDiv = document.createElement('div');
            workflowsDiv.className = parent.className;
            workflowsDiv.innerHTML = `
                <a id="valhalla-workflows-link" class="${workspaceLink.className}" href="/workflows">
                    <div class="self-center flex items-center justify-center size-9">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <div class="flex flex-1 self-center translate-y-[0.5px]">
                        <div class=" self-center text-sm font-primary">Workflows</div>
                    </div>
                </a>
            `;
            parent.after(workflowsDiv);

            // Dashboards Link
            const dashboardsDiv = document.createElement('div');
            dashboardsDiv.className = parent.className;
            dashboardsDiv.innerHTML = `
                <a id="valhalla-dashboards-link" class="${workspaceLink.className}" href="/dashboards">
                    <div class=" self-center flex items-center justify-center size-9">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                        </svg>
                    </div>
                    <div class="flex flex-1 self-center translate-y-[0.5px]">
                        <div class=" self-center text-sm font-primary">Dashboards</div>
                    </div>
                </a>
            `;
            workflowsDiv.after(dashboardsDiv);
        }
    }

    // Add Theme Customizer to Sidebar bottom
    function injectThemeCustomizer() {
        if (document.getElementById('valhalla-theme-customizer')) return;
        const userMenu = document.querySelector('.UserMenu') || document.querySelector('button img')?.closest('div');
        if (!userMenu) return;

        const customizerBtn = document.createElement('div');
        customizerBtn.id = 'valhalla-theme-customizer';
        customizerBtn.className = "px-4 py-2 mt-2 cursor-pointer hover:bg-gray-800 rounded-xl flex items-center gap-3 text-slate-400";
        customizerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
            <span class="text-xs font-bold uppercase tracking-wider">Custom UI</span>
        `;
        customizerBtn.onclick = openThemeModal;
        userMenu.before(customizerBtn);
    }

    function openThemeModal() {
        const modal = document.createElement('div');
        modal.style = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm";
        modal.id = "valhalla-modal";
        modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-[400px] shadow-2xl space-y-6">
                <h2 class="text-xl font-bold">Theme Customization</h2>
                <div class="space-y-2">
                    <label class="text-xs text-slate-500 uppercase font-black">Primary Color</label>
                    <div class="flex gap-2">
                        <input type="color" id="valhalla-color-picker" value="${getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2563eb'}" class="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer">
                        <input type="text" id="valhalla-hex-input" class="flex-1 bg-slate-800 rounded-lg p-2 text-sm font-mono outline-none" placeholder="#HEX">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-slate-500 uppercase font-black">Custom Logo URL</label>
                    <input type="text" id="valhalla-logo-input" class="w-full bg-slate-800 rounded-lg p-3 text-sm outline-none" placeholder="https://...">
                </div>
                <div class="flex gap-3 pt-4">
                    <button id="valhalla-save-theme" class="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Apply Changes</button>
                    <button onclick="document.getElementById('valhalla-modal').remove()" class="px-6 py-3 bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const picker = modal.querySelector('#valhalla-color-picker');
        const hexInput = modal.querySelector('#valhalla-hex-input');
        const logoInput = modal.querySelector('#valhalla-logo-input');
        
        picker.oninput = (e) => { hexInput.value = e.target.value; };
        hexInput.oninput = (e) => { picker.value = e.target.value; };

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
        };
    }

    function updateLogos(url) {
        document.querySelectorAll('img[src*="favicon.png"]').forEach(img => {
            img.src = url;
        });
    }

    // Apply saved settings
    const savedColor = localStorage.getItem('valhalla_primary_color');
    if (savedColor) document.documentElement.style.setProperty('--color-primary', savedColor);
    const savedLogo = localStorage.getItem('valhalla_logo_url');
    if (savedLogo) setTimeout(() => updateLogos(savedLogo), 1000);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('#valhalla-workflows-link, #valhalla-dashboards-link');
        if (link) {
            e.preventDefault();
            const type = link.id.includes('workflows') ? 'n8n' : 'superset';
            showIframe(type);
        }
    });

    function showIframe(type) {
        let main = document.querySelector('main');
        if (!main) return;
        
        // Open WebUI specific: handle the chat container
        const chatContainer = document.getElementById('chat-container') || main.querySelector('div');
        if (chatContainer) chatContainer.style.display = 'none';

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
