<script>
  import { activeModule, userRole } from '$lib/store';
  
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
       <div class="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="space-y-2">
            <h2 class="text-3xl font-black tracking-tight">System Infrastructure</h2>
            <p class="text-slate-500 font-medium">Control center for Valhalla OS enterprise data channels.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <section class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition-colors group">
                <div class="h-12 w-12 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg class="text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 19h6"/><path d="M19 16v6"/><path d="M15 10v4"/><path d="M12 12v2"/><path d="M9 8v6"/></svg>
                </div>
                <h3 class="text-xl font-bold">Data Ingress</h3>
                <p class="text-sm text-slate-500 mt-2 leading-relaxed">Map enterprise datasets (Snowflake, S3, PostgreSQL) directly into the Intelligence module.</p>
                <button class="mt-8 px-6 py-2.5 bg-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all">Configure Stream</button>
             </section>

             <section class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition-colors group">
                <div class="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <svg class="text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><path d="M12 22v-8"/><path d="m8 18 4-4 4 4"/></svg>
                </div>
                <h3 class="text-xl font-bold">Neural Engine</h3>
                <p class="text-sm text-slate-500 mt-2 leading-relaxed">Adjust global model parameters, system prompts, and reasoning thresholds for Open WebUI.</p>
                <button class="mt-8 px-6 py-2.5 bg-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">Calibrate Models</button>
             </section>
          </div>
       </div>
    {/if}
  </div>
</div>
