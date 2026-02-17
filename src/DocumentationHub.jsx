import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Search, ChevronRight, Code, Database, Cloud,
  Shield, Layers, GitBranch, Plus, X, Trash2, Box, Server,
  Cpu, FileCode, Layout, Terminal, UserCheck, Settings, Bot, Sparkles,
  Briefcase, Link, TrendingUp, BookOpen, ChevronDown,
  Edit3, AlertTriangle, Save, Archive, Sun, Moon, Menu, LogOut, User, ArrowLeft, Folder
} from 'lucide-react';
import JSZip from 'jszip';

const categoryStyles = {
  'Product': { icon: Layers, color: 'bg-indigo-500' },
  'Architecture': { icon: Box, color: 'bg-blue-500' },
  'Development': { icon: Code, color: 'bg-emerald-500' },
  'Backend': { icon: Server, color: 'bg-orange-500' },
  'Database': { icon: Database, color: 'bg-cyan-500' },
  'Services': { icon: Cpu, color: 'bg-purple-500' },
  'API Documentation': { icon: FileCode, color: 'bg-rose-500' },
  'Security': { icon: Shield, color: 'bg-amber-500' },
  'Frontend': { icon: Layout, color: 'bg-pink-500' },
  'DevOps': { icon: Terminal, color: 'bg-slate-700' },
  'Admin': { icon: UserCheck, color: 'bg-violet-500' },
  'Operations': { icon: Settings, color: 'bg-teal-500' },
  'Business': { icon: Briefcase, color: 'bg-blue-600' },
  'Integrations': { icon: Link, color: 'bg-indigo-400' },
  'Strategy': { icon: TrendingUp, color: 'bg-fuchsia-500' },
  'Guides': { icon: BookOpen, color: 'bg-green-500' },
  'Custom': { icon: FileText, color: 'bg-slate-400' }
};

const builtInDocs = [
  'product-platform', 'overview', 'custom-architecture', 'code-standards',
  'backend-setup', 'api-gateway', 'database-design', 'data-ingestion',
  'apis', 'security', 'frontend-architecture', 'monitoring-observability',
  'deployment', 'admin-documentation', 'maintenance-operation',
  'billing-subscription', 'integrations-extensions', 'future-scaling',
  'implementation-guide'
];

const DocumentationHub = ({ user, project, onLogout, onSaveProject, onBackToProjects }) => {
  const [selectedDoc, setSelectedDoc] = useState(() => localStorage.getItem('selectedDoc') || 'overview');

  // Sync selectedDoc to localStorage and across tabs
  useEffect(() => {
    localStorage.setItem('selectedDoc', selectedDoc);
  }, [selectedDoc]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedDoc' && e.newValue) {
        setSelectedDoc(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Initialize from project data or use defaults
  const [documentContent, setDocumentContent] = useState(() => {
    if (project?.documentContent) {
      // Convert Map to object if needed
      return project.documentContent instanceof Map
        ? Object.fromEntries(project.documentContent)
        : project.documentContent;
    }
    return {};
  });

  const [documents, setDocuments] = useState(() => {
    if (project?.documents && project.documents.length > 0) {
      return project.documents;
    }
    // Default documents for new projects
    return [
      { id: 'product-platform', title: 'Product & Platform Overview', icon: 'Layers', category: 'Product' },
      { id: 'overview', title: 'Architecture Overview', icon: 'Layers', category: 'Architecture' },
      { id: 'custom-architecture', title: 'Custom Architecture Template', icon: 'Code', category: 'Architecture' },
      { id: 'code-standards', title: 'Code Guidelines & Standards', icon: 'Code', category: 'Development' },
      { id: 'backend-setup', title: 'Backend Setup', icon: 'Code', category: 'Backend' },
      { id: 'api-gateway', title: 'API Gateway Configuration', icon: 'Cloud', category: 'Backend' },
      { id: 'database-design', title: 'Database Design', icon: 'Database', category: 'Database' },
      { id: 'data-ingestion', title: 'Data Ingestion Service', icon: 'Database', category: 'Services' },
      { id: 'apis', title: 'APIs', icon: 'Code', category: 'API Documentation' },
      { id: 'security', title: 'Security & Authentication', icon: 'Shield', category: 'Security' },
      { id: 'frontend-architecture', title: 'Frontend Architecture', icon: 'Code', category: 'Frontend' },
      { id: 'monitoring-observability', title: 'Monitoring & Observability', icon: 'Cloud', category: 'DevOps' },
      { id: 'deployment', title: 'Deployment', icon: 'Cloud', category: 'DevOps' },
      { id: 'admin-documentation', title: 'Admin Documentation', icon: 'Shield', category: 'Admin' },
      { id: 'maintenance-operation', title: 'Maintenance & Operation', icon: 'FileText', category: 'Operations' },
      { id: 'billing-subscription', title: 'Billing & Subscription', icon: 'FileText', category: 'Business' },
      { id: 'integrations-extensions', title: 'Integrations & Extensions', icon: 'Code', category: 'Integrations' },
      { id: 'future-scaling', title: 'Future & Scaling', icon: 'Layers', category: 'Strategy' },
      { id: 'implementation-guide', title: 'Implementation Guide', icon: 'FileText', category: 'Guides' }
    ];
  });

  const [todoLists, setTodoLists] = useState(() => {
    if (project?.todoLists) {
      return project.todoLists instanceof Map
        ? Object.fromEntries(project.todoLists)
        : project.todoLists;
    }
    return {};
  });

  // Icon mapping for documents
  const iconMap = {
    Layers, Code, Database, Shield, Cloud, Box, Server, FileText, Cpu, FileCode, Layout, Terminal, UserCheck, Settings, Briefcase, Link, TrendingUp, BookOpen
  };

  // Get icon component from string name
  const getIconComponent = (iconName) => {
    return iconMap[iconName] || FileText;
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Custom');
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [showDeleteTodoConfirm, setShowDeleteTodoConfirm] = useState(false);
  const [showDevDocumentation, setShowDevDocumentation] = useState(false);
  const [devDocNotes, setDevDocNotes] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-save project data with debounce
  useEffect(() => {
    if (!onSaveProject || !hasUnsavedChanges) return;

    const saveTimer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSaveProject({
          documents,
          documentContent,
          todoLists
        });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error saving project:', error);
      }
      setIsSaving(false);
    }, 2000); // 2 second debounce

    return () => clearTimeout(saveTimer);
  }, [documents, documentContent, todoLists, hasUnsavedChanges]);

  // Mark as having unsaved changes when data changes
  const markUnsaved = () => {
    setHasUnsavedChanges(true);
  };

  const addTodoList = () => {
    if (!newTodoTitle.trim()) {
      alert('Please enter a note title');
      return;
    }

    const wordCount = newTodoContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 50) {
      alert('Note content must be 50 words or less');
      return;
    }

    const todoId = Date.now().toString();
    if (!todoLists[selectedDoc]) {
      todoLists[selectedDoc] = [];
    }

    const newTodo = {
      id: todoId,
      title: newTodoTitle,
      content: newTodoContent,
      isCustom: true,
      completed: false,
      items: []
    };

    setTodoLists(prev => ({
      ...prev,
      [selectedDoc]: [...(prev[selectedDoc] || []), newTodo]
    }));
    markUnsaved();

    setNewTodoTitle('');
    setNewTodoContent('');
    setShowAddTodo(false);
  };

  const deleteTodoList = (todoId) => {
    const todo = todoLists[selectedDoc]?.find(t => t.id === todoId);
    if (todo && !todo.isCustom) {
      alert('Cannot delete built-in todo lists');
      return;
    }

    setTodoToDelete(todoId);
    setShowDeleteTodoConfirm(true);
  };

  const confirmDeleteTodo = () => {
    if (!todoToDelete) return;

    setTodoLists(prev => ({
      ...prev,
      [selectedDoc]: prev[selectedDoc].filter(t => t.id !== todoToDelete)
    }));
    markUnsaved();

    setShowDeleteTodoConfirm(false);
    setTodoToDelete(null);
  };

  const toggleTodoCompletion = (todoId) => {
    setTodoLists(prev => ({
      ...prev,
      [selectedDoc]: prev[selectedDoc].map(t =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  const deleteDocument = (docId) => {
    setDocToDelete(docId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!docToDelete) return;

    // Don't allow deleting built-in documents
    if (builtInDocs.includes(docToDelete)) {
      alert('Cannot delete built-in documents. You can only delete documents you created.');
      setShowDeleteConfirm(false);
      setDocToDelete(null);
      return;
    }

    // Remove from documents array
    setDocuments(documents.filter(d => d.id !== docToDelete));

    // Remove from content
    setDocumentContent(prev => {
      const updated = { ...prev };
      delete updated[docToDelete];
      return updated;
    });

    // Switch to first available document
    const remainingDoc = documents.find(d => d.id !== docToDelete);
    if (remainingDoc) {
      setSelectedDoc(remainingDoc.id);
    } else {
      setSelectedDoc('overview');
    }

    setShowDeleteConfirm(false);
    setDocToDelete(null);
  };

  const addNewDocument = () => {
    if (!newDocTitle.trim()) {
      alert('Please enter a document title');
      return;
    }

    const docId = `${newDocTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newDoc = {
      id: docId,
      title: newDocTitle,
      icon: FileText,
      category: newDocCategory
    };

    setDocuments([...documents, newDoc]);
    setDocumentContent(prev => ({
      ...prev,
      [docId]: {
        title: newDocTitle,
        content: `# ${newDocTitle}\n\nWrite your documentation here...`
      }
    }));

    setSelectedDoc(docId);
    setNewDocTitle('');
    setNewDocCategory('Custom');
    setShowAddModal(false);
  };

  useEffect(() => {
    const initialContent = {
      'product-platform': {
        title: 'Product & Platform Overview',
        content: `# Product & Platform Overview

## Product Vision
*Define your product vision, mission, and value proposition*

`
      },
      'apis': {
        title: 'APIs',
        content: `# APIs

## API Overview
`
      },
      'frontend-architecture': {
        title: 'Frontend Architecture',
        content: `# Frontend Architecture

## Technology Stack
`
      },
      'monitoring-observability': {
        title: 'Monitoring & Observability',
        content: `# Monitoring & Observability

## Metrics Collection
`
      },
      'billing-subscription': {
        title: 'Billing & Subscription',
        content: `# Billing & Subscription

## Pricing Plans

`
      },
      'integrations-extensions': {
        title: 'Integrations & Extensions',
        content: `# Integrations & Extensions

## Third-Party Integrations
`
      },
      'admin-documentation': {
        title: 'Admin Documentation',
        content: `# Admin Documentation

## Admin Console Overview
`
      },
      'maintenance-operation': {
        title: 'Maintenance & Operation',
        content: `# Maintenance & Operation

## Regular Maintenance Tasks
`
      },
      'future-scaling': {
        title: 'Future & Scaling',
        content: `# Future & Scaling

## Product Roadmap (2026-2027)
`
      },
      'code-standards': {
        title: 'Code Guidelines & Standards',
        content: `# Code Guidelines & Standards

## Naming Conventions
`
      },
      'overview': {
        title: 'Architecture Overview',
        content: `# Architecture Overview

## Executive Summary
`
      },
      'custom-architecture': {
        title: 'Custom Architecture Template',
        content: `# Your Custom Architecture - Editable Template

This is a blank template for you to document your own architecture. Edit this section to add your specific system design, technologies, and infrastructure details.
`

      },
      'backend-setup': {
        title: 'Backend Setup',
        content: `# Backend Setup

## Project Structure
`
      },
      'data-ingestion': {
        title: 'Data Ingestion Service',
        content: `# Data Ingestion Service

## Service Architecture


`
      },
      'api-gateway': {
        title: 'API Gateway Configuration',
        content: `# API Gateway Configuration

## Configuration (application.yml)

`
      },
      'database-design': {
        title: 'Database Design',
        content: `# Database Design

 # Database Design
`
      },
      'security': {
        title: 'Security & Authentication',
        content: `# Security & Authentication

## Spring Security Configuration
`
      },
      'deployment': {
        title: 'Deployment',
        content: `# Deployment

## Dockerfile for Spring Boot Application

`
      },
      'implementation-guide': {
        title: 'Implementation Guide',
        content: `# Implementation Guide

## Phase 1: Foundation (Weeks 1-3)
`
      }
    };
    setDocumentContent(initialContent);
  }, []);

  const startEditing = () => {
    if (documentContent[selectedDoc]) {
      setEditedContent(documentContent[selectedDoc].content);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    setDocumentContent(prev => ({
      ...prev,
      [selectedDoc]: {
        ...prev[selectedDoc],
        content: editedContent
      }
    }));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const downloadDoc = () => {
    if (!documentContent[selectedDoc]) return;

    const content = isEditing ? editedContent : documentContent[selectedDoc].content;
    const title = documentContent[selectedDoc].title;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${selectedDoc}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("documentation");

    documents.forEach(doc => {
      const content = documentContent[doc.id]?.content || "";
      const fileName = `${doc.title.replace(/\s+/g, '_')}.md`;
      folder.file(fileName, content);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = "project_documentation_all.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(filteredDocs.map(d => d.category))];

  return (
    <div className="h-screen transition-colors duration-500">
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:relative inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto shadow-lg transition-all duration-300 z-[45] lg:z-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            {/* Back to Projects Button */}
            {onBackToProjects && (
              <button
                onClick={onBackToProjects}
                className="flex items-center gap-2 text-blue-100 hover:text-white mb-3 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </button>
            )}

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${project?.color || 'bg-blue-500'}`}>
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white leading-tight truncate max-w-[180px]">
                  {project?.name || 'Project Documentation'}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 transform hover:scale-110 active:scale-90 flex-shrink-0"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 lg:hidden transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {project?.description && (
              <p className="text-blue-100 text-sm mb-3 line-clamp-2">{project.description}</p>
            )}

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.username}</p>
                    <p className="text-blue-200 text-xs">Logged in</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-indigo-200 dark:hover:shadow-none hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add New Document
              </button>
              <button
                onClick={downloadAllAsZip}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all duration-300 font-semibold shadow-md hover:shadow-slate-200 dark:hover:shadow-none hover:-translate-y-0.5 active:scale-95 border border-slate-700 dark:border-slate-600"
              >
                <Archive className="h-4 w-4" />
                Download All (ZIP)
              </button>
            </div>
          </div>

          <div className="p-4">
            {categories.map(category => (
              <div key={category} className="mb-6">
                <div className="flex items-center gap-2 mb-2 px-2">
                  {categoryStyles[category] && (
                    <div className={`w-2 h-2 rounded-full ${categoryStyles[category].color}`} />
                  )}
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {category}
                  </h3>
                </div>
                {filteredDocs
                  .filter(doc => doc.category === category)
                  .map(doc => {
                    const Icon = doc.icon;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoc(doc.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all ${selectedDoc === doc.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm text-left flex-1 truncate">{doc.title}</span>
                        {selectedDoc === doc.id && (
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm transition-colors sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                {documentContent[selectedDoc]?.title || 'Loading...'}
              </h2>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Edit</span>
                  </button>
                  <button
                    onClick={downloadDoc}
                    className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Download</span>
                  </button>
                  <button
                    onClick={() => !builtInDocs.includes(selectedDoc) && deleteDocument(selectedDoc)}
                    disabled={builtInDocs.includes(selectedDoc)}
                    className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${builtInDocs.includes(selectedDoc)
                      ? 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50'
                      : 'text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white active:scale-95'
                      }`}
                    title={builtInDocs.includes(selectedDoc) ? "Core document cannot be deleted" : "Delete this document"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20 rounded-lg hover:bg-slate-500 hover:text-white dark:hover:bg-slate-500 dark:hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <span className="hidden sm:inline">Cancel</span>
                    <X className="h-3.5 w-3.5 sm:hidden" />
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-100/50 dark:bg-slate-950 transition-colors">
            {documentContent[selectedDoc] && (
              <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-12 min-h-[calc(100vh-180px)] border border-slate-200 dark:border-slate-800 transition-colors">

                {!isEditing ? (
                  <>
                    <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center gap-4 transition-colors">
                      <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Design Optimization</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Customize your documentation architecture with precision.</p>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                      {documentContent[selectedDoc].content}
                    </pre>
                  </>
                ) : (
                  <>
                    <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center gap-4 transition-colors">
                      <div className="bg-emerald-600 p-2 rounded-lg text-white">
                        <Code className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-[11px] md:text-sm uppercase tracking-wider">Editor View</h4>
                        <p className="text-[10px] md:text-xs text-emerald-700 dark:text-emerald-300">Markdown format supported</p>
                      </div>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-[calc(100vh-350px)] p-6 md:p-10 font-mono text-xs md:text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-emerald-500/50 dark:focus:border-emerald-500/30 transition-all resize-none shadow-inner"
                      placeholder="Start writing your documentation here..."
                    />
                  </>
                )}

                {/* Small Notes Section */}
                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"> Small Notes</h3>
                    </div>
                    <button
                      onClick={() => setShowAddTodo(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 dark:shadow-none transition-all duration-300 font-semibold hover:-translate-y-0.5 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      Add Small Note
                    </button>
                  </div>

                  {todoLists[selectedDoc] && todoLists[selectedDoc].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todoLists[selectedDoc].map(todo => (
                        <div key={todo.id} className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg group relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                              {todo.title}
                            </span>
                            <button
                              onClick={() => deleteTodoList(todo.id)}
                              disabled={!todo.isCustom}
                              className={`p-1.5 rounded-lg transition-all ${todo.isCustom
                                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50'
                                }`}
                              title={todo.isCustom ? 'Delete note' : 'Built-in item'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {todo.content && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-3 line-clamp-3">
                              "{todo.content}"
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 rounded-full">
                            <UserCheck className="w-3 h-3" />
                            User Note
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                      <TrendingUp className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No small notes yet. Enrich your docs with quick insights!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 md:py-6 shadow-lg z-10 transition-all">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col items-center md:items-start gap-1">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center md:text-left">Project Documentation Hub</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="text-[9px] md:text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Content</p>
                <div className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                  Design by <strong>Manish Kumar With Ai</strong>
                  <span className="block md:inline md:ml-2 opacity-80 font-medium"><p>manishkanojia79@gmail.com</p></span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => setShowDevDocumentation(true)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 text-[11px] md:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Guide
                </button>
                <a href="mailto:manishkumar@example.com" className="flex items-center gap-2 px-3 md:px-4 py-2 text-[11px] md:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-xl transition-all hover:scale-105 active:scale-95">
                  <Server className="w-3.5 h-3.5" />
                  Support
                </a>
              </div>
            </div>
          </footer>
        </div>

        {showDevDocumentation && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-800 flex flex-col">
              {/* Header */}
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Project Manual & Guide</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">How to use the Documentation Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDevDocumentation(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content Area - Read Only */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-white dark:bg-slate-900 transition-colors">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Project Overview</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    Welcome to the <strong>Documentation Hub</strong>, a high-performance workspace powered by <strong>Document AI</strong>. This platform allows you to build, organize, and analyze complex architecture guides with real-time agentic insights.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-blue-500" />
                      Document AI
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Ask questions directly to your documents. Our <strong>Real-time AI</strong> scans your guides to provide instant snippets and summaries.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      Lobster Bridge
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Connect your local <strong>OpenClaw</strong> gateway to bridge the Hub with your system files for deep project-wide analysis.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Small Notes
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Enrich your docs with <strong>Contextual Insights</strong>. Use Small Notes to attach quick tips (max 50 words) to any section.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      Smart Hierarchy
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Automatically organize 19+ categories of documentation with a <strong>Slug-Optimized</strong> system and visual icons.
                    </p>
                  </div>
                </div>

                <section className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Developed with Passion</h3>
                    <p className="text-blue-100 text-sm leading-relaxed opacity-90 italic">
                      "This hub was built to solve the complexity of software documentation, making it beautiful and accessible for every developer."
                    </p>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest">Manish Kumar</p>
                  </div>
                  <Box className="absolute -right-10 -bottom-10 w-40 h-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowDevDocumentation(false)}
                  className="px-8 h-12 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all font-bold active:scale-95"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Create Document</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Add a new guide to your hub</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setIsCategorySelectOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-1">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Custom API Design"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 font-semibold transition-all shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewDocument();
                      }
                    }}
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 ml-1">This will be used as the document title and slug</p>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-1">Category</label>
                  <button
                    onClick={() => setIsCategorySelectOpen(!isCategorySelectOpen)}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {categoryStyles[newDocCategory] && (
                        <div className={`w-3.5 h-3.5 rounded shadow-sm ${categoryStyles[newDocCategory].color}`} />
                      )}
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{newDocCategory}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isCategorySelectOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600'}`} />
                  </button>

                  {isCategorySelectOpen && (
                    <>
                      <div className="fixed inset-0 z-[55]" onClick={() => setIsCategorySelectOpen(false)} />
                      <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[60] py-2 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-4 pb-2 mb-1 border-b border-slate-50 dark:border-slate-800">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Category</p>
                        </div>
                        {['Custom', ...[...new Set(documents.map(d => d.category))].filter(c => c !== 'Custom').sort()].map(category => {
                          const style = categoryStyles[category] || categoryStyles['Custom'];
                          const Icon = style.icon;
                          return (
                            <button
                              key={category}
                              onClick={() => {
                                setNewDocCategory(category);
                                setIsCategorySelectOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group ${newDocCategory === category ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                              <div className={`w-3 h-3 rounded shadow-sm ${style.color} group-hover:scale-110 transition-transform`} />
                              <Icon className={`h-4 w-4 ${newDocCategory === category ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                              <span className="flex-1 text-left">{category}</span>
                              {newDocCategory === category && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setIsCategorySelectOpen(false);
                    }}
                    className="flex-1 h-12 px-4 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewDocument}
                    className="flex-1 h-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all font-bold"
                  >
                    Create Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Delete Document?</h2>
              </div>

              <div className="mb-8">
                <p className="text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  Are you sure you want to delete <strong>"{documentContent[docToDelete]?.title || 'this document'}"</strong>?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-red-200 p-1.5 rounded-lg mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-700" />
                  </div>
                  <p className="text-[11px] text-red-800 dark:text-red-300 leading-relaxed font-bold">
                    This action is permanent and cannot be reversed. All content within this guide will be lost forever.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-12 px-4 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-12 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all font-bold"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddTodo && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Create Small Note</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Add a quick insight to this section</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-1">Note Heading</label>
                  <input
                    type="text"
                    placeholder="e.g. Configuration Hint"
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 font-semibold transition-all shadow-inner"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-1">Note Description</label>
                  <textarea
                    placeholder="Briefly explain your insight..."
                    className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 font-medium transition-all shadow-inner"
                    value={newTodoContent}
                    onChange={(e) => setNewTodoContent(e.target.value)}
                  />
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                      Keep your note concise (under 50 words) for best readability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowAddTodo(false);
                      setNewTodoTitle('');
                      setNewTodoContent('');
                    }}
                    className="flex-1 h-12 px-4 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTodoList}
                    className="flex-1 h-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all font-bold"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteTodoConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[80] p-4 transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Delete Small Note?</h2>
              </div>

              <div className="mb-6">
                <p className="text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  Are you sure you want to delete this small note?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    ΓÜá∩╕Å <strong>Warning:</strong> This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteTodoConfirm(false)}
                  className="flex-1 h-12 px-4 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTodo}
                  className="flex-1 h-12 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all font-bold"
                >
                  Delete Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationHub;
