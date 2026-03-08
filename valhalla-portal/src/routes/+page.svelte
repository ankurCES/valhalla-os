<script>
  import { activeModule, userRole } from '$lib/store';
  import AdminPanel from '$lib/components/AdminPanel.svelte';
  
  const endpoints = {
    chat: '/chat/', 
    workflow: '/n8n/', 
    analytics: '/superset/', 
    settings: '/admin/settings' 
  };

  let loading = false;
</script>

<div class="flex-1 bg-slate-950 flex flex-col">
  <!-- Module Header -->
  <header class="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center h-16 shrink-0 shadow-2xl z-10">
    <div class="flex items-center gap-4">
        <h1 class="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
        {$activeModule === 'chat' ? 'Cognitive Hub' : 
        $activeModule === 'workflow' ? 'Neural Forge' : 
        $activeModule === 'analytics' ? 'Intelligence Stream' : 'Core Command'}
        </h1>
        <div class="h-4 w-[1px] bg-slate-800"></div>
        <span class="text-[10px] text-slate-500 font-mono italic">valhalla_v2.0_stable</span>
    </div>
    <div class="flex gap-2">
       <span class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-500 text-[10px] font-bold border border-blue-500/20 uppercase">
         <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
         Proxy Active
       </span>
    </div>
  </header>

  <!-- Unified Viewport -->
  <div class="flex-1 relative overflow-hidden bg-slate-950">
    {#if $activeModule === 'chat'}
       <iframe title="Chat" src={endpoints.chat} class="w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity" />
    {:else if $activeModule === 'workflow'}
       <iframe title="Workflow" src={endpoints.workflow} class="w-full h-full border-none filter contrast-[1.05]" />
    {:else if $activeModule === 'analytics'}
       <iframe title="Analytics" src={endpoints.analytics} class="w-full h-full border-none grayscale-[0.2] hover:grayscale-0 transition-all" />
    {:else if $activeModule === 'settings'}
       <AdminPanel />
    {/if}
  </div>
</div>
