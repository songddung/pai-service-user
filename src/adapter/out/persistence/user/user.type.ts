export type UserRecord = {
  user_id: number;
  email: string;
  password_hash: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: Date;
};
