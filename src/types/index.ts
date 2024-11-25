export type UserRole = 'user' | 'admin' | 'scouter' | 'coach' | 'team_owner' | 'influencer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  backgroundImage?: string;
  bio?: string;
  country?: string;
  timezone?: string;
  age?: number;
  gender?: string;
  location?: string;
  gamesPlayed: Game[];
  teams: TeamMembership[];
  achievements: Achievement[];
  stats: UserStats;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro';
  hoursPlayed: number;
  rank?: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  backgroundImage?: string;
  description: string;
  country: string;
  timezone: string;
  level: 'hobbyist' | 'amateur' | 'competitor' | 'pro';
  game: Game;
  ranking?: number;
  members: TeamMembership[];
  ownerId: string;
  stats: TeamStats;
  posts: Post[];
  followers: string[];
  tournaments: Tournament[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMembership {
  userId: string;
  teamId: string;
  role: 'owner' | 'captain' | 'player' | 'substitute' | 'coach';
  joinedAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  media?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  likes: string[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  game: string;
  date: Date;
  proof?: string;
}

export interface UserStats {
  wins: number;
  losses: number;
  draws: number;
  tournamentWins: number;
  matchesPlayed: number;
}

export interface TeamStats {
  wins: number;
  losses: number;
  draws: number;
  tournamentWins: number;
  matchesPlayed: number;
  ranking: number;
}

export interface Tournament {
  id: string;
  name: string;
  game: Game;
  startDate: Date;
  endDate: Date;
  teams: string[];
  matches: Match[];
  status: 'upcoming' | 'ongoing' | 'completed';
  prize?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  score?: {
    team1: number;
    team2: number;
  };
  status: 'scheduled' | 'ongoing' | 'completed';
  startTime: Date;
  endTime?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'tournament' | 'match' | 'practice' | 'meeting';
  startTime: Date;
  endTime: Date;
  participants: string[];
  location?: string;
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  eventId: string;
  userId: string;
  time: Date;
  type: 'email' | 'push' | 'in_app';
  sent: boolean;
}