import { SkillCategory, ExperienceItem, CertItem, EducationItem, ReferenceItem } from "../types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Software Engineering & Backend",
    skills: [
      "PHP (Laravel, Symfony, CodeIgniter)",
      "Python (Django, Flask)",
      "C# & .NET Core Development",
      "ASP.NET (Web Applications & APIs)",
      "Microservices Architecture",
      "Docker Containers",
      "DevOps Practices"
    ]
  },
  {
    title: "Databases & APIs",
    skills: [
      "Relational SQL (MySQL, PostgreSQL)",
      "NoSQL (MongoDB, Redis)",
      "RESTful API Design & Integration",
      "Postman testing",
      "GraphQL"
    ]
  },
  {
    title: "Enterprise Networking & Cyber",
    skills: [
      "Cisco Layer 3 Routing & Switching",
      "Cisco CCNP Enterprise Network Automation",
      "Cisco CCNA Wireless / WLCs / WLANS",
      "VPNs & IPsec Encryption",
      "Firewalls & Intrusion Prevention Systems",
      "SD-WAN Integration",
      "Cyber Ops Associate & Security"
    ]
  },
  {
    title: "IT Support & Business Ops",
    skills: [
      "Software/system Testing & QA",
      "Network Hardware Diagnostics",
      "Structured Ticket Escalation Matrix",
      "ERP Systems & Reconciliations",
      "Stock Inventory Control",
      "Technical Staff Training"
    ]
  }
];

export const experienceData: ExperienceItem[] = [
  {
    company: "Good Nature Agro",
    location: "Chipata, Zambia",
    role: "Data and Tech Support Associate",
    period: "Jan 2025 - Present",
    bullets: [
      "Deliver advanced IT infrastructure and platform data support to 200+ users, driving incident resolution through a organized ticketing system.",
      "Validate telemetry databases and analytical reports to guarantee seamless operation accuracy.",
      "Coordinate bulk communications systems and user tracking indicators to improve engagement metrics.",
      "Run software testing cycles, report systemic software bugs, and coordinate directly with developers on critical fixes.",
      "Install enterprise routers/switches, set up local workstations, and provide secure field network coverage.",
      "Create tech-adoption documentation and provide face-to-face onboarding to standard tools."
    ],
    link: "https://goodnatureagro.com/"
  },
  {
    company: "Good Nature Agro",
    location: "Chipata, Zambia",
    role: "Accounts Associate - Support",
    period: "Jan 2024 - Dec 2024",
    bullets: [
      "Integrated cross-departmental databases to resolve complex stock and ledger differences.",
      "Guarded financial balance transaction control schedules, managing inbound/outbound record validation.",
      "Supported the core Business Intelligence (BI) squad in running audits, filtering raw farmer datasets.",
      "Provided high-quality functional systems support directly to team leads."
    ],
    link: "https://goodnatureagro.com/"
  },
  {
    company: "Good Nature Agro",
    location: "Petauke, Zambia",
    role: "Finance Administration Assistant & FISP Warehouse Manager",
    period: "Jan 2023 - Dec 2023",
    bullets: [
      "Supervised large physical distribution points for seed stocks, verifying inventory audits and maintaining accurate ledger records.",
      "Managed regional database metrics, transaction control logs, and supported specific financial reporting tasks.",
      "Organized financial systems records and archives, maintaining audit-ready files."
    ],
    link: "https://goodnatureagro.com/"
  },
  {
    company: "Good Nature Agro",
    location: "Chipata, Zambia",
    role: "Intern Finance Field Administrator",
    period: "Apr 2022 - Dec 2022",
    bullets: [
      "Conducted meticulous data analyses to spot ledger errors, implementing immediate remedies.",
      "Generated detailed weekly error telemetry reports.",
      "Maintained deep-level archiving structures for rapid periodic field assessments."
    ],
    link: "https://goodnatureagro.com/"
  },
  {
    company: "Center for Ticks and Tick-Borne Diseases",
    location: "Lilongwe, Malawi",
    role: "Software Developer",
    period: "Jun 2020 - Sep 2020",
    bullets: [
      "Designed, coded, and deployed a robust backend C# database application to manage institutional livestock vaccine batches.",
      "Conducted extensive product verification testing (UAT and unit tests) to guarantee backend stability before server deployment.",
      "Collaborated with veterinary and agricultural stakeholders to define system inputs, drafting deep tech manuals.",
      "Provided on-call debugging and maintenance updates post-launch to address bugs."
    ],
    link: "https://www.cttbd.org/en/"
  },
  {
    company: "Chipata General Hospital ART Clinic",
    location: "Chipata, Zambia",
    role: "Data Entry Clerk",
    period: "Mar 2019 - May 2019",
    bullets: [
      "Maintained critical patient care files within the SmartCare (HMIS) system, preserving data secrecy and integrity.",
      "Aided database administrators with scheduled offsite database backups and system recoveries.",
      "Learned the operational realities and technical data processes of clinical health structures."
    ]
  },
  {
    company: "Impact Enterprises",
    location: "Chipata, Zambia",
    role: "IT Data Specialist",
    period: "Feb 2015 - Aug 2016",
    bullets: [
      "Processed complex customer datasets, cleaning and verifying entries for external business clients.",
      "Led technical data scraping campaigns to generate verified business leads.",
      "Implemented file validation routines to improve database consistency and reliability."
    ],
    link: "https://www.impactenterprises.org/"
  }
];

export const certificationsData: CertItem[] = [
  {
    title: "CCNP Enterprise: Advanced Routing",
    issuer: "Cisco Networking Academy",
    year: "2023",
    bullets: ["Covers complex enterprise WAN routing protocols, multi-area OSPF, BGP architectures, VPN structures, and scale route aggregation."],
  },
  {
    title: "CCNP Enterprise: Core Networking",
    issuer: "Cisco Networking Academy",
    year: "2023",
    bullets: ["In-depth study of enterprise campus wiring, SD-WAN controllers, Layer 3 switching matrices, QoS optimization, and network automation APIs."],
  },
  {
    title: "ASP.NET for Experienced Developers Specialization",
    issuer: "Coursera, Board Infinity",
    year: "2023",
    bullets: ["Mastered building scalable web APIs and microservices using C# & ASP.NET Core, containerizing applications with Docker, and setting up CI/CD pipelines."],
    link: "https://coursera.org/verify/specialization/A3CZQBYTBBW8"
  },
  {
    title: "Software Engineering Specialization",
    issuer: "Coursera, Hong Kong University of Science and Technology (HKUST)",
    year: "2023",
    bullets: ["Agile team workflows, test-driven design (TDD), performance validation, and secure software lifecycle management."],
    link: "https://coursera.org/verify/specialization/BFBZGM9TBUM9"
  },
  {
    title: "Microsoft Azure for Data Engineering",
    issuer: "Coursera, Microsoft Authorized Program",
    year: "2022",
    bullets: ["Configured cloud data storage (Azure Data Lake, Blob Store), pipeline orchestration models (Azure Data Factory), and analytics pipelines (Synapse)."],
    link: "https://coursera.org/verify/D3F4XCHQ46AP"
  },
  {
    title: "System Administration & IT Infrastructure",
    issuer: "Coursera, Google career suite",
    year: "2022",
    bullets: ["Practical systems training on Linux/Windows administration, network DNS/DHCP configurations, cloud integration models, and security access policies."],
    link: "https://coursera.org/verify/QWKMTNTL3HEA"
  },
  {
    title: "Information Systems Auditing, Controls and Assurance",
    issuer: "Coursera, HKUST",
    year: "2022",
    bullets: ["Learned methodologies to evaluate system risks, audit IT security baselines, and maintain standard compliance logs."],
    link: "https://coursera.org/verify/JQSKZCHBS2D3"
  },
  {
    title: "CCNAv7 Enterprise Switching, Routing and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    year: "2021",
    bullets: ["Configuring virtual networks, VLAN trunking protocols, spanning-tree (STP), DHCP server relays, and wireless access controller security."],
  },
  {
    title: "Cyber Ops Associate & Network Security",
    issuer: "Cisco Networking Academy",
    year: "2021",
    bullets: ["Trained in incident handling, packet captures (Wireshark), firewall logs analysis, intrusion prevention, access control lists (ACLs), and SIEM tooling."],
  }
];

export const educationData: EducationItem[] = [
  {
    school: "National College of IT (NACIT)",
    degree: "NCC Level 4 Diploma in Computing",
    location: "Lilongwe, Malawi",
    period: "2018 - 2020",
    bullets: [
      "Completed core technical computing systems coursework, with standard focus on relational database design, object-oriented concepts, algorithm complexity, and software structures.",
      "Built simple discrete math and computational models."
    ],
    link: "https://www.nccedu.com/study-centres/national-college-of-it-skills-centre-lilongwe-nacit/"
  }
];

export const referencesData: ReferenceItem[] = [
  {
    name: "DR. FREDAH BANDA",
    title: "Software Engineering Manager",
    company: "Good Nature Agro",
    phone: "+260977789980",
    email: "fredah.banda@goodnatureagro.com"
  },
  {
    name: "MR. MATHEWS BANDA",
    title: "Lead Support",
    company: "Good Nature Agro",
    phone: "+260976325495",
    email: "mathews.banda@goodnatureagro.com"
  },
  {
    name: "MR. CHABALA",
    title: "Data Associate",
    company: "Chipata District Health Office",
    phone: "+26097775508"
  },
  {
    name: "MR. PETER MFUNE",
    title: "Human Resource Manager",
    company: "Impact Enterprises Chipata",
    phone: "+26097380558"
  }
];
