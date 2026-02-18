import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Search, ChevronRight, Code, Database, Cloud,
  Shield, Layers, GitBranch, Plus, X, Trash2, Box, Server,
  Cpu, FileCode, Layout, Terminal, UserCheck, Settings,
  Briefcase, Link, TrendingUp, BookOpen, ChevronDown,
  Edit3, AlertTriangle, Save, Archive, Sun, Moon, Menu
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

const DocumentationHub = () => {
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
  const [documentContent, setDocumentContent] = useState({});
  const [documents, setDocuments] = useState([
    { id: 'product-platform', title: 'Product & Platform Overview', icon: Layers, category: 'Product' },

    { id: 'overview', title: 'Architecture Overview', icon: Layers, category: 'Architecture' },
    { id: 'custom-architecture', title: 'Custom Architecture Template', icon: Code, category: 'Architecture' },

    { id: 'code-standards', title: 'Code Guidelines & Standards', icon: Code, category: 'Development' },

    { id: 'backend-setup', title: 'Backend Setup', icon: Code, category: 'Backend' },
    { id: 'api-gateway', title: 'API Gateway Configuration', icon: Cloud, category: 'Backend' },

    { id: 'database-design', title: 'Database Design', icon: Database, category: 'Database' },

    { id: 'data-ingestion', title: 'Data Ingestion Service', icon: Database, category: 'Services' },

    { id: 'apis', title: 'APIs', icon: Code, category: 'API Documentation' },

    { id: 'security', title: 'Security & Authentication', icon: Shield, category: 'Security' },

    { id: 'frontend-architecture', title: 'Frontend Architecture', icon: Code, category: 'Frontend' },

    { id: 'monitoring-observability', title: 'Monitoring & Observability', icon: Cloud, category: 'DevOps' },
    { id: 'deployment', title: 'Deployment', icon: Cloud, category: 'DevOps' },

    { id: 'admin-documentation', title: 'Admin Documentation', icon: Shield, category: 'Admin' },

    { id: 'maintenance-operation', title: 'Maintenance & Operation', icon: FileText, category: 'Operations' },

    { id: 'billing-subscription', title: 'Billing & Subscription', icon: FileText, category: 'Business' },

    { id: 'integrations-extensions', title: 'Integrations & Extensions', icon: Code, category: 'Integrations' },

    { id: 'future-scaling', title: 'Future & Scaling', icon: Layers, category: 'Strategy' },

    { id: 'implementation-guide', title: 'Implementation Guide', icon: FileText, category: 'Guides' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Custom');
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [todoLists, setTodoLists] = useState({});
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

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
Complete API reference for all platform services

## Authentication
\`\`\`
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
\`\`\`

## Base URL
\`https://api.example.com/v1\`

## Core Endpoints

### Users
- \`GET /users\` - List users
- \`POST /users\` - Create user
- \`GET /users/{id}\` - Get user details
- \`PUT /users/{id}\` - Update user
- \`DELETE /users/{id}\` - Delete user

### Resources
- \`GET /resources\` - List resources
- \`POST /resources\` - Create resource
- \`GET /resources/{id}\` - Get resource
- \`PUT /resources/{id}\` - Update resource
- \`DELETE /resources/{id}\` - Delete resource

## Rate Limiting
- **Standard**: 1000 requests/hour
- **Premium**: 5000 requests/hour
- **Enterprise**: Unlimited

## Error Handling
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional details"
  }
}
\`\`\`

## Webhooks
- User created
- User updated
- Resource created
- Resource deleted

## API Versioning
Currently on v1. v2 coming in Q2 2026.`
      },
      'frontend-architecture': {
        title: 'Frontend Architecture',
        content: `# Frontend Architecture

## Technology Stack
- **Framework**: React / Vue / Angular
- **Build Tool**: Vite / Webpack
- **State Management**: Redux / Vuex / Context API
- **UI Framework**: Tailwind CSS / Material UI
- **HTTP Client**: Axios / Fetch

## Project Structure
\`\`\`
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── styles/
│   └── utils/
├── public/
└── package.json
\`\`\`

## Component Architecture
- **Smart Components**: Container components handling logic
- **Dumb Components**: Presentational components for UI
- **Hooks**: Custom hooks for reusable logic

## State Management
- Global state for user, auth, notifications
- Local state for form data
- API caching strategy

## Routing
- Main routes
- Protected routes
- Admin routes
- Public routes

## Performance Optimization
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring

## Testing Strategy
- Unit tests with Jest/Vitest
- Integration tests
- E2E tests with Cypress/Playwright`
      },
      'monitoring-observability': {
        title: 'Monitoring & Observability',
        content: `# Monitoring & Observability

## Metrics Collection
- **Tool**: Prometheus / DataDog / New Relic
- **Interval**: Every 15 seconds

## Key Metrics
- CPU Usage
- Memory Usage
- Disk Usage
- Request Rate
- Error Rate
- Response Time

## Alerting Rules

### Critical Alerts
- Service down (p95 > 5s)
- Error rate > 1%
- Disk usage > 90%
- Memory > 85%

### Warning Alerts
- Error rate > 0.5%
- Response time > 1s
- CPU > 70%

## Dashboards

### Operations Dashboard
- Real-time system health
- Error rates
- Request volumes
- Performance metrics

### Business Dashboard
- Daily active users
- API calls
- Revenue
- Feature usage

## Logging Strategy
- **Tool**: ELK Stack / Splunk
- **Level**: DEBUG, INFO, WARN, ERROR
- **Retention**: 30 days hot, 1 year cold

## Tracing
- **Tool**: Jaeger / Zipkin
- **Sample Rate**: 10% in production`
      },
      'billing-subscription': {
        title: 'Billing & Subscription',
        content: `# Billing & Subscription

## Pricing Plans

### Starter (Free)
- **Price**: $0/month
- **Features**: Limited
- **Users**: 1
- **API Calls**: 1,000/month
- **Support**: Community

### Professional ($29)
- **Price**: $29/month
- **Features**: Full access
- **Users**: 5
- **API Calls**: 100,000/month
- **Support**: Email

### Enterprise (Custom)
- **Price**: Custom
- **Features**: All
- **Users**: Unlimited
- **API Calls**: Unlimited
- **Support**: 24/7 Phone + Email

## Billing Cycle
- Monthly: Charged on same date each month
- Annual: 20% discount
- No long-term commitment

## Payment Methods
- Credit/Debit Card
- Bank Transfer
- PayPal
- Wire Transfer

## Subscription Management
- Upgrade/Downgrade anytime
- Prorated charges
- Invoice history
- Automated receipts

## Usage Tracking
- Real-time usage dashboard
- Overage pricing: $0.01 per 100 API calls
- Alerts for approaching limits

## Cancellation Policy
- Cancel anytime
- No refunds for partial months
- Data retention: 30 days`
      },
      'integrations-extensions': {
        title: 'Integrations & Extensions',
        content: `# Integrations & Extensions

## Third-Party Integrations

### Authentication
- Google OAuth
- GitHub OAuth
- Microsoft SSO
- SAML 2.0

### Payment Processing
- Stripe
- PayPal
- Square

### Communication
- Slack
- Twilio (SMS)
- SendGrid (Email)

### Analytics
- Google Analytics
- Mixpanel
- Amplitude

## Extension Architecture

### Webhooks
- Event-driven system
- Retry logic
- Payload signing
- Rate limiting

### Plugins
- Plugin API
- Plugin marketplace
- Custom plugin development

## Developer Portal
- API documentation
- SDK libraries
- Code samples
- Interactive API explorer

## Integration Guides
- Step-by-step setup
- Authentication flows
- Error handling
- Best practices`
      },
      'admin-documentation': {
        title: 'Admin Documentation',
        content: `# Admin Documentation

## Admin Console Overview
Complete guide for system administrators

## User Management
- Create/edit/delete users
- Role assignment
- Permission management
- Bulk operations

## System Configuration
- API rate limiting
- Feature flags
- Email templates
- SMS templates
- Webhook endpoints

## Monitoring & Health
- System status dashboard
- Performance metrics
- Error logs
- Activity audit trail

## Backup & Recovery
- Daily automated backups
- Point-in-time recovery
- Disaster recovery plan
- Data export

## Security Settings
- IP whitelisting
- SSO configuration
- 2FA enforcement
- Session management

## Compliance
- GDPR settings
- Data retention policies
- Audit logs
- Compliance reports

## Support & Troubleshooting
- Common issues
- FAQs
- Support ticket system
- Emergency contacts`
      },
      'maintenance-operation': {
        title: 'Maintenance & Operation',
        content: `# Maintenance & Operation

## Regular Maintenance Tasks

### Daily
- Monitor error rates
- Check system health
- Review security alerts

### Weekly
- Database optimization
- Log rotation
- Backup verification

### Monthly
- Security patches
- Dependency updates
- Performance review
- Capacity planning

## Scheduled Maintenance
- **Maintenance Window**: Sunday 2-4 AM UTC
- **Communication**: 24-hour advance notice
- **Rollback Plan**: Always prepared

## Incident Response

### Severity Levels
- **Critical**: Service down
- **High**: Partial service degradation
- **Medium**: Non-critical feature broken
- **Low**: Minor bugs

### Response Times
- Critical: 15 minutes
- High: 1 hour
- Medium: 4 hours
- Low: 24 hours

### Postmortem Process
1. Incident report
2. Root cause analysis
3. Action items
4. Review with team

## Runbooks
- How to restart services
- How to handle database issues
- How to scale during peak load
- How to handle security incidents

## On-Call Schedule
- Weekly rotation
- On-call support
- Escalation procedures`
      },
      'future-scaling': {
        title: 'Future & Scaling',
        content: `# Future & Scaling

## Product Roadmap (2026-2027)

### H1 2026
- Mobile app launch
- Advanced analytics
- Custom integrations

### H2 2026
- AI-powered features
- Marketplace launch
- Enterprise features

### 2027
- Global expansion
- New product lines
- AI assistant

## Scaling Strategy

### Database Scaling
- Read replicas
- Sharding strategy
- Caching layer
- Archive strategy

### Application Scaling
- Horizontal scaling
- Load balancing
- Service mesh
- Circuit breakers

### Infrastructure Scaling
- Multi-region deployment
- CDN for static content
- DDoS protection
- Auto-scaling policies

## Performance Targets
- **Throughput**: 100K req/s
- **Latency**: <100ms p99
- **Availability**: 99.99%
- **Cost**: <\$10 per 1K requests

## Technology Upgrades
- Upgrade to latest Java/frameworks
- Migrate to new database versions
- Refactor legacy code
- Adopt new patterns

## Team Growth
- Hire 5 backend engineers
- Hire 3 frontend engineers
- Hire 2 DevOps engineers
- Hire QA engineers`
      },
      'code-standards': {
        title: 'Code Guidelines & Standards',
        content: `# Code Guidelines & Standards

## Naming Conventions
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case (frontend), PascalCase (backend classes)

## Code Style

### Java
- 2-space indentation
- 120 character line limit
- Google Java Style Guide

### JavaScript/React
- Airbnb JavaScript Style Guide
- 2-space indentation
- ESLint + Prettier

## Documentation Standards

### Comments
- Explain WHY, not WHAT
- Use JSDoc for functions
- Keep comments updated

### Commit Messages
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

Types: feat, fix, docs, style, refactor, test, chore

## Testing Standards

### Code Coverage
- Minimum 80% coverage
- Critical paths 100%
- Utilities 85%

### Test Types
- Unit tests
- Integration tests
- E2E tests
- Performance tests

## Performance Guidelines
- Database queries < 100ms
- API responses < 500ms
- Page loads < 2s
- Bundle size < 100KB gzipped

## Security Checklist
- No hardcoded secrets
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF tokens
- Rate limiting
- Logging sensitive data carefully

## Code Review Process
1. Create PR with detailed description
2. Minimum 2 approvals
3. CI/CD must pass
4. No conflicts with main
5. Merge and deploy`
      },
      'overview': {
        title: 'Architecture Overview',
        content: `# Architecture Overview

## Executive Summary
Enterprise-grade, cloud-native SaaS platform built with Java 17 and Spring Boot 3.x

## Core Technology Stack

### Backend Framework
- **Java 17 LTS** - Latest stable JDK
- **Spring Boot 3.2** - Microservices foundation
- **Spring Cloud** - Distributed system patterns
- **Spring Data JPA** - ORM and database access
- ** etc

### API & Communication
- **Spring Web MVC** - RESTful API development
- **Spring WebFlux** - Reactive programming (async I/O)
- **gRPC** - High-performance service-to-service communication
- **OpenAPI 3.0** - API documentation (Springdoc)

### Message Queue & Event Streaming
- **Apache Kafka** - Event-driven architecture
- **Spring Kafka** - Kafka integration
- **RabbitMQ** (optional) - Distributed messaging

### Data Layer
- **PostgreSQL** - Primary operational database
- **MongoDB** - NoSQL analytics storage
- **Redis** - Distributed caching & sessions
- **Elasticsearch** - Full-text search & analytics

### Security
- **Spring Security** - Authentication & authorization
- **OAuth 2.0 & OpenID Connect** - SSO integration
- **JWT** - Token-based security
- **Spring Vault** - Secrets management

### Observability
- **Micrometer + Prometheus** - Metrics collection
- **ELK Stack** - Logging (Elasticsearch, Logstash, Kibana)
- **Distributed Tracing** - Spring Cloud Sleuth + Jaeger
- **Health Checks** - Spring Boot Actuator

## Microservices Architecture

### Service Topology
1. **API Gateway** (Spring Cloud Gateway)
2. **Auth Service** (Spring Security)
3. **Data Ingestion Service**
4. **Migration Analytics Service**
5. **Child Welfare Service**
6. **Notification Service**
7. **Tenant Management Service**

## Development Lifecycle
- **Build Tool**: Maven with custom plugins
- **Testing**: JUnit 5, Mockito, TestContainers
- **CI/CD**: GitHub Actions + ArgoCD
- **Container**: Docker + Kubernetes
- **Package Manager**: Nexus Repository`
      },
      'custom-architecture': {
        title: 'Custom Architecture Template',
        content: `# Your Custom Architecture - Editable Template

This is a blank template for you to document your own architecture. Edit this section to add your specific system design, technologies, and infrastructure details.

## Project Name
*Enter your project name here*

## Executive Summary
*Provide a high-level overview of your system. What does it do? What problems does it solve?*

## Technology Stack

### Backend
- Language: *e.g., Java 17, Python 3.11, Go 1.21*
- Framework: *e.g., Spring Boot, Django, Echo*
- Version: *specify version*

### Frontend (if applicable)
- Framework: *e.g., React, Vue, Angular*
- UI Library: *e.g., Tailwind CSS, Material UI*

### Database
- Primary Database: *e.g., PostgreSQL, MySQL, MongoDB*
- Cache Layer: *e.g., Redis, Memcached*
- Search Engine: *e.g., Elasticsearch, Solr*

### Message Queue & Events
- Message Broker: *e.g., Apache Kafka, RabbitMQ, AWS SQS*
- Event Processing: *describe real-time processing needs*

### Infrastructure & DevOps
- Container: *e.g., Docker, Podman*
- Orchestration: *e.g., Kubernetes, Docker Swarm*
- CI/CD: *e.g., GitHub Actions, GitLab CI, Jenkins*
- Cloud Provider: *e.g., AWS, Azure, GCP*

### Monitoring & Observability
- Metrics: *e.g., Prometheus, DataDog*
- Logging: *e.g., ELK Stack, Splunk*
- Tracing: *e.g., Jaeger, Zipkin*
- APM: *e.g., New Relic, Elastic APM*

## System Components

### Core Services
1. **Service Name**: 
   - Purpose: *What does it do?*
   - Port: *e.g., 8080*
   - Database: *which database it uses*

2. **Service Name**: 
   - Purpose: 
   - Port:
   - Database:

### Supporting Services
- *List any auxiliary services, schedulers, workers*

## Database Schema

### Key Entities
- Entity 1: *Describe what it stores*
- Entity 2: *Describe what it stores*
- Entity 3: *Describe what it stores*

### Relationships
*Describe how entities relate to each other (one-to-one, one-to-many, many-to-many)*

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Core Endpoints
- *List your main API endpoints with methods and purposes*
- GET /api/resource
- POST /api/resource
- PUT /api/resource/{id}
- DELETE /api/resource/{id}

## Security Design

### Authentication Method
*e.g., OAuth 2.0, JWT, Session-based, API Keys*

### Authorization
*How do you control access? RBAC, ABAC, custom?*

### Data Protection
- At Rest: *e.g., AES-256 encryption*
- In Transit: *e.g., TLS 1.3*
- Sensitive Data Handling: *PII masking, encryption strategy*

## Deployment Architecture

### Development Environment
*How developers set up locally*

### Staging Environment
*Pre-production testing setup*

### Production Environment
- **Deployment Strategy**: *Rolling, Blue-Green, Canary*
- **High Availability**: *Multi-region, load balancing*
- **Backup Strategy**: *Backup frequency and retention*
- **Disaster Recovery**: *RTO, RPO targets*

## Performance Targets

- **Throughput**: *e.g., 10,000 requests/second*
- **Latency**: *e.g., <200ms p95*
- **Availability SLA**: *e.g., 99.95%*
- **Database**: *Max query time, cache hit ratio*

## Scaling Strategy

### Horizontal Scaling
*Which components scale horizontally? Auto-scaling triggers?*

### Vertical Scaling
*Which components need vertical scaling?*

## Monitoring & Alerting

### Key Metrics to Monitor
1. *Metric name*
2. *Metric name*
3. *Metric name*

### Alert Thresholds
- High CPU: *e.g., >80%*
- High Memory: *e.g., >85%*
- Error Rate: *e.g., >1%*
- Response Time: *e.g., >500ms*

## Development Workflow

### Git Strategy
*e.g., Git Flow, GitHub Flow*

### Testing Strategy
- Unit Tests: *coverage target*
- Integration Tests: *scope*
- Load Tests: *frequency and targets*

### Code Quality
- Linting: *which linter*
- Static Analysis: *e.g., SonarQube*
- Code Review: *process*

## Known Limitations & Future Improvements

### Current Limitations
1. *Limitation 1*
2. *Limitation 2*

### Planned Improvements
1. *Future enhancement*
2. *Optimization planned*

## Support & Contacts

- **Tech Lead**: *Name and contact*
- **DevOps Lead**: *Name and contact*
- **On-Call**: *How to escalate issues*

---

**Last Updated**: *Date*
**Version**: *Architecture version*
**Owner**: *Team/Person responsible*
 > 💡 **Tip**: Edit this document to match your specific architecture. Save changes to download as Markdown.`

      },
      'backend-setup': {
        title: 'Backend Setup',
        content: `# Backend Setup

## Project Structure
\`\`\`
aadhaar-analytics/
├── pom.xml
├── src/main/java/com/
│   ├── AnalyticsApplication.etc
│   ├── config/
│   │   ├── SecurityConfig.etc
│   │   ├── KafkaConfig.etc
│   │   └── DatabaseConfig.etc
│   ├── service/
│   ├── controller/
│   ├── entity/
│   └── exception/
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/
└── src/test/../
\`\`\`

## Maven Configuration (pom.xml)

\`\`\`xml
<properties>
  <etc.version>17</java.version>
  <etc.version>3.2.0</spring-boot.version>
  <etc.version>2023.0.0</spring-cloud.version>
</properties>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>\${spring-boot.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>\${spring-cloud.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
\`\`\`

## Application Configuration (application.yml)

\`\`\`yaml
spring:
  application:
    name: aadhaar-analytics
  profiles:
    active: dev
  
  datasource:
    url: jdbc:postgresql://localhost:5432/aadhaar_db
    username: postgres
    password: \${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: aadhaar-group
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer

server:
  port: 8080
  servlet:
    context-path: /api/v1

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
\`\`\`

## Main Application Class

\`\`\`java
package com.aadhaar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableDiscoveryClient
@EnableKafka
public class AadhaarAnalyticsApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AadhaarAnalyticsApplication.class, args);
    }
}
\`\`\`

## Key Dependencies

\`\`\`xml
<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Cloud -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!-- Database & ORM -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<!-- Messaging -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>

<!-- Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.0</version>
    <scope>test</scope>
</dependency>
\`\`\`
`
      },
      'data-ingestion': {
        title: 'Data Ingestion Service',
        content: `# Data Ingestion Service

## Service Architecture

\`\`\`
DataIngestionService (Port: 8081)
├── REST Controller: /api/v1/ingest
├── Service Layer: DataIngestionService
├── Repository Layer: EnrolmentRepository
├── Entity Models: Enrolment, Dataset
└── Kafka Producer: IngestionEventProducer
\`\`\`

## Spring Boot Controller

\`\`\`java
package com.aadhaar.ingest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.aadhaar.ingest.service.DataIngestionService;
import com.aadhaar.ingest.dto.IngestionResponse;

@RestController
@RequestMapping("/api/v1/ingest")
@CrossOrigin(origins = "*")
public class DataIngestionController {
    
    @Autowired
    private DataIngestionService ingestionService;
    
    @PostMapping("/csv")
    public ResponseEntity<IngestionResponse> uploadCSV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("dataset_type") String datasetType,
            @RequestHeader("X-Tenant-ID") String tenantId) {
        
        IngestionResponse response = ingestionService.processCSV(file, datasetType, tenantId);
        return ResponseEntity.accepted().body(response);
    }
    
    @GetMapping("/status/{jobId}")
    public ResponseEntity<?> getJobStatus(
            @PathVariable String jobId,
            @RequestHeader("X-Tenant-ID") String tenantId) {
        
        return ResponseEntity.ok(ingestionService.getJobStatus(jobId, tenantId));
    }
    
    @PostMapping("/stream")
    public ResponseEntity<IngestionResponse> streamData(
            @RequestBody StreamDataRequest request,
            @RequestHeader("X-Tenant-ID") String tenantId) {
        
        IngestionResponse response = ingestionService.processStreamData(request, tenantId);
        return ResponseEntity.accepted().body(response);
    }
}
\`\`\`

## Service Layer Implementation

\`\`\`java
package com.aadhaar.ingest.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.aadhaar.ingest.entity.Dataset;
import com.aadhaar.ingest.repository.DatasetRepository;
import lombok.extern.slf4j.Slf4j;
import java.util.UUID;

@Slf4j
@Service
public class DataIngestionService {
    
    private final DatasetRepository datasetRepository;
    private final KafkaTemplate<String, IngestionEvent> kafkaTemplate;
    private final CSVProcessorService csvProcessor;
    
    @Transactional
    public IngestionResponse processCSV(MultipartFile file, String type, String tenantId) {
        String jobId = UUID.randomUUID().toString();
        
        try {
            // Validate file
            validateFile(file);
            
            // Save metadata
            Dataset dataset = new Dataset();
            dataset.setJobId(jobId);
            dataset.setTenantId(tenantId);
            dataset.setDatasetType(DatasetType.valueOf(type));
            dataset.setStatus(JobStatus.PROCESSING);
            dataset.setFileName(file.getOriginalFilename());
            datasetRepository.save(dataset);
            
            // Parse and process CSV asynchronously
            processCSVAsync(file, jobId, tenantId);
            
            return new IngestionResponse(jobId, JobStatus.PROCESSING);
            
        } catch (Exception e) {
            log.error("Error processing CSV for tenant: {}", tenantId, e);
            throw new IngestionException("CSV processing failed", e);
        }
    }
    
    private void processCSVAsync(MultipartFile file, String jobId, String tenantId) {
        // Send to Kafka for async processing
        IngestionEvent event = new IngestionEvent(jobId, tenantId, file.getBytes());
        kafkaTemplate.send("ingest-topic", event);
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (!file.getContentType().contains("csv")) {
            throw new IllegalArgumentException("Only CSV files are supported");
        }
    }
}
\`\`\`

## JPA Entity

\`\`\`java
package com.aadhaar.ingest.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasets", indexes = {
    @Index(name = "idx_job_id", columnList = "job_id"),
    @Index(name = "idx_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
public class Dataset {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String jobId;
    
    @Column(nullable = false)
    private String tenantId;
    
    @Enumerated(EnumType.STRING)
    private DatasetType datasetType;
    
    @Enumerated(EnumType.STRING)
    private JobStatus status;
    
    private String fileName;
    private Long recordCount;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
\`\`\`

## Kafka Configuration

\`\`\`java
package com.aadhaar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

@Configuration
public class KafkaConfig {
    
    @Bean
    public KafkaTemplate<String, IngestionEvent> kafkaTemplate(
            ProducerFactory<String, IngestionEvent> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
}
\`\`\`
`
      },
      'migration-analytics': {
        title: 'Migration Analytics Service',
        content: `# Migration Analytics Microservice

## Overview
Analyzes migration patterns using demographic update data with real-time processing.

## Service Implementation

\`\`\`java
package com.aadhaar.analytics.service;

import org.springframework.stereotype.Service;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.data.domain.PageRequest;
import com.aadhaar.analytics.entity.MigrationAnalytic;
import com.aadhaar.analytics.repository.MigrationAnalyticsRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MigrationAnalyticsService {
    
    private final MigrationAnalyticsRepository analyticsRepository;
    private final KafkaTemplate<String, AnalyticsEvent> kafkaTemplate;
    
    /**
     * Kafka listener for demographic update events
     */
    @KafkaListener(topics = "demographic-updates", groupId = "analytics-group")
    public void processDemographicUpdate(DemographicEvent event) {
        try {
            String district = event.getDistrict();
            int age = event.getAge();
            
            // Calculate migration intensity
            double intensity = calculateMigrationIntensity(district, age);
            
            // Update analytics
            MigrationAnalytic analytic = getOrCreateAnalytic(district);
            analytic.setMigrationIntensity(intensity);
            analytic.incrementDemographicUpdates();
            analyticsRepository.save(analytic);
            
            // Publish alert if threshold exceeded
            if (intensity > 1000) {
                publishAlert(district, "EXTREME", intensity);
            }
            
        } catch (Exception e) {
            log.error("Error processing demographic update", e);
        }
    }
    
    public double calculateMigrationIntensity(String district, int ageGroup) {
        // Formula: demographic_updates_18+ / (new_enrolments_18+ + 1)
        long demographicUpdates = analyticsRepository.countDemographicUpdates(district, ageGroup);
        long newEnrolments = analyticsRepository.countNewEnrolments(district, ageGroup);
        
        return (double) demographicUpdates / (newEnrolments + 1);
    }
    
    public List<MigrationAnalytic> getHotspots(String tenantId) {
        return analyticsRepository.findHotspots(tenantId, PageRequest.of(0, 20));
    }
}
\`\`\`

## JPA Repository with Custom Queries

\`\`\`java
package com.aadhaar.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MigrationAnalyticsRepository extends JpaRepository<MigrationAnalytic, String> {
    
    @Query("SELECT m FROM MigrationAnalytic m WHERE m.migrationIntensity > 100 " +
           "ORDER BY m.migrationIntensity DESC")
    List<MigrationAnalytic> findHotspots(String tenantId, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM DemographicUpdate d " +
           "WHERE d.district = :district AND d.age >= 18")
    long countDemographicUpdates(@Param("district") String district, 
                                 @Param("ageGroup") int ageGroup);
}
\`\`\`

## REST Controller

\`\`\`java
@RestController
@RequestMapping("/api/v1/migration")
public class MigrationAnalyticsController {
    
    @GetMapping("/hotspots")
    public ResponseEntity<List<MigrationAnalytic>> getHotspots(
            @RequestHeader("X-Tenant-ID") String tenantId) {
        return ResponseEntity.ok(analyticsService.getHotspots(tenantId));
    }
    
    @GetMapping("/intensity/{district}")
    public ResponseEntity<Double> getIntensity(
            @PathVariable String district,
            @RequestHeader("X-Tenant-ID") String tenantId) {
        double intensity = analyticsService.calculateMigrationIntensity(district, 18);
        return ResponseEntity.ok(intensity);
    }
}
\`\`\`

## Intensity Categories
- **EXTREME**: > 1000 (Critical hotspot, immediate intervention)
- **HIGH**: 100-1000 (Significant migration activity)
- **MODERATE**: 10-100 (Notable patterns)
- **LOW**: 0-10 (Stable population)
`
      },
      'child-welfare': {
        title: 'Child Welfare Service',
        content: `# Child Welfare Analytics Microservice

## Purpose
Track biometric update compliance for children aged 5-17.

## Service Logic

\`\`\`java
@Service
@Slf4j
public class ChildWelfareService {
    
    @KafkaListener(topics = "biometric-updates", groupId = "welfare-group")
    public void processBiometricUpdate(BiometricEvent event) {
        String district = event.getDistrict();
        int age = event.getAge();
        
        if (age >= 5 && age <= 17) {
            ChildWelfareMetric metric = getOrCreateMetric(district);
            metric.incrementBiometricUpdates();
            
            double compliance = calculateCompliance(district);
            metric.setComplianceRatio(compliance);
            
            // Check risk level and trigger alerts
            if (compliance < 0.30) {
                publishAlert(district, "CRITICAL", compliance);
            }
        }
    }
    
    private double calculateCompliance(String district) {
        long biometricUpdates = getCountBiometricUpdates5_17(district);
        long totalEnrolments = getTotalEnrolments5_17(district);
        return (double) biometricUpdates / (totalEnrolments + 1);
    }
}
\`\`\`

## Compliance Risk Levels
- **CRITICAL**: 0-30% (Immediate intervention required)
- **HIGH**: 30-50% (Urgent action needed)
- **MODERATE**: 50-70% (Monitoring required)
- **LOW**: 70-100% (Healthy compliance)
`
      },
      'api-gateway': {
        title: 'API Gateway Configuration',
        content: `# API Gateway Configuration

## Configuration (application.yml)

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: ingest-service
          uri: lb://ingest-service
          predicates:
            - Path=/api/v1/ingest/**
          filters:
            - name: AuthFilter
            - name: RateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
        
        - id: analytics-service
          uri: lb://analytics-service
          predicates:
            - Path=/api/v1/migration/**,/api/v1/analytics/**
          filters:
            - name: AuthFilter
            - name: CircuitBreaker
              args:
                name: analyticsCircuitBreaker
      
      default-filters:
        - name: RequestLogging
        - name: ResponseLogging
        - name: TenantValidation
\`\`\`

## Custom Filter Implementation

\`\`\`java
@Component
@Order(1)
public class AuthenticationFilter extends AbstractNameValueGatewayFilterFactory<Config> {
    
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return handleError(exchange, "Missing or invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            
            try {
                Claims claims = validateToken(token);
                exchange.getRequest().mutate()
                    .header("X-User-ID", claims.getSubject())
                    .header("X-Tenant-ID", claims.get("tenant_id").toString())
                    .build();
                    
                return chain.filter(exchange);
                
            } catch (ExpiredJwtException e) {
                return handleError(exchange, "Token expired");
            }
        };
    }
}
\`\`\`

## Service Discovery Integration

\`\`\`java
@Configuration
@EnableDiscoveryClient
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("ingest", r -> r
                .path("/api/v1/ingest/**")
                .uri("lb://ingest-service"))
            .route("analytics", r -> r
                .path("/api/v1/analytics/**")
                .uri("lb://analytics-service"))
            .build();
    }
}
\`\`\`
`
      },
      'database-design': {
        title: 'Database Design',
        content: `# Database Design

## Flyway Migration V1.0 (V1_0__init_schema.sql)

\`\`\`sql
-- Tenants table (Multi-tenancy)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrolment data
CREATE TABLE enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    aadhaar_number VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    age INT,
    age_group VARCHAR(50),
    district VARCHAR(100),
    state VARCHAR(100),
    enrolment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tenant FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_enrolment_tenant ON enrolments(tenant_id);
CREATE INDEX idx_enrolment_district ON enrolments(district);
CREATE INDEX idx_enrolment_age_group ON enrolments(age_group);

-- Demographic updates
CREATE TABLE demographic_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    enrolment_id UUID REFERENCES enrolments(id),
    age_before INT,
    age_after INT,
    address_change BOOLEAN,
    update_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Biometric updates
CREATE TABLE biometric_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    enrolment_id UUID REFERENCES enrolments(id),
    biometric_type VARCHAR(50),
    update_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration analytics table
CREATE TABLE migration_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    district VARCHAR(100),
    migration_intensity DECIMAL(10,2),
    demographic_updates INT DEFAULT 0,
    new_enrolments INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_migration_intensity ON migration_analytics(migration_intensity DESC);
CREATE INDEX idx_migration_district ON migration_analytics(district);

-- Child welfare metrics
CREATE TABLE child_welfare_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    district VARCHAR(100),
    compliance_ratio DECIMAL(5,2),
    biometric_updates_5_17 INT DEFAULT 0,
    total_enrolments_5_17 INT DEFAULT 0,
    risk_level VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id VARCHAR(255),
    action VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id UUID,
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Database Configuration (Spring Boot)

\`\`\`java
@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }
    
    @Bean
    public HikariDataSource dataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = properties.initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();
        
        dataSource.setMaximumPoolSize(20);
        dataSource.setMinimumIdle(5);
        dataSource.setConnectionTimeout(30000);
        dataSource.setIdleTimeout(600000);
        
        return dataSource;
    }
}
\`\`\`
`
      },
      'security': {
        title: 'Security & Authentication',
        content: `# Security & Authentication

## Spring Security Configuration

\`\`\`java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            .and()
            .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(jwtAuthenticationConverter());
        
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }
}
\`\`\`

## JWT Token Generation

\`\`\`java
@Service
public class JwtTokenProvider {
    
    private static final long JWT_EXPIRATION_MS = 3600000; // 1 hour
    
    @Value("\${jwt.secret}")
    private String jwtSecret;
    
    public String generateToken(String userId, String tenantId, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tenant_id", tenantId);
        claims.put("roles", roles);
        
        return Jwts.builder()
            .setSubject(userId)
            .addClaims(claims)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public Claims validateAndParseClaims(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token is expired");
        } catch (SignatureException e) {
            throw new InvalidTokenException("Invalid JWT signature");
        }
    }
}
\`\`\`

## Data Encryption

\`\`\`java
@Component
public class EncryptionService {
    
    private static final String ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    
    public String encrypt(String plainText, String encryptionKey) throws Exception {
        SecretKey key = new SecretKeySpec(
            encryptionKey.getBytes(), 0, 32, "AES");
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        
        byte[] encryptedData = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedData);
    }
    
    public String decrypt(String encryptedText, String encryptionKey) throws Exception {
        SecretKey key = new SecretKeySpec(
            encryptionKey.getBytes(), 0, 32, "AES");
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        
        byte[] decodedData = Base64.getDecoder().decode(encryptedText);
        byte[] decryptedData = cipher.doFinal(decodedData);
        return new String(decryptedData);
    }
}
\`\`\`

## Multi-tenant Data Isolation

\`\`\`java
@Component
public class TenantFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) {
        String tenantId = request.getHeader("X-Tenant-ID");
        
        if (tenantId != null && !tenantId.isEmpty()) {
            TenantContext.setTenantId(tenantId);
        }
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}

@Component
public class TenantAwareRepositoryImpl {
    
    @Bean
    public FilteringPredicate tenantFilter() {
        return (root, query, cb) -> {
            String tenantId = TenantContext.getTenantId();
            return cb.equal(root.get("tenantId"), tenantId);
        };
    }
}
\`\`\`
`
      },
      'deployment': {
        title: 'Deployment',
        content: `# Deployment

## Dockerfile for Spring Boot Application

\`\`\`dockerfile
# Multi-stage build
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR from builder
COPY --from=builder /build/target/*.jar application.jar

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run application with JVM optimizations
ENTRYPOINT ["java", "-Xms512m", "-Xmx1024m", "-XX:+UseG1GC", "-jar", "application.jar"]
\`\`\`

## Kubernetes Deployment (K8s YAML)

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aadhaar-platform

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingest-service
  namespace: aadhaar-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ingest-service
  template:
    metadata:
      labels:
        app: ingest-service
    spec:
      containers:
      - name: ingest-service
        image: aadhaar-platform/ingest-service:1.0.0
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database-url
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1024Mi
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8081
          initialDelaySeconds: 20
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: ingest-service
  namespace: aadhaar-platform
spec:
  selector:
    app: ingest-service
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8081

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ingest-service-hpa
  namespace: aadhaar-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ingest-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

## Docker Compose (Local Development)

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: aadhaar_db
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    ports:
      - "9092:9092"

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  ingest-service:
    build:
      context: ./ingest-service
      dockerfile: Dockerfile
    depends_on:
      - postgres
      - kafka
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/aadhaar_db
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
    ports:
      - "8081:8081"

volumes:
  postgres_data:
\`\`\`
`
      },
      'implementation-guide': {
        title: 'Implementation Guide',
        content: `# Implementation Guide

## Phase 1: Foundation (Weeks 1-3)

### Week 1: Infrastructure Setup
- [ ] Set up AWS/Azure cloud accounts
- [ ] Configure VPC, security groups, load balancers
- [ ] Deploy PostgreSQL RDS with Multi-AZ
- [ ] Set up RDS backups and monitoring
- [ ] Deploy Kafka cluster (3 brokers minimum)
- [ ] Configure Redis cluster
- [ ] Set up Prometheus + Grafana monitoring
- [ ] Configure CloudWatch / Application Insights

**Deliverable**: Cloud infrastructure with all databases operational

### Week 2: Java Project Scaffolding
- [ ] Create parent POM with dependency management
- [ ] Set up Maven plugins (Shade, Surefire, Checkstyle)
- [ ] Configure SonarQube for code quality
- [ ] Set up Git workflows (main, develop, feature branches)
- [ ] Create shared models/DTOs library
- [ ] Set up integration test infrastructure (TestContainers)
- [ ] Configure CI/CD with GitHub Actions

**Deliverable**: Maven project structure with CI/CD pipeline

### Week 3: API Gateway & Authentication
- [ ] Implement Spring Cloud Gateway
- [ ] Set up OAuth 2.0 / OpenID Connect
- [ ] Implement JWT token provider
- [ ] Create authentication service with Spring Security
- [ ] Set up API documentation (Springdoc OpenAPI)
- [ ] Implement request logging and tracing

**Deliverable**: Secured API Gateway with authentication

## Phase 2: Core Microservices (Weeks 4-8)

### Week 4-5: Data Ingestion Service
- [ ] Create REST endpoints for CSV upload
- [ ] Implement multipart file handling
- [ ] Create Kafka producer for data events
- [ ] Implement validation and error handling
- [ ] Create database schema for raw data
- [ ] Implement async processing with Spring Kafka
- [ ] Add comprehensive unit and integration tests

**Deliverable**: Fully functional Data Ingestion service

### Week 6-7: Analytics Services
- [ ] Implement Migration Analytics Service
  - Kafka listeners for demographic events
  - Migration intensity calculations
  - Real-time hotspot detection
- [ ] Implement Child Welfare Service
  - Biometric compliance tracking
  - Risk level calculations
  - Alert generation
- [ ] Create REST endpoints for analytics queries
- [ ] Implement caching with Redis
- [ ] Add metrics and observability

**Deliverable**: Analytics services with real-time processing

### Week 8: Supporting Services
- [ ] Create Tenant Management Service
- [ ] Implement Notification/Alert Service
- [ ] Create Admin/Configuration Service
- [ ] Set up inter-service communication patterns
- [ ] Implement circuit breakers (Resilience4j)
- [ ] Add health checks and readiness probes

**Deliverable**: Complete microservice ecosystem

## Phase 3: Data & Quality (Weeks 9-10)

### Week 9: Database Optimization
- [ ] Create performance indexes
- [ ] Implement query optimization
- [ ] Set up connection pooling (HikariCP)
- [ ] Create database migration strategy (Flyway)
- [ ] Implement backup and disaster recovery
- [ ] Load testing with JMeter

**Deliverable**: Optimized database with HA setup

### Week 10: Testing & Quality Assurance
- [ ] Unit test coverage (JUnit 5, Mockito)
- [ ] Integration tests (TestContainers)
- [ ] Performance testing (load, stress, spike tests)
- [ ] Security scanning (OWASP, SonarQube)
- [ ] Penetration testing
- [ ] Code review and cleanup

**Deliverable**: 80%+ code coverage, security certified

## Phase 4: Production Ready (Weeks 11-12)

### Week 11: Containerization & Orchestration
- [ ] Create Dockerfiles for all services
- [ ] Build Docker images and push to registry
- [ ] Create Kubernetes manifests
  - Deployments with replicas
  - Services and Ingress
  - ConfigMaps and Secrets
  - PersistentVolumes
  - StatefulSets for stateful services
- [ ] Set up Helm charts for easy deployment
- [ ] Configure auto-scaling policies

**Deliverable**: Production-ready K8s cluster

### Week 12: Go-Live Preparation
- [ ] Data migration from monolith
- [ ] Performance tuning and optimization
- [ ] Disaster recovery testing
- [ ] Runbook documentation
- [ ] On-call training and handover
- [ ] Production deployment and monitoring
- [ ] Post-deployment validation

**Deliverable**: Live production system with SLAs

## Success Criteria
- ✅ 99.95% uptime SLA
- ✅ <200ms API response time (p95)
- ✅ 10x throughput of legacy system
- ✅ Automatic horizontal scaling
- ✅ Complete audit trails
- ✅ Zero-downtime deployments
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
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Project Documentation</h1>
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
            <p className="text-blue-100 text-sm">Text Complete Architecture Hub</p>
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
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">📝 Small Notes</h3>
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
                  © Design by <strong>Manish Kumar With Ai</strong>
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
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Project Overview</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    Welcome to the <strong>Documentation Hub</strong>, a high-performance workspace designed by <strong>Manish Kumar</strong>. This platform allows teams to build, organize, and manage complex architecture guides with a premium, user-friendly interface.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Plus className="w-4 h-4 text-blue-500" />
                      Creation
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Instantly create new documents by clicking the <strong>"Add New Document"</strong> button. Each doc is slug-optimized and automatically categorized.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      Organization
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Use the <strong>Category System</strong> to group documents. Visual icons and color-coded dots maintain a clean hierarchy in your sidebar.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Optimization
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      The <strong>"Small Notes"</strong> feature allows you to attach context-specific insights (max 50 words) to any documentation entry.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <Download className="w-4 h-4 text-emerald-500" />
                      Portability
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Export your work as production-ready <strong>Markdown (.md)</strong> files with a single click using the Download feature.
                    </p>
                  </div>
                </div>

                <section className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Developed with Passion</h3>
                    <p className="text-blue-100 text-sm leading-relaxed opacity-90 italic">
                      "This hub was built to solve the complexity of software documentation, making it beautiful and accessible for every developer."
                    </p>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest">— Manish Kumar</p>
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
                    ⚠️ <strong>Warning:</strong> This action cannot be undone.
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
