<script>
  import { activeModule, userRole } from '$lib/store';
  import { Database, Cpu, Settings, Activity, ShieldAlert, CheckCircle2 } from 'lucide-svelte';

  const services = [
    { name: 'Neural Forge (n8n)', status: 'Operational', latency: '12ms', health: 100 },
    { name: 'Cognitive Hub (Open WebUI)', status: 'Active', latency: '45ms', health: 98 },
    { name: 'Intelligence Stream (Superset)', status: 'Operational', latency: '8ms', health: 100 },
    { name: 'Valhalla Gateway (Nginx)', status: 'Online', latency: '2ms', health: 100 },
  ];

  let selectedSource = 'PostgreSQL';
</script>

<div class="flex-1 bg-slate-950 flex flex-col p-10 overflow-y-auto">
  <div class="max-w-6xl mx-auto w-full space-y-12">
    
    <!-- Title Section -->
    <div class="flex justify-between items-end">
      <div class="space-y-2">
        <h2 class="text-4xl font-black tracking-tight text-white">System Infrastructure</h2>
        <p class="text-slate-500 font-medium text-lg italic">Strategic oversight of the Valhalla AI Ecosystem.</p>
      </div>
      <div class="flex gap-4">
        <button class="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Export Logs</button>
        <button class="px-6 py-3 bg-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">Restart Forge</button>
      </div>
    </div>

    <!-- Health Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      {#each services as service}
        <div class="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
          <div class="flex justify-between items-start">
            <div class="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
              <Activity size={18} class="text-blue-500" />
            </div>
            <CheckCircle2 size={16} class="text-emerald-500" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">{service.name}</p>
            <h3 class="text-xl font-bold text-white">{service.status}</h3>
          </div>
          <div class="flex justify-between items-center text-[10px] font-mono">
            <span class="text-slate-500">Latency: {service.latency}</span>
            <span class="text-emerald-500 font-bold">{service.health}%</span>
          </div>
        </div>
      {/each}
    </div>

    <!-- Configuration Modules -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Data Ingress Panel -->
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div class="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-amber-600/20 flex items-center justify-center">
            <Database size={24} class="text-amber-500" />
          </div>
          <div>
            <h3 class="text-2xl font-bold">Data Ingress</h3>
            <p class="text-xs text-slate-500 font-medium tracking-tight">Enterprise connectors for Intelligence Stream.</p>
          </div>
        </div>
        <div class="p-8 space-y-6">
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Source Type</label>
            <select bind:value={selectedSource} class="w-full bg-slate-800 border-none rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none shadow-inner">
              <option>PostgreSQL</option>
              <option>Snowflake</option>
              <option>AWS S3 Bucket</option>
              <option>Google BigQuery</option>
              <option>Oracle Database</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Host/Endpoint</label>
              <input type="text" placeholder="10.0.0.x" class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-colors shadow-inner" />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Port</label>
              <input type="text" placeholder="5432" class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-colors shadow-inner" />
            </div>
          </div>
          <button class="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-amber-600/10 transition-all">Verify Connection</button>
        </div>
      </div>

      <!-- Neural Engine Calibration -->
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div class="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
            <Cpu size={24} class="text-indigo-500" />
          </div>
          <div>
            <h3 class="text-2xl font-bold">Neural Calibration</h3>
            <p class="text-xs text-slate-500 font-medium tracking-tight">Global reasoning thresholds for Cognitive Hub.</p>
          </div>
        </div>
        <div class="p-8 space-y-8">
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Creativity Bias (Temperature)</label>
              <span class="text-xs font-mono text-indigo-400">0.72</span>
            </div>
            <input type="range" class="w-full accent-indigo-600 bg-slate-800 h-2 rounded-full appearance-none cursor-pointer" />
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Top-P Sampling</label>
              <span class="text-xs font-mono text-indigo-400">0.90</span>
            </div>
            <input type="range" class="w-full accent-indigo-600 bg-slate-800 h-2 rounded-full appearance-none cursor-pointer" />
          </div>
          <div class="space-y-4">
             <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Global System Message</label>
             <textarea class="w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-6 text-xs text-slate-300 outline-none focus:border-indigo-500 transition-colors shadow-inner resize-none h-32" placeholder="Enter system instructions for all Valhalla agents..."></textarea>
          </div>
          <button class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-indigo-600/10 transition-all">Apply to All Nodes</button>
        </div>
      </div>

    </div>
  </div>
</div>
