import React, { useState, useEffect } from 'react';
import { Group, Language, User } from './types';
import { storage } from './services/storage';
import { supabase } from './services/supabase';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeView } from './components/HomeView';
import { GroupDetailView } from './components/GroupDetailView';
import { JoinGroupView } from './components/JoinGroupView';
import { ProfileView } from './components/ProfileView';
import { CreateGroupModal } from './components/CreateGroupModal';
import { SignInScreen } from './components/SignInScreen';

function App() {
  const [hasInitializedSession, setHasInitializedSession] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'join' | 'profile' | 'group'>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const { isOnline, forcedOffline, toggleSimulateOffline } = useOnlineStatus();

  // Initialize data from storage
  useEffect(() => {
    async function initApp() {
      const user = await storage.getCurrentUser();
      setCurrentUser(user);
      setIsSignedIn(!!user);

      const lang = localStorage.getItem('chama_lang_v1');
      setLanguage(lang === 'en' || lang === 'sw' ? lang : 'en');

      const dark = localStorage.getItem('chama_theme_v1');
      setIsDark(!!dark);

      const fetchedGroups = await storage.getGroups();
      setGroups(fetchedGroups);

      const queue = await storage.getOfflineQueue();
      setOfflineQueueCount(queue.length);

      setHasInitializedSession(true);
    }
    initApp();
  }, []);

  // Apply dark class to documentElement
  useEffect(() => {
    const element = document.documentElement;
    if (isDark) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
  }, [isDark]);

  // Persist language when it changes
  useEffect(() => {
    const saved = localStorage.getItem('chama_lang_v1');
    if (saved && (saved === 'en' || saved === 'sw')) {
      setLanguage(saved);
    }
  }, []);

  // Sync offline queue when connection restores
  useEffect(() => {
    async function syncQueue() {
      if (isOnline) {
        await storage.syncOfflineQueue();
      }
      const queue = await storage.getOfflineQueue();
      setOfflineQueueCount(queue.length);
    }
    syncQueue();
  }, [isOnline]);

  const handleManualSync = async () => {
    await storage.syncOfflineQueue();
    const queue = await storage.getOfflineQueue();
    setOfflineQueueCount(queue.length);
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentTab('group');
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
    setCurrentTab('group');
    setIsCreateGroupOpen(false);
  };

  const handleResetData = async () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSignIn = async (user: User) => {
    setCurrentUser(user);
    setIsSignedIn(true);
    await storage.setCurrentUser(user.id);
  };

  // When user changes tab, fetch groups fresh
  useEffect(() => {
    async function fetchGroups() {
      const fetchedGroups = await storage.getGroups();
      setGroups(fetchedGroups);
    }
    fetchGroups();
  }, [currentTab]);

  // Compute safe current user (fallback to default if null)
  const safeCurrentUser = currentUser || {
    id: 'user_sarah',
    name: 'Sarah Wanjiku (Mama Brian)',
    phone: '0712345678',
    language: 'en' as const,
    avatar: '👩🏾‍💼',
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 flex flex-col transition-colors pb-24 md:pb-12'>
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setSelectedGroupId(null);
        }}
        currentUser={safeCurrentUser}
        language={language}
        isDark={isDark}
        onLanguageChange={(lang) => setLanguage(lang)}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isOnline={isOnline}
        onToggleSimulateOffline={toggleSimulateOffline}
        forcedOffline={forcedOffline}
      />

      {/* Main View Container */}
      <main className='flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6'>
        {currentTab === 'home' && (
          <HomeView
            groups={groups}
            currentUser={safeCurrentUser}
            language={language}
            onSelectGroup={handleSelectGroup}
            onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
            onNavigateJoin={() => setCurrentTab('join')}
          />
        )}

        {currentTab === 'group' && selectedGroupId && groups.find((g) => g.id === selectedGroupId) && (
          <GroupDetailView
            group={groups.find((g) => g.id === selectedGroupId)!}
            currentUser={safeCurrentUser}
            language={language}
            onBack={() => {
              setSelectedGroupId(null);
              setCurrentTab('home');
            }}
            isOnline={isOnline}
          />
        )}

        {currentTab === 'join' && (
          <JoinGroupView
            currentUser={safeCurrentUser}
            language={language}
            onJoinSuccess={(grp) => {
              setGroups((prev) => [...prev, grp]);
            }}
            onNavigateHome={() => {
              setCurrentTab('home');
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={safeCurrentUser}
            onUserChanged={(u) => {
              setCurrentUser(u);
            }}
            language={language}
            onLanguageChange={(lang) => setLanguage(lang)}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            isOnline={isOnline}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setSelectedGroupId(null);
        }}
        language={language}
      />

      {/* Floating Offline Notification & Sync Status Indicator */}
      <OfflineIndicator
        isOnline={isOnline}
        pendingCount={offlineQueueCount}
        language={language}
        onSync={handleManualSync}
        isSimulatedOffline={forcedOffline}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onGroupCreated={handleGroupCreated}
        language={language}
      />
    </div>
  );
}

export default App;
