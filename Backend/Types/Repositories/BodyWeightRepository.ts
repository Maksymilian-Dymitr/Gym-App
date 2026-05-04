export interface BodyWeightLog {
  id: string;
  user_id: number;
  weight: number;
  date: Date;
  created_at?: Date;
}

export interface CreateBodyWeightLogRequest {
  user_id: number;
  weight: number;
  date: Date;
}

export interface BodyWeightRepository {
  getAllBodyWeightLogs(user_id: number): Promise<BodyWeightLog[]>;
  createBodyWeightLog(logData: CreateBodyWeightLogRequest): Promise<BodyWeightLog>;
  getBodyWeightLogById(id: string): Promise<BodyWeightLog | null>;
  updateBodyWeightLog(id: string, weight: number, date: Date): Promise<boolean>;
  deleteBodyWeightLog(id: string): Promise<boolean>;
}
