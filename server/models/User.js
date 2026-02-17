import mongoose from 'mongoose';

// Project Schema - Each user can have multiple projects
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'Layers'
    },
    color: {
        type: String,
        default: 'bg-blue-500'
    },
    // Array of document metadata for this project
    documents: [{
        id: String,
        title: String,
        icon: String,
        category: String,
        _id: false
    }],
    // Map of document content: key = docId, value = { title, content }
    documentContent: {
        type: Map,
        of: new mongoose.Schema({
            title: String,
            content: String
        }, { _id: false })
    },
    // Map of todo lists: key = docId, value = array of todos
    todoLists: {
        type: Map,
        of: [new mongoose.Schema({
            id: String,
            title: String,
            content: String,
            isCustom: Boolean,
            completed: Boolean,
            items: [String]
        }, { _id: false })]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Array of projects - each project has its own documents
    projects: [projectSchema],
    // Currently selected project ID
    currentProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    // User preferences
    preferences: {
        darkMode: { type: Boolean, default: false },
        selectedDoc: { type: String, default: 'overview' }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
