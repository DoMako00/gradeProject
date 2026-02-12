import type { JobStatus } from '../../../components/ui';

export type MechanicRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface MechanicRequestItem {
  id: string;
  customerName: string;
  customerAvatar?: string;
  problem: string;
  status: MechanicRequestStatus;
  requestTime: string;
  locationLat: number;
  locationLng: number;
  distanceKm: number;
  carImages?: string[];
  phone?: string;
}

export interface MechanicJobItem {
  id: string;
  customerName: string;
  customerAvatar?: string;
  problem: string;
  status: JobStatus;
  eta: string;
  distanceKm: number;
  startTime?: string;
  endTime?: string;
  locationLat: number;
  locationLng: number;
  /** UI-only fields for card layout */
  priceLabel: string;
  serviceType: string;
  locationLabel: string;
  scheduledTime: string;
  phone?: string;
}

export interface MechanicProfilePortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface MechanicProfileData {
  name: string;
  avatarUrl?: string;
  workshopName: string;
  rating: number;
  experienceYears: number;
  services: string[];
  serviceAreas: string[];
  portfolio: MechanicProfilePortfolioItem[];
  availability: boolean;
  jobsCompleted: number;
  avgResponseTimeMin: number;
  avgJobDurationMin: number;
  email: string;
  phone?: string;
}

export const mechanicOrigin = {
  lat: 40.758,
  lng: -73.9855,
};

export const mockMechanicRequests: MechanicRequestItem[] = [
  {
    id: 'req-1001',
    customerName: 'Lena Brooks',
    problem: 'Engine overheats after 10 minutes of driving.',
    status: 'pending',
    requestTime: '10:15 AM',
    locationLat: 40.7625,
    locationLng: -73.9801,
    distanceKm: 1.2,
    carImages: ['https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=1200'],
    phone: '+1 212 555 0101',
  },
  {
    id: 'req-1002',
    customerName: 'Marcus Hall',
    problem: 'Flat tire near downtown bridge.',
    status: 'accepted',
    requestTime: '09:52 AM',
    locationLat: 40.7548,
    locationLng: -73.9903,
    distanceKm: 0.8,
    phone: '+1 212 555 0159',
  },
  {
    id: 'req-1003',
    customerName: 'Noah Carter',
    problem: 'Battery dead and the car will not start.',
    status: 'pending',
    requestTime: '09:10 AM',
    locationLat: 40.7492,
    locationLng: -73.9771,
    distanceKm: 1.9,
  },
  {
    id: 'req-1004',
    customerName: 'Ava Nguyen',
    problem: 'Brake pedal feels soft and unsafe.',
    status: 'rejected',
    requestTime: '08:44 AM',
    locationLat: 40.7444,
    locationLng: -73.9729,
    distanceKm: 2.7,
  },
];

export const mockMechanicJobs: MechanicJobItem[] = [
  /* ─── On the way ─── */
  {
    id: 'job-201',
    customerName: 'Marcus Hall',
    problem: 'Flat tire replacement and pressure check.',
    status: 'on_the_way',
    eta: 'ETA 12 min',
    distanceKm: 0.8,
    startTime: '09:55 AM',
    locationLat: 40.7548,
    locationLng: -73.9903,
    priceLabel: '$85',
    serviceType: 'Tire Replacement',
    locationLabel: '7th Ave & W 47th St',
    scheduledTime: '10:10 AM',
    phone: '+1 212 555 0159',
  },
  {
    id: 'job-204',
    customerName: 'Olivia Chen',
    problem: 'Car won\'t start, possible dead battery.',
    status: 'on_the_way',
    eta: 'ETA 8 min',
    distanceKm: 0.5,
    locationLat: 40.7580,
    locationLng: -73.9856,
    priceLabel: '$65',
    serviceType: 'Battery Jump Start',
    locationLabel: 'Times Square, W 42nd St',
    scheduledTime: '10:25 AM',
    phone: '+1 212 555 0301',
  },
  {
    id: 'job-207',
    customerName: 'Daniel Kim',
    problem: 'Locked out of vehicle, keys inside.',
    status: 'on_the_way',
    eta: 'ETA 18 min',
    distanceKm: 2.1,
    locationLat: 40.7614,
    locationLng: -73.9776,
    priceLabel: '$55',
    serviceType: 'Lockout Assistance',
    locationLabel: 'E 51st St & Madison Ave',
    scheduledTime: '10:40 AM',
    phone: '+1 212 555 0422',
  },

  /* ─── Working ─── */
  {
    id: 'job-202',
    customerName: 'Sophia Reed',
    problem: 'Alternator diagnostics and replacement.',
    status: 'working',
    eta: 'ETA 25 min',
    distanceKm: 1.4,
    startTime: '08:50 AM',
    locationLat: 40.7476,
    locationLng: -73.9788,
    priceLabel: '$220',
    serviceType: 'Alternator Repair',
    locationLabel: '5th Ave & E 34th St',
    scheduledTime: '09:15 AM',
    phone: '+1 212 555 0234',
  },
  {
    id: 'job-205',
    customerName: 'James Porter',
    problem: 'Brake pads worn down, grinding noise when stopping.',
    status: 'working',
    eta: 'ETA 40 min',
    distanceKm: 1.8,
    startTime: '09:30 AM',
    locationLat: 40.7505,
    locationLng: -73.9934,
    priceLabel: '$180',
    serviceType: 'Brake Pad Replacement',
    locationLabel: 'W 34th St & 8th Ave',
    scheduledTime: '09:45 AM',
    phone: '+1 212 555 0377',
  },

  /* ─── Completed ─── */
  {
    id: 'job-203',
    customerName: 'Ethan Bell',
    problem: 'Coolant leak fixed and refill complete.',
    status: 'completed',
    eta: 'Completed',
    distanceKm: 2.3,
    startTime: '07:20 AM',
    endTime: '08:05 AM',
    locationLat: 40.7662,
    locationLng: -73.9921,
    priceLabel: '$120',
    serviceType: 'Coolant Service',
    locationLabel: 'Broadway & W 59th St',
    scheduledTime: '07:00 AM',
  },
  {
    id: 'job-206',
    customerName: 'Mia Rodriguez',
    problem: 'Oil change and filter replacement.',
    status: 'completed',
    eta: 'Completed',
    distanceKm: 3.1,
    startTime: '06:45 AM',
    endTime: '07:15 AM',
    locationLat: 40.7425,
    locationLng: -73.9888,
    priceLabel: '$75',
    serviceType: 'Oil Change',
    locationLabel: 'W 23rd St & 6th Ave',
    scheduledTime: '06:30 AM',
  },
  {
    id: 'job-208',
    customerName: 'Liam O\'Brien',
    problem: 'Windshield wiper motor replacement.',
    status: 'completed',
    eta: 'Completed',
    distanceKm: 1.6,
    startTime: '06:00 AM',
    endTime: '06:35 AM',
    locationLat: 40.7527,
    locationLng: -73.9772,
    priceLabel: '$95',
    serviceType: 'Wiper Motor Repair',
    locationLabel: 'E 42nd St & Lexington Ave',
    scheduledTime: '05:45 AM',
  },
];

export const mockMechanicProfile: MechanicProfileData = {
  name: 'Alex Turner',
  workshopName: 'TurboFix Garage',
  rating: 4.9,
  experienceYears: 8,
  services: [
    'Engine diagnostics',
    'Battery replacement',
    'Brake system repair',
    'Flat tire rescue',
    'Oil and filter service',
  ],
  serviceAreas: ['Midtown', 'Upper East Side', 'Downtown', 'Brooklyn Heights'],
  portfolio: [
    {
      id: 'pf-1',
      title: 'Transmission overhaul',
      imageUrl: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1200',
    },
    {
      id: 'pf-2',
      title: 'Classic car electrical restore',
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200',
    },
    {
      id: 'pf-3',
      title: 'SUV suspension tuning',
      imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200',
    },
  ],
  availability: true,
  jobsCompleted: 438,
  avgResponseTimeMin: 9,
  avgJobDurationMin: 54,
  email: 'alex.turner@turbofix.example',
  phone: '+1 212 555 0190',
};

