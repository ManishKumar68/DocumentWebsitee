import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/document_website_db')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Routes

// Check if username is available
app.get('/api/auth/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const existingUser = await User.findOne({ username: username.toLowerCase() });

        if (existingUser) {
            return res.json({ available: false, message: 'Username is already taken' });
        }

        res.json({ available: true, message: 'Username is available' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Register
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: 'Username is already taken. Please choose a different one.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with empty projects array
        const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            role,
            projects: [],
            currentProjectId: null,
            preferences: { darkMode: false, selectedDoc: 'overview' }
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

        res.status(201).json({ token, userId: newUser._id, username: newUser.username, role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

        res.json({ token, userId: user._id, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User Data (including all projects)
app.get('/api/user/data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update User Preferences
app.put('/api/user/preferences', auth, async (req, res) => {
    try {
        const { preferences, currentProjectId } = req.body;

        const updates = {};
        if (preferences) updates.preferences = preferences;
        if (currentProjectId !== undefined) updates.currentProjectId = currentProjectId;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== PROJECT ROUTES ====================

// Get all projects for user
app.get('/api/projects', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('projects currentProjectId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            projects: user.projects,
            currentProjectId: user.currentProjectId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new project
app.post('/api/projects', auth, async (req, res) => {
    try {
        const { name, description, icon, color } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const newProject = {
            name: name.trim(),
            description: description || '',
            icon: icon || 'Layers',
            color: color || 'bg-blue-500',
            documents: [],
            documentContent: new Map(),
            todoLists: new Map(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                $push: { projects: newProject }
            },
            { new: true }
        ).select('-password');

        // Get the newly created project (last in array)
        const createdProject = user.projects[user.projects.length - 1];

        // Set as current project if it's the first one
        if (user.projects.length === 1) {
            await User.findByIdAndUpdate(req.userId, { currentProjectId: createdProject._id });
        }

        res.status(201).json({ project: createdProject, projects: user.projects });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single project by ID
app.get('/api/projects/:projectId', auth, async (req, res) => {
    try {
        const { projectId } = req.params;

        const user = await User.findById(req.userId).select('projects');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = user.projects.id(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update project
app.put('/api/projects/:projectId', auth, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, icon, color, documents, documentContent, todoLists } = req.body;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = user.projects.id(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Update project fields
        if (name) project.name = name;
        if (description !== undefined) project.description = description;
        if (icon) project.icon = icon;
        if (color) project.color = color;
        if (documents) project.documents = documents;
        if (documentContent) project.documentContent = documentContent;
        if (todoLists) project.todoLists = todoLists;
        project.updatedAt = new Date();

        await user.save();

        res.json({ project, message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete project
app.delete('/api/projects/:projectId', auth, async (req, res) => {
    try {
        const { projectId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const projectIndex = user.projects.findIndex(p => p._id.toString() === projectId);
        if (projectIndex === -1) return res.status(404).json({ message: 'Project not found' });

        user.projects.splice(projectIndex, 1);

        // If deleted project was current, set new current
        if (user.currentProjectId?.toString() === projectId) {
            user.currentProjectId = user.projects.length > 0 ? user.projects[0]._id : null;
        }

        await user.save();

        res.json({
            message: 'Project deleted successfully',
            projects: user.projects,
            currentProjectId: user.currentProjectId
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Set current project
app.put('/api/projects/:projectId/select', auth, async (req, res) => {
    try {
        const { projectId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = user.projects.id(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        user.currentProjectId = projectId;
        await user.save();

        res.json({ message: 'Project selected', currentProjectId: projectId, project });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================
// Middleware to check admin role
const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin only.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users and their Projects
app.get('/api/admin/all-data', auth, checkAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin Delete User
app.delete('/api/admin/user/:userId', auth, checkAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin Delete Project (find user who has this project and pull it)
app.delete('/api/admin/project/:projectId', auth, checkAdmin, async (req, res) => {
    try {
        const { projectId } = req.params;
        // Find user who has this project
        const user = await User.findOne({ 'projects._id': projectId });

        if (!user) return res.status(404).json({ message: 'Project not found' });

        // Remove project
        user.projects.pull({ _id: projectId });

        // Update current project if needed
        if (user.currentProjectId == projectId) {
            user.currentProjectId = user.projects.length > 0 ? user.projects[0]._id : null;
        }

        await user.save();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
