export interface MyWorkbasketRecord {
  caseId: string;
  clientId: string;
  clientName: string;
  clientType: 'Individual' | 'Corporate' | 'Investment' | 'Banking';
  status: 'assigned' | 'in-progress' | 'returned' | 'manual-review' | 'completed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAnalyst: string;
  createdDate: string;
  dueDate: string;
  riskRating: 'Low' | 'Medium' | 'High';
  manualReviewReasons: string[];
  jurisdiction: string;
  lob: string;
  daysInQueue: number;
  returnReason?: string;
  completedDate?: string;
  escalationPending?: boolean;
  actions?: string;
}

export type WorkbasketFilter = 'all' | 'active' | 'escalations' | 'completed' | 'returned';

export const getMockWorkbasketCases = (currentUser: any): MyWorkbasketRecord[] => [
  {
    caseId: 'HRA-2024-0201',
    clientId: 'CLT201',
    clientName: 'Global Dynamics Corp',
    clientType: 'Corporate',
    status: 'assigned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-15',
    dueDate: '2024-06-25',
    riskRating: 'High',
    manualReviewReasons: ['GFC Intelligence is Yes', 'Risk drivers >10'],
    jurisdiction: 'Cayman Islands',
    lob: 'Investment Banking',
    daysInQueue: 2,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0203',
    clientId: 'CLT203',
    clientName: 'Alexander Petrov',
    clientType: 'Individual',
    status: 'in-progress',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-14',
    dueDate: '2024-06-24',
    riskRating: 'High',
    manualReviewReasons: ['Client escalation', 'Address change', 'Income source change'],
    jurisdiction: 'Switzerland',
    lob: 'Private Banking',
    daysInQueue: 3,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0205',
    clientId: 'CLT205',
    clientName: 'Meridian Investment Group',
    clientType: 'Investment',
    status: 'manual-review',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-13',
    dueDate: '2024-06-23',
    riskRating: 'Medium',
    manualReviewReasons: ['Beneficial ownership structure complexity'],
    jurisdiction: 'Luxembourg',
    lob: 'Wealth Management',
    daysInQueue: 4,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0207',
    clientId: 'CLT207',
    clientName: 'Pacific Trade Solutions',
    clientType: 'Corporate',
    status: 'returned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-12',
    dueDate: '2024-06-22',
    riskRating: 'High',
    manualReviewReasons: ['Complex trade structure'],
    jurisdiction: 'Singapore',
    lob: 'Commercial Banking',
    daysInQueue: 5,
    returnReason: 'Additional client documentation required',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0209',
    clientId: 'CLT209',
    clientName: 'Sterling Financial Holdings',
    clientType: 'Banking',
    status: 'assigned',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-11',
    dueDate: '2024-06-21',
    riskRating: 'Medium',
    manualReviewReasons: ['New product risk assessment'],
    jurisdiction: 'United Kingdom',
    lob: 'Investment Banking',
    daysInQueue: 6,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0211',
    clientId: 'CLT211',
    clientName: 'Arctic Mining Consortium',
    clientType: 'Corporate',
    status: 'in-progress',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-10',
    dueDate: '2024-06-20',
    riskRating: 'Low',
    manualReviewReasons: ['Standard review process'],
    jurisdiction: 'Norway',
    lob: 'Commercial Banking',
    daysInQueue: 7,
    actions: 'actions'
  },
  // Completed cases (today)
  {
    caseId: 'HRA-2024-0213',
    clientId: 'CLT213',
    clientName: 'Alpine Holdings Ltd',
    clientType: 'Corporate',
    status: 'completed',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-05',
    dueDate: '2024-06-15',
    riskRating: 'Medium',
    manualReviewReasons: ['Standard assessment completed'],
    jurisdiction: 'Switzerland',
    lob: 'Private Banking',
    daysInQueue: 10,
    completedDate: '2024-10-06', // Today's date
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0215',
    clientId: 'CLT215',
    clientName: 'Phoenix Energy Corp',
    clientType: 'Corporate',
    status: 'completed',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-08',
    dueDate: '2024-06-18',
    riskRating: 'High',
    manualReviewReasons: ['Risk assessment completed'],
    jurisdiction: 'United States',
    lob: 'Investment Banking',
    daysInQueue: 8,
    completedDate: '2024-10-06', // Today's date
    actions: 'actions'
  },
  // Cases pending escalation
  {
    caseId: 'HRA-2024-0217',
    clientId: 'CLT217',
    clientName: 'Quantum Investments',
    clientType: 'Investment',
    status: 'manual-review',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-16',
    dueDate: '2024-06-26',
    riskRating: 'High',
    manualReviewReasons: ['GFC Intelligence flagged', 'Risk drivers >10', 'Client escalation'],
    jurisdiction: 'Cayman Islands',
    lob: 'Investment Banking',
    daysInQueue: 1,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0219',
    clientId: 'CLT219',
    clientName: 'Global Trade Network',
    clientType: 'Corporate',
    status: 'assigned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-15',
    dueDate: '2024-06-25',
    riskRating: 'High',
    manualReviewReasons: ['TRMS referral required', 'New risk factors ≥5'],
    jurisdiction: 'Hong Kong',
    lob: 'Commercial Banking',
    daysInQueue: 2,
    escalationPending: true,
    actions: 'actions'
  },
  // More completed cases for variety
  {
    caseId: 'HRA-2024-0221',
    clientId: 'CLT221',
    clientName: 'Marina Bay Securities',
    clientType: 'Banking',
    status: 'completed',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-03',
    dueDate: '2024-06-13',
    riskRating: 'Low',
    manualReviewReasons: ['Standard review completed'],
    jurisdiction: 'Singapore',
    lob: 'Wealth Management',
    daysInQueue: 12,
    completedDate: '2024-10-06', // Today's date
    actions: 'actions'
  },
  // Additional records to reach 25+
  {
    caseId: 'HRA-2024-0223',
    clientId: 'CLT223',
    clientName: 'Titan Manufacturing Inc',
    clientType: 'Corporate',
    status: 'assigned',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-17',
    dueDate: '2024-06-27',
    riskRating: 'Medium',
    manualReviewReasons: ['Standard assessment required'],
    jurisdiction: 'Canada',
    lob: 'Commercial Banking',
    daysInQueue: 1,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0225',
    clientId: 'CLT225',
    clientName: 'Elena Rodriguez',
    clientType: 'Individual',
    status: 'in-progress',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-16',
    dueDate: '2024-06-26',
    riskRating: 'High',
    manualReviewReasons: ['Source of Income changes', 'Address changes'],
    jurisdiction: 'Spain',
    lob: 'Private Banking',
    daysInQueue: 2,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0227',
    clientId: 'CLT227',
    clientName: 'Diamond Retail Group',
    clientType: 'Corporate',
    status: 'returned',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-14',
    dueDate: '2024-06-24',
    riskRating: 'Medium',
    manualReviewReasons: ['Business model review'],
    jurisdiction: 'Australia',
    lob: 'Commercial Banking',
    daysInQueue: 4,
    returnReason: 'Missing business registration documents',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0229',
    clientId: 'CLT229',
    clientName: 'Sunrise Capital Partners',
    clientType: 'Investment',
    status: 'manual-review',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-15',
    dueDate: '2024-06-25',
    riskRating: 'High',
    manualReviewReasons: ['GFC Intelligence flagged', 'Client escalation'],
    jurisdiction: 'Bermuda',
    lob: 'Investment Banking',
    daysInQueue: 3,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0231',
    clientId: 'CLT231',
    clientName: 'Northern Energy Solutions',
    clientType: 'Corporate',
    status: 'completed',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-01',
    dueDate: '2024-06-11',
    riskRating: 'Low',
    manualReviewReasons: ['Standard review completed'],
    jurisdiction: 'Norway',
    lob: 'Commercial Banking',
    daysInQueue: 15,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0233',
    clientId: 'CLT233',
    clientName: 'Marcus Thompson',
    clientType: 'Individual',
    status: 'assigned',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-18',
    dueDate: '2024-06-28',
    riskRating: 'Low',
    manualReviewReasons: ['Routine assessment'],
    jurisdiction: 'United Kingdom',
    lob: 'Wealth Management',
    daysInQueue: 1,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0235',
    clientId: 'CLT235',
    clientName: 'Pacific Logistics Corp',
    clientType: 'Corporate',
    status: 'in-progress',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-13',
    dueDate: '2024-06-23',
    riskRating: 'Medium',
    manualReviewReasons: ['NAICS code changes', 'Beneficial ownership changes'],
    jurisdiction: 'Japan',
    lob: 'Commercial Banking',
    daysInQueue: 5,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0237',
    clientId: 'CLT237',
    clientName: 'Sapphire Investment Trust',
    clientType: 'Investment',
    status: 'assigned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-17',
    dueDate: '2024-06-27',
    riskRating: 'High',
    manualReviewReasons: ['Risk drivers >10', 'New risk factors ≥5'],
    jurisdiction: 'Ireland',
    lob: 'Investment Banking',
    daysInQueue: 1,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0239',
    clientId: 'CLT239',
    clientName: 'Isabella Chen',
    clientType: 'Individual',
    status: 'returned',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-11',
    dueDate: '2024-06-21',
    riskRating: 'Medium',
    manualReviewReasons: ['Income verification needed'],
    jurisdiction: 'Hong Kong',
    lob: 'Private Banking',
    daysInQueue: 7,
    returnReason: 'Additional income documentation required',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0241',
    clientId: 'CLT241',
    clientName: 'Metropolitan Banking Ltd',
    clientType: 'Banking',
    status: 'completed',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-04',
    dueDate: '2024-06-14',
    riskRating: 'Medium',
    manualReviewReasons: ['Standard banking review completed'],
    jurisdiction: 'United Kingdom',
    lob: 'Investment Banking',
    daysInQueue: 12,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0243',
    clientId: 'CLT243',
    clientName: 'Frontier Technologies Inc',
    clientType: 'Corporate',
    status: 'manual-review',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-16',
    dueDate: '2024-06-26',
    riskRating: 'High',
    manualReviewReasons: ['TRMS referral required', 'Complex business structure'],
    jurisdiction: 'United States',
    lob: 'Commercial Banking',
    daysInQueue: 2,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0245',
    clientId: 'CLT245',
    clientName: 'Golden Gate Holdings',
    clientType: 'Investment',
    status: 'assigned',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-18',
    dueDate: '2024-06-28',
    riskRating: 'High',
    manualReviewReasons: ['GFC Intelligence flagged', 'Risk drivers >10'],
    jurisdiction: 'Cayman Islands',
    lob: 'Investment Banking',
    daysInQueue: 0,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0247',
    clientId: 'CLT247',
    clientName: 'Victoria Williams',
    clientType: 'Individual',
    status: 'in-progress',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-15',
    dueDate: '2024-06-25',
    riskRating: 'Medium',
    manualReviewReasons: ['Address changes', 'Income source review'],
    jurisdiction: 'Canada',
    lob: 'Wealth Management',
    daysInQueue: 3,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0249',
    clientId: 'CLT249',
    clientName: 'Coastal Shipping Networks',
    clientType: 'Corporate',
    status: 'completed',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-06',
    dueDate: '2024-06-16',
    riskRating: 'High',
    manualReviewReasons: ['Complex trade analysis completed'],
    jurisdiction: 'Netherlands',
    lob: 'Commercial Banking',
    daysInQueue: 10,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0251',
    clientId: 'CLT251',
    clientName: 'Emerald Financial Services',
    clientType: 'Banking',
    status: 'assigned',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-17',
    dueDate: '2024-06-27',
    riskRating: 'Low',
    manualReviewReasons: ['Standard banking assessment'],
    jurisdiction: 'Ireland',
    lob: 'Investment Banking',
    daysInQueue: 1,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0253',
    clientId: 'CLT253',
    clientName: 'Atlas Commodity Trading',
    clientType: 'Corporate',
    status: 'returned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-10',
    dueDate: '2024-06-20',
    riskRating: 'High',
    manualReviewReasons: ['Complex commodity structure'],
    jurisdiction: 'Switzerland',
    lob: 'Investment Banking',
    daysInQueue: 8,
    returnReason: 'Commodity trading documentation incomplete',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0255',
    clientId: 'CLT255',
    clientName: 'Christopher Lee',
    clientType: 'Individual',
    status: 'completed',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-02',
    dueDate: '2024-06-12',
    riskRating: 'Low',
    manualReviewReasons: ['Standard individual review completed'],
    jurisdiction: 'Singapore',
    lob: 'Private Banking',
    daysInQueue: 14,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0257',
    clientId: 'CLT257',
    clientName: 'Vertex Capital Management',
    clientType: 'Investment',
    status: 'manual-review',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-14',
    dueDate: '2024-06-24',
    riskRating: 'Medium',
    manualReviewReasons: ['Beneficial ownership changes', 'New fund structure'],
    jurisdiction: 'Luxembourg',
    lob: 'Investment Banking',
    daysInQueue: 4,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0259',
    clientId: 'CLT259',
    clientName: 'Thunder Bay Mining',
    clientType: 'Corporate',
    status: 'in-progress',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-12',
    dueDate: '2024-06-22',
    riskRating: 'High',
    manualReviewReasons: ['Environmental risk assessment', 'Jurisdiction changes'],
    jurisdiction: 'Canada',
    lob: 'Commercial Banking',
    daysInQueue: 6,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0261',
    clientId: 'CLT261',
    clientName: 'Digital Finance Solutions',
    clientType: 'Banking',
    status: 'assigned',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-16',
    dueDate: '2024-06-26',
    riskRating: 'Medium',
    manualReviewReasons: ['Fintech business model review'],
    jurisdiction: 'United Kingdom',
    lob: 'Investment Banking',
    daysInQueue: 2,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0263',
    clientId: 'CLT263',
    clientName: 'Samuel Rodriguez',
    clientType: 'Individual',
    status: 'completed',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-07',
    dueDate: '2024-06-17',
    riskRating: 'Medium',
    manualReviewReasons: ['Standard wealth management review completed'],
    jurisdiction: 'Mexico',
    lob: 'Wealth Management',
    daysInQueue: 9,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0265',
    clientId: 'CLT265',
    clientName: 'Azure Technology Partners',
    clientType: 'Corporate',
    status: 'assigned',
    priority: 'high',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-17',
    dueDate: '2024-06-27',
    riskRating: 'High',
    manualReviewReasons: ['New risk factors ≥5', 'Technology sector assessment'],
    jurisdiction: 'United States',
    lob: 'Commercial Banking',
    daysInQueue: 1,
    escalationPending: true,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0267',
    clientId: 'CLT267',
    clientName: 'Renaissance Art Fund',
    clientType: 'Investment',
    status: 'returned',
    priority: 'low',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-09',
    dueDate: '2024-06-19',
    riskRating: 'Low',
    manualReviewReasons: ['Art valuation assessment'],
    jurisdiction: 'Monaco',
    lob: 'Wealth Management',
    daysInQueue: 9,
    returnReason: 'Art authentication documentation needed',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0269',
    clientId: 'CLT269',
    clientName: 'Global Infrastructure Fund',
    clientType: 'Investment',
    status: 'completed',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-05',
    dueDate: '2024-06-15',
    riskRating: 'High',
    manualReviewReasons: ['Infrastructure risk assessment completed'],
    jurisdiction: 'Luxembourg',
    lob: 'Investment Banking',
    daysInQueue: 11,
    completedDate: '2024-10-06',
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0271',
    clientId: 'CLT271',
    clientName: 'Maria Gonzalez',
    clientType: 'Individual',
    status: 'manual-review',
    priority: 'medium',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-13',
    dueDate: '2024-06-23',
    riskRating: 'Medium',
    manualReviewReasons: ['Income source changes', 'Address verification'],
    jurisdiction: 'Spain',
    lob: 'Private Banking',
    daysInQueue: 5,
    actions: 'actions'
  },
  {
    caseId: 'HRA-2024-0273',
    clientId: 'CLT273',
    clientName: 'Stellar Biotech Industries',
    clientType: 'Corporate',
    status: 'in-progress',
    priority: 'critical',
    assignedAnalyst: currentUser.name,
    createdDate: '2024-06-14',
    dueDate: '2024-06-24',
    riskRating: 'High',
    manualReviewReasons: ['GFC Intelligence flagged', 'Complex pharma structure'],
    jurisdiction: 'Switzerland',
    lob: 'Commercial Banking',
    daysInQueue: 4,
    escalationPending: true,
    actions: 'actions'
  }
];

// Helper function to check if case matches widget filter
export const matchesWidgetFilter = (caseRecord: MyWorkbasketRecord, widgetFilter: WorkbasketFilter) => {
  const today = '2024-10-06'; // Current date
  
  switch (widgetFilter) {
    case 'active':
      return caseRecord.status === 'assigned' || caseRecord.status === 'in-progress';
    case 'escalations':
      return caseRecord.escalationPending === true || 
             caseRecord.manualReviewReasons.some(reason => 
               reason.includes('GFC Intelligence') || 
               reason.includes('Risk drivers') || 
               reason.includes('Client escalation') ||
               reason.includes('TRMS referral')
             );
    case 'completed':
      return caseRecord.status === 'completed' && caseRecord.completedDate === today;
    case 'returned':
      return caseRecord.status === 'returned';
    case 'all':
    default:
      return true;
  }
};

// Calculate widget numbers from the actual data
export const calculateWidgetNumbers = (currentUser: any) => {
  const data = getMockWorkbasketCases(currentUser);
  
  const activeCases = data.filter(item => matchesWidgetFilter(item, 'active')).length;
  const escalationCases = data.filter(item => matchesWidgetFilter(item, 'escalations')).length;
  const completedCases = data.filter(item => matchesWidgetFilter(item, 'completed')).length;
  const returnedCases = data.filter(item => matchesWidgetFilter(item, 'returned')).length;
  
  return {
    active: activeCases,
    escalations: escalationCases,
    completed: completedCases,
    returned: returnedCases
  };
};