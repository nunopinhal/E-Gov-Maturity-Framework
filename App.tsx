
import React, { useState, useMemo } from 'react';
import { FrameworkProvider } from './hooks/useFramework';
import DashboardView from './components/DashboardView';
import AssessmentView from './components/AssessmentView';
import ConfigurationView from './components/ConfigurationView';
import { LayoutDashboard, ClipboardList, Settings, Github } from 'lucide-react';

type View = 'dashboard' | 'assessment' | 'configuration';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'assessment':
        return <AssessmentView />;
      case 'configuration':
        return <ConfigurationView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  const NavItem = ({ view, label, icon: Icon }: { view: View; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );

  return (
    <FrameworkProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">E-Gov Maturity</h1>
            </div>
            <nav className="space-y-2">
              <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
              <NavItem view="assessment" label="New Assessment" icon={ClipboardList} />
              <NavItem view="configuration" label="Configure Framework" icon={Settings} />
            </nav>
          </div>
          <div className="border-t dark:border-gray-700 pt-4">
              <a href="https://github.com/google/generative-ai-docs/tree/main/app-integrations/google-ai-studio-callback" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </FrameworkProvider>
  );
};

export default App;
