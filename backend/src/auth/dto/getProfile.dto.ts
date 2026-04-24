export class getProfileDto {
  id!: number;
  name!: string | null;
  username!: string;
  email!: string;
  avatarUrl!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  elo!: number;
  wins!: number;
  losses!: number;
  draws!: number;
}
