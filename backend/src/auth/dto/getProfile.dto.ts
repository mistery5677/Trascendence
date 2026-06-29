export class Score {
  elo!: number;
  wins!: number;
  losses!: number;
  draws!: number;
  totalGames!: number;
  bestWinStreak!: number;
  currentWinStreak!: number;
  averageEloGain!: number;
  averageEloLoss!: number;
  bestElo!: number;
}

export class getProfileDto {
  id!: number;
  name!: string | null;
  username!: string;
  email!: string;
  avatarUrl!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  boardTheme!: number;
  backgroundTheme!: number;
  score!: Score;
}
