import React, { useState } from 'react';
import {
    FolderPlus, Folder, Trash2, Edit3, Check, X, Layers,
    Code, Database, Shield, Cloud, Box, Server, BookOpen,
    AlertTriangle, ChevronRight, Plus, LogOut, User
} from 'lucide-react';

// Icon mapping
const iconMap = {
    Layers, Code, Database, Shield, Cloud, Box, Server, BookOpen, Folder
};

// Color options for projects
const colorOptions = [
    'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
    'bg-teal-500', 'bg-amber-500'
];

const ProjectSelector = ({
    projects,
    currentProjectId,
    onSelectProject,
    onCreateProject,
    onDeleteProject,
    onEditProject,
    darkMode,
    user,
    onLogout
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [newProjectColor, setNewProjectColor] = useState('bg-blue-500');
    const [loading, setLoading] = useState(false);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        setLoading(true);
        await onCreateProject({
            name: newProjectName,
            description: newProjectDescription,
            color: newProjectColor
        });
        setNewProjectName('');
        setNewProjectDescription('');
        setNewProjectColor('bg-blue-500');
        setShowCreateModal(false);
        setLoading(false);
    };

    const handleDeleteProject = async (projectId) => {
        setLoading(true);
        await onDeleteProject(projectId);
        setShowDeleteConfirm(null);
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'}`}>
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Your Projects
                        </h1>
                        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Select a project to continue or create a new one
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {user?.username}
                            </span>
                        </div>
                        <button
                            onClick={onLogout}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-all`}
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Project Card */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className={`group relative p-6 rounded-2xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'border-gray-700 hover:border-purple-500 bg-gray-800/30' : 'border-gray-300 hover:border-purple-500 bg-white/50'}`}
                    >
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${darkMode ? 'bg-purple-600/20 group-hover:bg-purple-600/40' : 'bg-purple-100 group-hover:bg-purple-200'}`}>
                                <FolderPlus className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Create New Project
                            </h3>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Start a new architecture
                            </p>
                        </div>
                    </button>

                    {/* Existing Projects */}
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:shadow-xl'} shadow-lg ${currentProjectId === project._id ? 'ring-2 ring-purple-500' : ''}`}
                        >
                            {/* Color Bar */}
                            <div className={`h-2 ${project.color || 'bg-blue-500'}`} />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.color || 'bg-blue-500'}`}>
                                        <Folder className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteConfirm(project._id);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {project.name}
                                </h3>

                                {project.description && (
                                    <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {project.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {project.documents?.length || 0} documents
                                    </div>
                                    <button
                                        onClick={() => onSelectProject(project._id)}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${currentProjectId === project._id
                                            ? 'bg-purple-600 text-white'
                                            : darkMode
                                                ? 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white'
                                            }`}
                                    >
                                        {currentProjectId === project._id ? 'Current' : 'Open'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {projects.length === 0 && (
                    <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Folder className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No projects yet. Create your first one!</p>
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-xl ${newProjectColor}`}>
                                <FolderPlus className="w-6 h-6 text-white" />
                            </div>
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Create New Project
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    placeholder="My Awesome Project"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    placeholder="Brief description of your project..."
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Color Theme
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewProjectColor(color)}
                                            className={`w-8 h-8 rounded-lg ${color} transition-transform ${newProjectColor === color ? 'scale-110 ring-2 ring-white ring-offset-2' : 'hover:scale-105'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                disabled={!newProjectName.trim() || loading}
                                className={`flex-1 py-3 rounded-xl font-medium text-white transition-all ${!newProjectName.trim() || loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {loading ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Delete Project?
                            </h2>
                        </div>

                        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            This will permanently delete this project and all its documents. This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProject(showDeleteConfirm)}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-all"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectSelector;
