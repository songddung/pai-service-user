export type UserRecord = {
  user_id: bigint;
  email: string;
  password_hash: string;
  address: string | null; // DB 스키마에 따라 null 허용 여부 확인
  latitude: number | null; // DB 스키마에 따라 null 허용 여부 확인
  longitude: number | null; // DB 스키마에 따라 null 허용 여부 확인
  created_at: Date;
};
