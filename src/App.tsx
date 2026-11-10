import React, { useState, useEffect } from 'react';
import { Group, Language, User } from './types';
import { storage } from './services/storage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeView } from './components/HomeView';
import { GroupDetailView } from './components/GroupDetailView';
import { JoinGroupView } from './components/JoinGroupView';
import { ProfileView } from './components/ProfileView';
import { CreateGroupModal } from './components/CreateGroupModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => storage.getCurrentUser());
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('chama_lang_v1');
    if (saved === 'en' || saved === 'sw') return saved;
    return currentUser.language || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('chama_theme_v1');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'join' | 'profile' | 'group'>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>(() => storage.getGroups());
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => storage.getOfflineQueue().length);

  const { isOnline, forcedOffline, toggleSimulateOffline } = useOnlineStatus();

  // Apply dark class to documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('chama_theme_v1', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Persist language
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('chama_lang_v1', lang);
    if (currentUser) {
      const updated = { ...currentUser, language: lang };
      storage.updateUser(updated);
      setCurrentUser(updated);
    }
  };

  // Sync offline queue when connection restores
  useEffect(() => {
    if (isOnline) {
      const synced = storage.syncOfflineQueue();
      if (synced > 0) {
        setOfflineQueueCount(0);
      }
    }
    setOfflineQueueCount(storage.getOfflineQueue().length);
  }, [isOnline]);

  const handleManualSync = () => {
    const count = storage.syncOfflineQueue();
    setOfflineQueueCount(storage.getOfflineQueue().length);
    if (count > 0) {
      // Refresh groups list
      setGroups(storage.getGroups());
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentTab('group');
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(storage.getGroups());
    setSelectedGroupId(newGroup.id);
    setCurrentTab('group');
  };

  const handleResetData = () => {
    localStorage.clear();
    storage.init();
    const freshUser = storage.getCurrentUser();
    setCurrentUser(freshUser);
    setGroups(storage.getGroups());
    setSelectedGroupId(null);
    setCurrentTab('home');
    setOfflineQueueCount(0);
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-24 md:pb-12">
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setSelectedGroupId(null);
        }}
        currentUser={currentUser}
        language={language}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isOnline={isOnline}
        onToggleSimulateOffline={toggleSimulateOffline}
        forcedOffline={forcedOffline}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'home' && (
          <HomeView
            groups={groups}
            currentUser={currentUser}
            language={language}
            onSelectGroup={handleSelectGroup}
            onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
            onNavigateJoin={() => setCurrentTab('join')}
          />
        )}

        {currentTab === 'group' && selectedGroup && (
          <GroupDetailView
            group={selectedGroup}
            currentUser={currentUser}
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
            currentUser={currentUser}
            language={language}
            onJoinSuccess={(grp) => {
              setGroups(storage.getGroups());
            }}
            onNavigateHome={() => {
              setGroups(storage.getGroups());
              setCurrentTab('home');
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUserChanged={(u) => {
              setCurrentUser(u);
              setGroups(storage.getGroups());
            }}
            language={language}
            onLanguageChange={handleLanguageChange}
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
