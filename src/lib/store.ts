import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAgents } from './mock-data';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

interface PlatformStore {
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearNotifications: () => void;

  // Agent execution
  activeExecutionId: string | null;
  setActiveExecutionId: (id: string | null) => void;

  // User preferences
  theme: 'dark';
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;

  // Platform stats (live)
  activeAgentsCount: number;
  totalExecutionsToday: number;
  incrementExecutions: () => void;
}

export const usePlatformStore = create<PlatformStore>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Notifications
      notifications: [
        {
          id: 'n1',
          title: 'Churn Analysis Complete',
          message: 'Master Agent identified 1,247 customers at risk. Campaign deployed.',
          type: 'success',
          timestamp: new Date(Date.now() - 45000),
          read: false,
        },
        {
          id: 'n2',
          title: 'Integration Degraded',
          message: 'HubSpot API latency exceeded 500ms threshold.',
          type: 'warning',
          timestamp: new Date(Date.now() - 340000),
          read: false,
        },
        {
          id: 'n3',
          title: 'Revenue Anomaly Detected',
          message: 'Analytics Agent flagged 12.4% MoM decline in APAC.',
          type: 'warning',
          timestamp: new Date(Date.now() - 900000),
          read: false,
        },
        {
          id: 'n4',
          title: 'Workflow Completed',
          message: 'Lead Scoring Pipeline processed 124 new leads successfully.',
          type: 'info',
          timestamp: new Date(Date.now() - 1800000),
          read: true,
        },
      ],
      unreadCount: 3,
      addNotification: (n) => {
        const newNotif: NotificationItem = {
          ...n,
          id: Math.random().toString(36).substring(2),
          timestamp: new Date(),
          read: false,
        };
        set((s) => ({
          notifications: [newNotif, ...s.notifications].slice(0, 50),
          unreadCount: s.unreadCount + 1,
        }));
      },
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // Agent execution
      activeExecutionId: null,
      setActiveExecutionId: (id) => set({ activeExecutionId: id }),

      // Preferences
      theme: 'dark',
      compactMode: false,
      setCompactMode: (v) => set({ compactMode: v }),

      // Stats
      activeAgentsCount: 8,
      totalExecutionsToday: 1847,
      incrementExecutions: () => set((s) => ({ totalExecutionsToday: s.totalExecutionsToday + 1 })),
    }),
    {
      name: 'xbridge-platform-store',
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        compactMode: s.compactMode,
      }),
    }
  )
);
