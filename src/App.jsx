import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectSelector from './pages/ProjectSelector';
import DocumentationHub from './DocumentationHub';
import Clawdbot from './components/Clawdbot';
import { getUserData, getProjects, createProject, deleteProject, selectProject, updateProject } from './services/api';

// Main App wrapper with auth
const AppContent = () => {
  const { user, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('projects'); // 'projects' or 'documentation'

  // Load user data when logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const data = await getProjects();
          setProjects(data.projects || []);
          setCurrentProjectId(data.currentProjectId);

          // If there's a current project, load it
          if (data.currentProjectId && data.projects?.length > 0) {
            const project = data.projects.find(p => p._id === data.currentProjectId);
            if (project) {
              setCurrentProject(project);
              setView('documentation');
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setLoading(false);
    };
    loadUserData();
  }, [user]);

  // Create new project
  const handleCreateProject = async (projectData) => {
    try {
      const result = await createProject(projectData);
      setProjects(result.projects);
      return result;
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      const result = await deleteProject(projectId);
      setProjects(result.projects);
      setCurrentProjectId(result.currentProjectId);

      if (currentProjectId === projectId) {
        setCurrentProject(null);
        setView('projects');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Select and open a project
  const handleSelectProject = async (projectId) => {
    try {
      const result = await selectProject(projectId);
      setCurrentProjectId(projectId);
      setCurrentProject(result.project);
      setView('documentation');
    } catch (error) {
      console.error('Error selecting project:', error);
    }
  };

  // Save project data (documents, content, todos)
  const handleSaveProject = async (projectData) => {
    if (!currentProjectId) return;

    try {
      const result = await updateProject(currentProjectId, projectData);
      // Update the project in the list
      setProjects(prev => prev.map(p =>
        p._id === currentProjectId ? result.project : p
      ));
      setCurrentProject(result.project);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  // Go back to projects view
  const handleBackToProjects = () => {
    setView('projects');
  };

  if (loading && user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>P R O C E S S I N G</p>
        </div>
      </div>
    );
  }

  let content;
  if (!user) {
    if (authView === 'login') {
      content = (
        <Login
          onSwitchToSignup={() => setAuthView('signup')}
          darkMode={darkMode}
        />
      );
    } else {
      content = (
        <Signup
          onSwitchToLogin={() => setAuthView('login')}
          darkMode={darkMode}
        />
      );
    }
  } else if (view === 'projects' || !currentProject) {
    content = (
      <ProjectSelector
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        darkMode={darkMode}
        user={user}
        onLogout={logout}
      />
    );
  } else {
    content = (
      <DocumentationHub
        user={user}
        project={currentProject}
        onLogout={logout}
        onSaveProject={handleSaveProject}
        onBackToProjects={handleBackToProjects}
      />
    );
  }

  return (
    <>
      {content}
      {user && view === 'documentation' && currentProject && (
        <Clawdbot project={currentProject} />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
