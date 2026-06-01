export type WindowId =
  | "about"
  | "skills"
  | "experience"
  | "certifications"
  | "education"
  | "references"
  | "contact"
  | "terminal"
  | "cisco"
  | "explorer"
  | "settings"
  | "taskmgr";

export interface WindowConfig {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: string | number; height: string | number };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
  link?: string;
}

export interface CertItem {
  title: string;
  issuer: string;
  year: string;
  bullets: string[];
  link?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  location: string;
  period: string;
  bullets: string[];
  link?: string;
}

export interface ReferenceItem {
  name: string;
  title: string;
  company: string;
  phone: string;
  email?: string;
}
