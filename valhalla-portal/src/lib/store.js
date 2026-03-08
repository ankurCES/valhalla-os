import { writable } from 'svelte/store';

export const activeModule = writable('chat'); // 'chat', 'workflow', 'analytics', 'settings'
export const userRole = writable('admin'); // 'admin', 'user'
export const isSidebarOpen = writable(true);
