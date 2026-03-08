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
        document.querySelectorAll('img[src*="favicon.png"], .sidebar-new-chat-icon, img[alt="App Logo"], img[alt="logo"]').forEach(img => {
            img.src = url;
            img.srcset = url;
        });
    }

    // 2. Menu Injection Logic
    function injectMenus() {
        if (document.getElementById('valhalla-workflows-link')) return;

        // Find the Sidebar
        const sidebar = document.querySelector('#sidebar') || 
                        document.querySelector('.sidebar') || 
                        document.querySelector('nav') ||
                        document.querySelector('aside');
        
        if (!sidebar) return;

        // Find anchors within the sidebar
        const anchors = Array.from(sidebar.querySelectorAll('a'));
        
        // Target: "Workspace", "Notes", "New Chat", or anything with an SVG
        let targetAnchor = anchors.find(a => {
            const label = (a.getAttribute('aria-label') || "").toLowerCase();
            const text = a.textContent.toLowerCase();
            return label.includes('workspace') || text.includes('workspace');
        }) || anchors.find(a => {
            const label = (a.getAttribute('aria-label') || "").toLowerCase();
            return label.includes('notes') || label.includes('chat');
        }) || anchors.find(a => a.querySelector('svg'));

        if (targetAnchor) {
            // Find the repeating wrapper (usually <div class="flex"> inside a container)
            const itemWrapper = targetAnchor.closest('div.flex')?.parentElement || targetAnchor.parentElement;
            const listContainer = itemWrapper.parentElement;

            if (!listContainer) return;

            const createNavItem = (id, label, svgPath, href) => {
                const navItem = document.createElement('div');
                navItem.className = itemWrapper.className || "";
                navItem.innerHTML = `
                    <div class="flex">
                        <a id="${id}" class="${targetAnchor.className}" href="${href}" draggable="false" aria-label="${label}" style="cursor:pointer; width:100%">
                            <div class="self-center flex items-center justify-center size-9">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4.5">
                                    ${svgPath}
                                </svg>
                            </div>
                            <div class="flex flex-1 self-center translate-y-[0.5px]">
                                <div class="self-center text-sm font-primary font-bold uppercase tracking-widest opacity-80">${label}</div>
                            </div>
                        </a>
                    </div>
                `;
                return navItem;
            };

            const workflows = createNavItem(
                'valhalla-workflows-link', 
                'Workflows', 
                '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />',
                '/workflows'
            );

            const dashboards = createNavItem(
                'valhalla-dashboards-link', 
                'Dashboards', 
                '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />',
                '/dashboards'
            );

            // Append to the list
            listContainer.appendChild(workflows);
            listContainer.appendChild(dashboards);
        }
    }

    // 3. IFrame Mounting logic
    function showIframe(type) {
        const main = document.querySelector('main') || document.querySelector('#chat-container') || document.body;
        if (!main) return;

        // Hide Chat Content (but keep our frame)
        Array.from(main.children).forEach(child => {
            if (child.id !== 'valhalla-frame' && child.id !== 'sidebar' && !child.classList.contains('sidebar')) {
                child.style.display = 'none';
            }
        });

        let valhallaFrame = document.getElementById('valhalla-frame');
        if (!valhallaFrame) {
            valhallaFrame = document.createElement('iframe');
            valhallaFrame.id = 'valhalla-frame';
            valhallaFrame.style = "position:fixed; top:0; right:0; width:calc(100% - 260px); height:100%; border:none; background:#020617; z-index:50";
            document.body.appendChild(valhallaFrame);
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
            return;
        }
        
        // Return to chat if anything else is clicked in sidebar
        const otherLink = e.target.closest('a, button');
        if (otherLink && !otherLink.id.includes('valhalla-')) {
            const valhallaFrame = document.getElementById('valhalla-frame');
            if (valhallaFrame) valhallaFrame.style.display = 'none';
            const main = document.querySelector('main') || document.querySelector('#chat-container');
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
        
        // Look for the user menu area or bottom of sidebar
        const sidebarBottom = document.querySelector('.sidebar.sticky.bottom-0') || 
                              document.querySelector('#sidebar > div:last-child') ||
                              document.querySelector('nav')?.parentElement?.querySelector('.sticky.bottom-0');
        
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

    // Initialize
    applyTheme();
    
    // Polling as a fallback for MutationObserver
    setInterval(() => {
        injectMenus();
        injectThemeCustomizer();
    }, 2000);

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
