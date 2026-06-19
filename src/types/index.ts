export interface Opportunity {
  id: string | number;
  title: string;
  organization: string;
  country: string;
  category: string;
  deadline: string;
  fundingAmount?: string;
  isFullyFunded?: boolean;
  eligibility: string;
  description: string;
  benefits: string;
  officialLink: string;
  datePosted: string;
  status: string; // "APPROVED" | "PENDING" | "REJECTED" | "CLOSED" | "Active"
  isFeatured?: boolean;
  visaSponsorship?: boolean;
  remote?: boolean;
  noIeltsRequired?: boolean;
  govtSponsored?: boolean;
  rating?: number;
  creatorEmail?: string;
}

export interface ApplicationRecord {
  id: string | number;
  userId: string;
  opportunityId: string | number;
  opportunityTitle: string;
  organization: string;
  status: string; // "Draft" | "Applied" | "In Review" | "Interview" | "Offer" | "Closed"
  appliedDate: string;
  notes?: string;
}

export interface UserProfile {
  email: string;
  fullName: string;
  phone?: string;
  education?: string;
  experience?: string;
  skills?: string;
  cvText?: string;
  preferredCountry?: string;
  preferredCategory?: string;
  noIeltsChecked?: boolean;
  visaSponsorshipNeeded?: boolean;
  remoteOnly?: boolean;
  role?: string; // "CANDIDATE" | "RECRUITER" | "ADMIN"
}

export interface CountryDetail {
  id: string;
  name: string;
  flagEmoji: string;
  immigrationPathways: string;
  averageSalary: string;
  costOfLiving: string;
  popularIndustries: string[];
  visaInformation: string;
  educationOpportunities: string;
  imageDescription: string;
}

export interface ChatMessage {
  id: string | number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}
