<script>
  import { MessageSquare, GitBranch, BarChart3, Settings, ShieldCheck, UserCircle, LogOut } from 'lucide-svelte';
  import { activeModule, userRole, isSidebarOpen } from '$lib/store';
  import '../app.css';

  const menuItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, roles: ['admin', 'user'] },
    { id: 'workflow', label: 'Workflows', icon: GitBranch, roles: ['admin', 'user'] },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3, roles: ['admin', 'user'] },
  ];

  const adminItems = [
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
  ];
</script>

<div class="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
  <!-- Sidebar -->
  <aside class="flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 {$isSidebarOpen ? 'w-64' : 'w-20'}">
    <div class="p-6 border-b border-slate-800 flex items-center gap-3">
      <div class="bg-blue-600 p-2 rounded-lg shadow-lg">
        <ShieldCheck size={20} />
      </div>
      {#if $isSidebarOpen}
        <span class="font-bold tracking-tighter text-xl uppercase italic">Valhalla</span>
      {/if}
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <p class="text-[10px] font-bold text-slate-500 px-3 py-2 uppercase tracking-widest">Main Menu</p>
      {#each menuItems as item}
        <button 
          on:click={() => activeModule.set(item.id)}
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all
          {$activeModule === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
        >
          <svelte:component this={item.icon} size={20} />
          {#if $isSidebarOpen}
            <span class="font-medium">{item.label}</span>
          {/if}
        </button>
      {/each}

      {#if $userRole === 'admin'}
        <div class="pt-4 mt-4 border-t border-slate-800">
           <p class="text-[10px] font-bold text-slate-500 px-3 py-2 uppercase tracking-widest">Administration</p>
           {#each adminItems as item}
            <button 
              on:click={() => activeModule.set(item.id)}
              class="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all
              {$activeModule === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
            >
              <svelte:component this={item.icon} size={20} />
              {#if $isSidebarOpen}
                <span class="font-medium">{item.label}</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </nav>

    <div class="p-4 border-t border-slate-800 bg-slate-900/50">
      <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
        <div class="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
          <UserCircle size={20} class="text-slate-300" />
        </div>
        {#if $isSidebarOpen}
          <div class="flex-1 overflow-hidden">
            <p class="text-xs font-bold truncate">Ankur Nair</p>
            <p class="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{$userRole}</p>
          </div>
          <button class="text-slate-500 hover:text-red-400"><LogOut size={16}/></button>
        {/if}
      </div>
    </div>
  </aside>

  <!-- Content -->
  <main class="flex-1 relative flex flex-col">
    <slot />
  </main>
</div>
