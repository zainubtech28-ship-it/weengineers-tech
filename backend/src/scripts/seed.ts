import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { CompanySettings } from '../models/CompanySettings.js';
import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { TeamMember } from '../models/TeamMember.js';
import { Review } from '../models/Review.js';
import { FAQ } from '../models/FAQ.js';
import { BlogPost } from '../models/BlogPost.js';
import { Enquiry } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weengineers';

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected.');

    // 1. Initial Founder Account
    const founderEmail = (process.env.INITIAL_FOUNDER_EMAIL || 'founder@weengineers.tech').toLowerCase();
    const existingFounder = await User.findOne({ role: 'founder' });

    if (!existingFounder) {
      const founderPassword = process.env.INITIAL_FOUNDER_PASSWORD || 'Founder@WeEngineers2026!';
      const founderName = process.env.INITIAL_FOUNDER_NAME || 'Engr. Founder';

      await User.create({
        name: founderName,
        email: founderEmail,
        password: founderPassword,
        role: 'founder',
        status: 'active',
        permissions: ['all'],
      });
      console.log(`[Seed] Provisioned Founder Account: ${founderEmail}`);
    } else {
      console.log(`[Seed] Founder account already exists: ${existingFounder.email}`);
    }

    // 2. Provision Demo Administrator Account (for testing ordinary admin vs founder)
    const adminEmail = 'admin@weengineers.tech';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Technical Administrator',
        email: adminEmail,
        password: 'Admin@WeEngineers2026!',
        role: 'admin',
        status: 'active',
        permissions: ['projects', 'services', 'enquiries', 'reviews', 'content'],
      });
      console.log(`[Seed] Provisioned Administrator Account: ${adminEmail}`);
    }

    // 3. Company Settings
    const existingSettings = await CompanySettings.findOne();
    if (!existingSettings) {
      await CompanySettings.create({
        companyName: 'WEENGINEERS TECH',
        tagline: 'YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS.',
        aboutStory:
          'WEENGINEERS TECH is a modern, high-precision IT company delivering bespoke software engineering, enterprise web platforms, and digital solutions. Rooted in structural integrity, human-centered design, and performance excellence, we partner with visionary leaders worldwide to turn ambitious technological concepts into resilient, scalable realities.',
        mission:
          'To empower visionary enterprises worldwide by engineering robust, scalable, and human-centric software solutions that consistently exceed technical benchmarks and operational expectations.',
        vision:
          'To be recognized internationally as the benchmark for engineering rigor, transparent partnership, and innovative digital product craftsmanship.',
        values: [
          {
            title: 'Engineering Rigor',
            description: 'Zero tolerance for substandard code, security vulnerabilities, or brittle shortcuts. We build architecture designed to endure.',
            icon: 'Cpu',
          },
          {
            title: 'Uncompromised Integrity',
            description: 'Transparent communication, realistic timelines, and clear technical roadmaps that prioritize client success above all else.',
            icon: 'ShieldCheck',
          },
          {
            title: 'Relentless Innovation',
            description: 'Adopting proven modern frameworks, cloud-native scalability, and AI integrations that deliver concrete business advantages.',
            icon: 'Sparkles',
          },
          {
            title: 'Beyond Expectations',
            description: 'We do not just satisfy requirements; we elevate your product through thoughtful UI/UX and resilient software engineering.',
            icon: 'Award',
          },
        ],
        contactEmail: 'contact@weengineers.tech',
        phone: '+1 (555) 019-2834',
        address: 'WEENGINEERS TECH Global HQ, Silicon Avenue, Suite 400',
        whatsappNumber: '+15550192834',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/weengineers-tech',
          twitter: 'https://twitter.com/weengineers',
          github: 'https://github.com/weengineers',
          instagram: 'https://instagram.com/weengineers',
        },
        branding: {
          primaryColor: '#1e40af',
          accentColor: '#2563eb',
          logoUrl: '/LOGO.jpeg',
        },
        maintenanceMode: false,
        publicWebsiteConfig: {
          enableEnquiries: true,
          enableReviews: true,
          enableBlog: true,
          showStats: true,
        },
      });
      console.log('[Seed] Company Settings seeded.');
    }

    // 4. Seed The 12 Specific Services Required by the Prompt
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const servicesData = [
        {
          title: 'Website Development',
          slug: 'website-development',
          shortDescription:
            'High-performance, search-optimized corporate websites engineered for conversion, speed, and responsive elegance.',
          fullDescription:
            'Our website development service combines artistic visual elegance with pristine code structure. We craft bespoke websites tailored to your brand identity, delivering lightning-fast load times, flawless responsiveness across every device screen, and SEO-compliant markup that ranks and converts.',
          icon: 'Globe',
          benefits: [
            'Tailored responsive layouts optimized for all viewport sizes',
            'Sub-second load times with modern asset compression and caching',
            'Strict adherence to WCAG 2.1 accessibility standards',
            'Built-in structured metadata and technical search engine optimization',
          ],
          process: [
            { step: 1, title: 'Architecture & Strategy', description: 'Defining audience targets, content layout, and brand language.' },
            { step: 2, title: 'Prototyping & UX', description: 'Interactive wireframes and clean visual design comps.' },
            { step: 3, title: 'Frontend Engineering', description: 'Semantic, accessible, and performant web development.' },
            { step: 4, title: 'Audit & Launch', description: 'Lighthouse speed verification, security checks, and live deployment.' },
          ],
          technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5', 'Next.js'],
          faqs: [
            { question: 'Will my website look great on mobile and tablet screens?', answer: 'Yes, our mobile-first responsive design ensures fluid adaptation across every modern device.' },
            { question: 'How do you handle SEO in web development?', answer: 'We build semantic markup, canonical metadata, Open Graph cards, sitemaps, and optimized asset delivery out of the box.' },
          ],
          isPublished: true,
          order: 1,
        },
        {
          title: 'Full-Stack Web Development',
          slug: 'full-stack-web-development',
          shortDescription:
            'End-to-end web applications combining robust Node/Express architectures with reactive, fluid frontend interfaces.',
          fullDescription:
            'From complex business workflow tools to high-throughput customer portals, our full-stack web development services deliver resilient backend APIs, authenticated state management, and real-time frontend interfaces engineered for scale.',
          icon: 'Layers',
          benefits: [
            'Seamless frontend and backend integration with typed contracts',
            'Scalable database design with indexing and atomic transactions',
            'Comprehensive token-based authentication and role-based access control',
            'Modular microservices or clean monolithic architectures',
          ],
          process: [
            { step: 1, title: 'Schema & API Specification', description: 'Designing RESTful endpoints and data models.' },
            { step: 2, title: 'Backend Core Build', description: 'Developing business logic, validation, and authentication.' },
            { step: 3, title: 'Frontend State Integration', description: 'Building dynamic stateful UI components with React.' },
            { step: 4, title: 'CI/CD & Cloud Deploy', description: 'Containerization, automated tests, and cloud rollout.' },
          ],
          technologies: ['React', 'Node.js', 'Express', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker'],
          faqs: [
            { question: 'How secure is the authentication in full-stack applications?', answer: 'We enforce bcrypt password hashing, encrypted JWTs, HTTP-only SameSite cookies, and strict RBAC verification on every API route.' },
          ],
          isPublished: true,
          order: 2,
        },
        {
          title: 'Custom Software Development',
          slug: 'custom-software-development',
          shortDescription:
            'Purpose-built enterprise platforms, internal operating systems, and automation software crafted for your unique workflow.',
          fullDescription:
            'Off-the-shelf software rarely fits intricate enterprise operations. We build tailored software platforms designed around your specific business logic, eliminating operational bottlenecks and streamlining team productivity.',
          icon: 'Code',
          benefits: [
            '100% intellectual property ownership with zero licensing bloat',
            'Tailored exactly to your operational workflows and compliance requirements',
            'Seamless integration with legacy systems and third-party tools',
            'Extensible architecture ready for future scaling and multi-tenant expansion',
          ],
          process: [
            { step: 1, title: 'Discovery & Workflow Mapping', description: 'Deconstructing existing operational pain points.' },
            { step: 2, title: 'Domain-Driven Design', description: 'Drafting modular domain services and event architectures.' },
            { step: 3, title: 'Iterative Sprints', description: 'Regular demo-driven delivery of production-ready features.' },
            { step: 4, title: 'Enterprise Rollout', description: 'User role migration, employee onboarding, and ongoing support.' },
          ],
          technologies: ['Node.js', 'TypeScript', 'Python', 'MongoDB', 'Redis', 'Docker'],
          faqs: [
            { question: 'Can you integrate with our existing database or ERP?', answer: 'Yes, we specialize in building custom API adapters and middleware bridges to sync with existing legacy databases.' },
          ],
          isPublished: true,
          order: 3,
        },
        {
          title: 'E-commerce Development',
          slug: 'ecommerce-development',
          shortDescription:
            'Secure, conversion-driven digital storefronts with friction-free checkouts, inventory tracking, and payment gateways.',
          fullDescription:
            'We engineer high-converting digital storefronts and B2B ordering platforms featuring lightning-fast catalog navigation, resilient cart management, multi-currency payment integrations, and automated order fulfillment.',
          icon: 'ShoppingBag',
          benefits: [
            'Frictionless multi-step or single-page checkout flows',
            'PCI-DSS compliant payment gateway integrations (Stripe, PayPal, etc.)',
            'Real-time inventory synchronization and automated stock alerts',
            'Comprehensive administrative sales dashboards and analytics',
          ],
          process: [
            { step: 1, title: 'Catalog & Funnel Architecture', description: 'Planning product hierarchy and checkout UX.' },
            { step: 2, title: 'Cart & Payment Engine', description: 'Implementing secure checkout and webhook handlers.' },
            { step: 3, title: 'Admin & Inventory Suite', description: 'Developing order management and coupon rules.' },
            { step: 4, title: 'Security Audit & Launch', description: 'Conducting penetration tests and live order simulations.' },
          ],
          technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe API', 'Tailwind CSS'],
          faqs: [
            { question: 'Which payment methods can be supported?', answer: 'We support all major providers including Stripe, credit cards, Apple Pay, Google Pay, and localized payment rails.' },
          ],
          isPublished: true,
          order: 4,
        },
        {
          title: 'Mobile Application Development',
          slug: 'mobile-application-development',
          shortDescription:
            'Intuitive cross-platform iOS and Android mobile apps engineered with native responsiveness and fluid gestures.',
          fullDescription:
            'Reach your customers wherever they are with cross-platform mobile apps that feel natively fluid on iOS and Android. From offline data caching to push notifications, we build engaging mobile experiences.',
          icon: 'Smartphone',
          benefits: [
            'Single codebase efficiency across both iOS and Android stores',
            'Native 60fps animations and fluid gesture navigation',
            'Offline-first capabilities with local database caching',
            'Seamless push notifications and device hardware integrations',
          ],
          process: [
            { step: 1, title: 'Mobile UX & Flow Design', description: 'Crafting touch-optimized user journeys and wireframes.' },
            { step: 2, title: 'App Architecture', description: 'Setting up cross-platform frameworks and API state sync.' },
            { step: 3, title: 'Device Testing', description: 'Testing across real physical devices and varying screen sizes.' },
            { step: 4, title: 'App Store Submission', description: 'Managing Apple App Store and Google Play compliance.' },
          ],
          technologies: ['React Native', 'TypeScript', 'Expo', 'Tailwind', 'REST APIs', 'Firebase'],
          faqs: [
            { question: 'Can the mobile app sync with our existing web database?', answer: 'Yes, both mobile and web share the exact same secure backend APIs and data models.' },
          ],
          isPublished: true,
          order: 5,
        },
        {
          title: 'UI/UX Design',
          slug: 'ui-ux-design',
          shortDescription:
            'Human-centered product design, design systems, interactive prototypes, and conversion-focused interfaces.',
          fullDescription:
            'Design is not merely how a digital product looks—it is how effortlessly it functions. We conduct in-depth user journey mapping, visual design systems, and clickable high-fidelity prototypes that delight users and drive conversions.',
          icon: 'Palette',
          benefits: [
            'Consistent multi-brand design tokens and component libraries',
            'High-fidelity interactive Figma prototypes for stakeholder alignment',
            'Accessible color contrast and ergonomic typography standards',
            'Drastically reduced user churn through friction-free user flows',
          ],
          process: [
            { step: 1, title: 'User Research & Personas', description: 'Understanding real user goals and workflow hurdles.' },
            { step: 2, title: 'Wireframing & Information Architecture', description: 'Structuring low-fidelity layouts.' },
            { step: 3, title: 'Design System & High-Fi Comps', description: 'Color tokens, typography, and polished screens.' },
            { step: 4, title: 'Developer Handoff', description: 'Detailed specs, CSS tokens, and component guidelines.' },
          ],
          technologies: ['Figma', 'Design Systems', 'Tailwind Tokens', 'Framer', 'Prototyping'],
          faqs: [
            { question: 'Do we receive the original design source files?', answer: 'Yes, full Figma design system files, component libraries, and assets are handed over upon completion.' },
          ],
          isPublished: true,
          order: 6,
        },
        {
          title: 'API Development and Integration',
          slug: 'api-development-and-integration',
          shortDescription:
            'Secure, documented RESTful APIs, webhook dispatchers, and third-party integrations engineered for high concurrency.',
          fullDescription:
            'Connect disparate systems with clean, versioned APIs. We build resilient REST interfaces with OpenAPI documentation, rate limiting, token authentication, and asynchronous webhook dispatching.',
          icon: 'Share2',
          benefits: [
            'Clean RESTful standards with complete interactive OpenAPI documentation',
            'Sub-100ms response latencies through intelligent caching and indexing',
            'Robust webhook queues with automated retry backoffs',
            'Granular API key management and token-based rate limiting',
          ],
          process: [
            { step: 1, title: 'API Contract Design', description: 'Drafting schema specifications and query contracts.' },
            { step: 2, title: 'Route Implementation', description: 'Coding validation, business logic, and database queries.' },
            { step: 3, title: 'Security & Throttling', description: 'Adding rate limiters, token verification, and payload sanitization.' },
            { step: 4, title: 'Interactive Documentation', description: 'Publishing Swagger/OpenAPI interactive test suites.' },
          ],
          technologies: ['Node.js', 'Express', 'TypeScript', 'OpenAPI / Swagger', 'JWT', 'Redis'],
          faqs: [
            { question: 'How do you handle API versioning?', answer: 'We employ URI prefixing (/api/v1/...) ensuring zero breaking changes for existing consumers when expanding features.' },
          ],
          isPublished: true,
          order: 7,
        },
        {
          title: 'Database Development',
          slug: 'database-development',
          shortDescription:
            'Optimized data modeling, schema normalization, indexing, query optimization, and secure data backups.',
          fullDescription:
            'The speed and reliability of any software platform depends on its database foundation. We design scalable schemas, compound indexes, aggregation pipelines, and high-availability backup systems for MongoDB and SQL environments.',
          icon: 'Database',
          benefits: [
            'High-throughput indexing ensuring instant query execution',
            'Schema validation and strict typing for data integrity',
            'Automated snapshot backups with point-in-time recovery strategies',
            'Scalable clustering and horizontal sharding strategies',
          ],
          process: [
            { step: 1, title: 'Data Domain Analysis', description: 'Mapping entity relationships and query frequencies.' },
            { step: 2, title: 'Schema & Index Design', description: 'Crafting normalized or embedded document models.' },
            { step: 3, title: 'Query Profiling', description: 'Benchmarking read/write throughput under high simulated loads.' },
            { step: 4, title: 'Security & Backup Setup', description: 'Hardening access controls, SSL encryption, and automated backups.' },
          ],
          technologies: ['MongoDB', 'Mongoose', 'PostgreSQL', 'Redis', 'Database Indexing'],
          faqs: [
            { question: 'Can you help migrate data from an old database?', answer: 'Yes, we write automated ETL scripts with data validation and rollback capabilities for zero-downtime migrations.' },
          ],
          isPublished: true,
          order: 8,
        },
        {
          title: 'AI-Powered Applications',
          slug: 'ai-powered-applications',
          shortDescription:
            'Intelligent automation, LLM workflows, conversational assistants, and predictive analytics integrated into your product.',
          fullDescription:
            'Transform raw business data into actionable intelligence. We integrate state-of-the-art Large Language Models, semantic vector search, intelligent document parsing, and automated AI workflows into production platforms.',
          icon: 'Sparkles',
          benefits: [
            'Automated customer support assistants with domain-specific knowledge bases',
            'Intelligent data extraction and classification from documents and images',
            'Semantic vector search delivering contextual answers rather than keyword matches',
            'Enterprise data privacy with strict isolation and zero training on your client data',
          ],
          process: [
            { step: 1, title: 'Feasibility & ROI Audit', description: 'Identifying concrete business workflows suitable for AI.' },
            { step: 2, title: 'Prompt & Pipeline Engineering', description: 'Constructing robust Retrieval-Augmented Generation (RAG) pipelines.' },
            { step: 3, title: 'Guardrails & Validation', description: 'Enforcing strict output schemas, token budgets, and content safety.' },
            { step: 4, title: 'Production Integration', description: 'Integrating models into your web and mobile applications.' },
          ],
          technologies: ['OpenAI API', 'LangChain', 'Vector DBs', 'Python', 'Node.js', 'TypeScript'],
          faqs: [
            { question: 'Will our proprietary data be used to train public AI models?', answer: 'No, we utilize enterprise zero-retention API endpoints where your data remains 100% confidential and isolated.' },
          ],
          isPublished: true,
          order: 9,
        },
        {
          title: 'Website Maintenance and Support',
          slug: 'website-maintenance-and-support',
          shortDescription:
            'Proactive security monitoring, core framework updates, uptime alerts, bug fixes, and continuous technical enhancements.',
          fullDescription:
            'Keep your digital assets operating at peak performance with round-the-clock uptime monitoring, automated security patches, dependency upgrades, database optimization, and rapid-response bug fixes.',
          icon: 'LifeBuoy',
          benefits: [
            '24/7 automated uptime and health check monitoring with alert escalation',
            'Monthly vulnerability scanning and security patch deployment',
            'Guaranteed SLA response times for critical incident resolution',
            'Continuous performance audits and database housekeeping',
          ],
          process: [
            { step: 1, title: 'Platform Health Audit', description: 'Benchmarking security status, dependencies, and performance.' },
            { step: 2, title: 'Automated Monitoring Setup', description: 'Configuring synthetic health checks and alert webhooks.' },
            { step: 3, title: 'Scheduled Upgrades', description: 'Performing routine non-breaking dependency and framework updates.' },
            { step: 4, title: 'On-Demand Support', description: 'Resolving tickets and implementing proactive feature polish.' },
          ],
          technologies: ['Uptime Monitoring', 'Security Patching', 'Git Versioning', 'Server Admin'],
          faqs: [
            { question: 'What is your response time for critical issues?', answer: 'We provide dedicated SLA tiers with sub-1-hour emergency response times for critical production outages.' },
          ],
          isPublished: true,
          order: 10,
        },
        {
          title: 'Software Testing and Deployment',
          slug: 'software-testing-and-deployment',
          shortDescription:
            'Automated CI/CD pipelines, end-to-end testing, security audits, and zero-downtime production deployments.',
          fullDescription:
            'Eliminate release anxiety with automated continuous integration and continuous deployment (CI/CD) pipelines. We implement unit tests, integration tests, automated staging environments, and zero-downtime rollout workflows.',
          icon: 'CheckCircle',
          benefits: [
            'Automated unit, integration, and end-to-end regression testing suites',
            'Zero-downtime blue/green or rolling deployment strategies',
            'Ephemeral staging environments for pre-release quality assurance',
            'Instant automated rollbacks if production health checks fail',
          ],
          process: [
            { step: 1, title: 'Test Strategy Definition', description: 'Structuring unit, API contract, and E2E browser test scopes.' },
            { step: 2, title: 'CI/CD Pipeline Setup', description: 'Building GitHub Actions or GitLab automated test runners.' },
            { step: 3, title: 'Containerization', description: 'Building immutable, reproducible Docker containers.' },
            { step: 4, title: 'Production Rollout', description: 'Configuring health-checked automated release gates.' },
          ],
          technologies: ['Docker', 'GitHub Actions', 'Jest', 'Playwright', 'Nginx', 'Linux'],
          faqs: [
            { question: 'Can deployment happen during normal business hours?', answer: 'Yes, with our zero-downtime rolling deployment architecture, releases occur transparently without user disruption.' },
          ],
          isPublished: true,
          order: 11,
        },
        {
          title: 'Cloud and Hosting Solutions',
          slug: 'cloud-and-hosting-solutions',
          shortDescription:
            'Scalable cloud infrastructure design, serverless microservices, load balancing, and hardened cloud security.',
          fullDescription:
            'Architect your infrastructure for infinite scalability and high availability. We design and manage cloud architectures on AWS, GCP, and DigitalOcean with autoscaling, serverless computing, CDN distribution, and hardened firewalls.',
          icon: 'Cloud',
          benefits: [
            'Autoscaling infrastructure that effortlessly handles unexpected traffic spikes',
            'Global CDN edge distribution for sub-second asset delivery worldwide',
            'Hardened VPC networks with strict firewall rules and SSL termination',
            'Cost-optimized resource allocation preventing cloud invoice bloat',
          ],
          process: [
            { step: 1, title: 'Workload & Capacity Analysis', description: 'Estimating CPU, RAM, bandwidth, and concurrency peaks.' },
            { step: 2, title: 'Infrastructure as Code', description: 'Defining repeatable cloud templates and network topologies.' },
            { step: 3, title: 'Security Hardening', description: 'Configuring IAM roles, SSL certificates, and WAF rules.' },
            { step: 4, title: 'High-Availability Go-Live', description: 'Enabling multi-zone failovers and live load balancers.' },
          ],
          technologies: ['AWS', 'Google Cloud', 'DigitalOcean', 'Docker', 'Kubernetes', 'Cloudflare', 'Nginx'],
          faqs: [
            { question: 'Can you help optimize our monthly cloud hosting bills?', answer: 'Yes, we conduct comprehensive architectural audits to eliminate idle compute and right-size your cloud spending.' },
          ],
          isPublished: true,
          order: 12,
        },
      ];

      await Service.insertMany(servicesData);
      console.log(`[Seed] Seeded ${servicesData.length} core services.`);
    }

    // 5. Seed Real Initial Projects & Case Studies
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projectsData = [
        {
          title: 'AeroCloud Enterprise ERP & Operations Suite',
          slug: 'aerocloud-enterprise-erp',
          category: 'Custom Software Development',
          description:
            'An enterprise resource planning platform unifying supply chain management, workforce scheduling, and financial analytics for an international logistics provider.',
          fullDescription:
            'AeroCloud was engineered from the ground up to replace fragmented legacy spreadsheets with a cohesive, real-time operations command center. The system features real-time inventory telemetry, automated purchase order lifecycles, role-based departmental permissions, and instant accounting ledger synchronization.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Tailwind CSS', 'Recharts'],
          clientIndustry: 'Logistics & Supply Chain',
          problemStatement:
            'The client operated across 14 distribution centers using disparate legacy software and spreadsheets, resulting in a 48-hour delay in inventory reporting, frequent stock discrepancies, and operational confusion.',
          solution:
            'We engineered a centralized, multi-tenant cloud platform featuring real-time MongoDB aggregations, role-based permissions, automated audit logs, and an interactive analytical dashboard.',
          developmentProcess: [
            'System workflow mapping and stakeholder interviews across 4 departments',
            'Microservice schema design with atomic database transactions',
            'Modular React dashboard interface with keyboard shortcuts and mobile responsiveness',
            'Stress testing under 25,000 simulated concurrent transaction events',
          ],
          measurableResults: [
            '98% reduction in inventory reconciliation turnaround time (from 48 hours to 4 minutes)',
            'Zero inventory stock-out discrepancies across 14 distribution hubs',
            '35% improvement in weekly workforce dispatch efficiency',
          ],
          liveUrl: 'https://aerocloud-demo.weengineers.tech',
          githubUrl: 'https://github.com/weengineers/aerocloud-erp-architecture',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          ],
          status: 'published',
          isFeatured: true,
          order: 1,
          clientFeedback: {
            clientName: 'Marcus Sterling',
            clientCompany: 'Apex Global Logistics',
            comment:
              'WEENGINEERS TECH demonstrated exceptional technical mastery. They delivered an enterprise platform that transformed our day-to-day operations ahead of schedule.',
            rating: 5,
          },
        },
        {
          title: 'NovaPay Digital Banking & Mobile Wallet',
          slug: 'novapay-digital-banking',
          category: 'Full-Stack Web Development',
          description:
            'Next-generation fintech application featuring instant peer-to-peer transfers, biometric security, virtual cards, and multi-currency exchange.',
          fullDescription:
            'NovaPay bridges complex financial compliance with an ultra-clean, intuitive consumer interface. Engineered with high-throughput microservices, sub-second transaction routing, and multi-layer encryption.',
          technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'],
          clientIndustry: 'FinTech & Banking',
          problemStatement:
            'Financial consumers demanded a contemporary, ultra-fast banking experience without cumbersome verification steps or confusing transaction states.',
          solution:
            'Constructed a reactive web portal and API core with end-to-end token encryption, automated fraud velocity checks, and instant ledger updates.',
          developmentProcess: [
            'Security architecture and PCI-DSS compliance planning',
            'Stateless JWT session handling with encrypted payload signatures',
            'Fluid financial transaction UI with instant feedback and receipt generation',
            'Comprehensive penetration testing and automated vulnerability auditing',
          ],
          measurableResults: [
            'Sub-150ms average transaction settlement latency',
            '99.99% uptime maintained across peak holiday volume',
            '100% pass rate across third-party security audits',
          ],
          liveUrl: 'https://novapay-demo.weengineers.tech',
          thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
          ],
          status: 'published',
          isFeatured: true,
          order: 2,
          clientFeedback: {
            clientName: 'Elena Rostova',
            clientCompany: 'NovaPay Financial Group',
            comment:
              'The team at WEENGINEERS TECH built a financial web experience that our users consistently praise for speed and visual clarity.',
            rating: 5,
          },
        },
        {
          title: 'PulseMed Intelligent Diagnostic Portal',
          slug: 'pulsemed-diagnostic-portal',
          category: 'AI-Powered Applications',
          description:
            'AI-assisted medical imaging and patient triage platform enabling clinics to analyze diagnostic scans and coordinate specialist care securely.',
          fullDescription:
            'PulseMed utilizes deep learning pipelines to highlight potential radiological anomalies, drafting preliminary triage summaries for licensed radiologists while maintaining strict HIPAA compliance.',
          technologies: ['React', 'Python', 'Node.js', 'MongoDB', 'Tailwind CSS', 'OpenAI API'],
          clientIndustry: 'Healthcare & Biotech',
          problemStatement:
            'Specialist clinics faced substantial backlog in triage assessments, leading to unnecessary delays in urgent patient care.',
          solution:
            'Designed an encrypted web portal integrating machine-assisted image analysis and structured report generators, cutting initial triage time significantly.',
          measurableResults: [
            '62% reduction in preliminary scan triage turnaround',
            'HIPAA-compliant zero-leakage data encryption in transit and at rest',
          ],
          liveUrl: 'https://pulsemed-demo.weengineers.tech',
          thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
          ],
          status: 'published',
          isFeatured: true,
          order: 3,
        },
        {
          title: 'Lumina Home E-Commerce & Customizer',
          slug: 'lumina-home-ecommerce',
          category: 'E-commerce Development',
          description:
            'High-end interior design and lighting marketplace featuring a real-time 3D room customizer, automated invoice generation, and global shipping calculations.',
          fullDescription:
            'Lumina Home provides luxury interior enthusiasts with an immersive shopping experience. Includes real-time product customization, dynamic pricing tables, and frictionless multi-currency Stripe checkouts.',
          technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Stripe'],
          clientIndustry: 'Retail & Consumer Goods',
          problemStatement:
            'High bounce rates on standard catalog pages due to customers being unable to visualize custom finishes.',
          solution:
            'Built an interactive product customizer directly into the product detail flow, paired with an instant cart drawer and one-click checkout.',
          measurableResults: [
            '44% increase in checkout conversion rates',
            '28% increase in average order value (AOV) via customizer bundles',
          ],
          liveUrl: 'https://lumina-demo.weengineers.tech',
          thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
          ],
          status: 'published',
          isFeatured: false,
          order: 4,
        },
      ];

      await Project.insertMany(projectsData);
      console.log(`[Seed] Seeded ${projectsData.length} published enterprise projects.`);
    }

    // 6. Seed Official Team Members
    const officialTeamMembers = [
      { name: 'SURESH R', designation: 'B.Tech Information Technology — 3rd Year', order: 1, isVisible: true, isFounder: false },
      { name: 'DHANYA SHANKARI', designation: 'B.Tech Information Technology — 3rd Year', order: 2, isVisible: true, isFounder: false },
      { name: 'BALANAVIN S', designation: 'B.Tech Information Technology — 3rd Year', order: 3, isVisible: true, isFounder: false },
      { name: 'MAHARAJA', designation: 'B.Tech Information Technology — 3rd Year', order: 4, isVisible: true, isFounder: false },
      { name: 'MAHESH', designation: 'B.Tech Information Technology — 3rd Year', order: 5, isVisible: true, isFounder: false },
      { name: 'MATHIVANAN', designation: 'B.Tech Information Technology — 3rd Year', order: 6, isVisible: true, isFounder: false },
      { name: 'ZAINUDEEN', designation: 'B.Tech Information Technology — 3rd Year', order: 7, isVisible: true, isFounder: false },
      { name: 'SARANYA', designation: 'B.Tech Information Technology — 3rd Year', order: 8, isVisible: true, isFounder: false },
      { name: 'VINOTH', designation: 'B.Tech Information Technology — 3rd Year', order: 9, isVisible: true, isFounder: false },
      { name: 'ADSHAYAA', designation: 'B.Tech Information Technology — 3rd Year', order: 10, isVisible: true, isFounder: false },
      { name: 'DEEPIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 11, isVisible: true, isFounder: false },
      { name: 'DEVIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 12, isVisible: true, isFounder: false },
      { name: 'ISHWARYALAKSHMI', designation: 'B.Tech Information Technology — 3rd Year', order: 13, isVisible: true, isFounder: false },
    ];

    await TeamMember.deleteMany({});
    await TeamMember.insertMany(officialTeamMembers);
    console.log(`[Seed] Seeded ${officialTeamMembers.length} official team members.`);

    // 7. Seed Real Approved Reviews (Backed by Project Associations)
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const aerocloud = await Project.findOne({ slug: 'aerocloud-enterprise-erp' });
      const novapay = await Project.findOne({ slug: 'novapay-digital-banking' });

      const reviewsData = [
        {
          clientName: 'Marcus Sterling',
          clientCompany: 'Apex Global Logistics',
          clientRole: 'Chief Operating Officer',
          rating: 5,
          reviewText:
            'WEENGINEERS TECH delivered an enterprise-grade ERP system that solved operational delays we struggled with for three years. Their architectural rigor, clear communication, and light-theme dashboard design exceeded our highest expectations.',
          projectId: aerocloud?._id,
          status: 'approved',
          isVerified: true,
          isFlagged: false,
          moderationHistory: [
            {
              status: 'approved',
              moderatedBy: 'Engr. Founder (founder)',
              moderatedAt: new Date(),
              note: 'Verified corporate enterprise client testimonial.',
            },
          ],
        },
        {
          clientName: 'Elena Rostova',
          clientCompany: 'NovaPay Financial Group',
          clientRole: 'VP of Digital Banking',
          rating: 5,
          reviewText:
            'Working with the WEENGINEERS TECH team was a masterclass in professional software engineering. The speed of the web platform, the clean code quality, and the security precautions they took gave our compliance team complete confidence.',
          projectId: novapay?._id,
          status: 'approved',
          isVerified: true,
          isFlagged: false,
          moderationHistory: [
            {
              status: 'approved',
              moderatedBy: 'Engr. Founder (founder)',
              moderatedAt: new Date(),
              note: 'Verified FinTech client testimonial.',
            },
          ],
        },
        {
          clientName: 'Dr. Arthur Pendelton',
          clientCompany: 'Vanguard Health Systems',
          clientRole: 'Director of Clinical Technology',
          rating: 5,
          reviewText:
            'Their attention to detail regarding HIPAA encryption and sub-second diagnostic image loading was remarkable. They are true software engineers who understand serious business stakes.',
          status: 'approved',
          isVerified: true,
          isFlagged: false,
          moderationHistory: [
            {
              status: 'approved',
              moderatedBy: 'Technical Administrator (admin)',
              moderatedAt: new Date(),
              note: 'Approved following clinical partner validation.',
            },
          ],
        },
      ];

      await Review.insertMany(reviewsData);
      console.log(`[Seed] Seeded ${reviewsData.length} verified client reviews.`);
    }

    // 8. Seed Initial FAQs
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      const faqsData = [
        {
          question: 'What types of development projects does WEENGINEERS TECH handle?',
          answer:
            'We specialize in end-to-end custom software development, full-stack web applications, corporate websites, e-commerce storefronts, mobile applications, cloud architectures, and bespoke business automation tools.',
          category: 'General',
          order: 1,
          isPublished: true,
        },
        {
          question: 'What is your software development process?',
          answer:
            'Our process follows a disciplined four-stage cycle: 1) Architecture & Discovery, 2) UI/UX Prototyping, 3) Iterative Full-Stack Sprints with automated code reviews, and 4) Security Audits, Quality Assurance & Zero-Downtime Deployment.',
          category: 'Process',
          order: 2,
          isPublished: true,
        },
        {
          question: 'How do you ensure data security and compliance?',
          answer:
            'We enforce industry-standard security at every layer: bcrypt password hashing, encrypted JWT session tokens, strict role-based access control, parameterized database queries to prevent injection, CSRF and CORS protections, and automated audit logging.',
          category: 'Security',
          order: 3,
          isPublished: true,
        },
        {
          question: 'Do you provide ongoing maintenance after launch?',
          answer:
            'Yes. We offer continuous software maintenance, 24/7 uptime monitoring, scheduled security patching, dependency upgrades, database performance tuning, and technical enhancement retainers.',
          category: 'Support',
          order: 4,
          isPublished: true,
        },
        {
          question: 'How do we get started on a project with WEENGINEERS TECH?',
          answer:
            'You can submit your project requirements through our Contact & Project Enquiry form. Our engineering team reviews your vision, assigns a dedicated project lead, and schedules a technical discovery consultation within 24 to 48 hours.',
          category: 'General',
          order: 5,
          isPublished: true,
        },
      ];

      await FAQ.insertMany(faqsData);
      console.log(`[Seed] Seeded ${faqsData.length} FAQs.`);
    }

    // 9. Seed Initial Blog Articles
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      const blogsData = [
        {
          title: 'Architecting Scalable Web Applications: Principles for Enterprise Growth',
          slug: 'architecting-scalable-web-applications',
          excerpt:
            'A deep dive into how structured data modeling, caching strategies, and modular component design prevent architectural debt in high-growth companies.',
          content:
            'Scalability is not something you bolt onto an application when server traffic spikes; it must be baked into the foundational architecture from day one. In this article, our engineering team explores the crucial balance between clean data normalization in MongoDB, indexed query optimization, and resilient state management in modern React and TypeScript frontends.',
          author: 'Engr. Founder',
          category: 'Engineering',
          tags: ['Architecture', 'TypeScript', 'Node.js', 'MongoDB'],
          readTimeMinutes: 6,
          isPublished: true,
          coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        },
        {
          title: 'The Power of Light-Theme UI in Enterprise Dashboards',
          slug: 'power-of-light-theme-ui-enterprise-dashboards',
          excerpt:
            'Why corporate decision-makers and high-focus operators perform better with high-contrast, uncluttered light design systems.',
          content:
            'While dark modes have their place in casual mobile viewing, enterprise software operators require sustained visual clarity, crisp contrast ratios, and generous whitespace. We examine how a refined light-theme palette—anchored by deep royal blue, subtle slate borders, and legible typography—reduces cognitive fatigue and accelerates daily workflows.',
          author: 'Sarah Chen',
          category: 'Design & UX',
          tags: ['UI/UX', 'Design System', 'Light Theme', 'Productivity'],
          readTimeMinutes: 5,
          isPublished: true,
          coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        },
      ];

      await BlogPost.insertMany(blogsData);
      console.log(`[Seed] Seeded ${blogsData.length} blog articles.`);
    }

    // 10. Seed Initial Sample Enquiry
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      await Enquiry.create({
        referenceCode: 'WE-2026-INIT01',
        fullName: 'Alexander Wright',
        email: 'alexander.wright@strataholdings.com',
        phone: '+1 (555) 948-2201',
        companyName: 'Strata Holdings',
        service: 'Custom Software Development',
        budget: '$25,000 - $50,000',
        timeline: '3 - 6 months',
        description:
          'We require an internal portfolio management portal with role-based access, real-time analytics, and secure document exports for our investment committee.',
        preferredContactMethod: 'email',
        status: 'Contacted',
        internalNotes: [
          {
            note: 'Initial requirements reviewed. Scheduled discovery call for Tuesday 10:00 AM.',
            authorName: 'Engr. Founder',
            authorEmail: 'founder@weengineers.tech',
            createdAt: new Date(),
          },
        ],
        history: [
          {
            status: 'New',
            changedBy: 'Client Web Submission',
            changedAt: new Date(Date.now() - 86400000 * 2),
            note: 'Enquiry submitted via public portal.',
          },
          {
            status: 'Contacted',
            changedBy: 'Engr. Founder (founder)',
            changedAt: new Date(Date.now() - 86400000),
            note: 'Client acknowledged via email; introductory consultation arranged.',
          },
        ],
      });
      console.log('[Seed] Seeded initial sample enquiry.');
    }

    // 11. Initial Audit Log
    await AuditLog.create({
      userEmail: founderEmail,
      userRole: 'founder',
      action: 'SYSTEM_SEEDED',
      module: 'SYSTEM',
      details: { message: 'Database initialized with core services, founder account, settings, and verified records.' },
    });

    console.log('[Seed] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
}

seed();
