export interface IBodyWeightLog {
  id: string;
  user_id: number;
  weight: number;
  date: Date;
  created_at?: Date;
}

export interface ICreateBodyWeightLogRequest {
  user_id: number;
  weight: number;
  date: Date;
}

export interface IBodyWeightRepository {
  getAllBodyWeightLogs(user_id: number): Promise<IBodyWeightLog[]>;
  createBodyWeightLog(logData: ICreateBodyWeightLogRequest): Promise<IBodyWeightLog>;
  getBodyWeightLogById(id: string): Promise<IBodyWeightLog | null>;
  updateBodyWeightLog(id: string, weight: number, date: Date): Promise<boolean>;
  deleteBodyWeightLog(id: string): Promise<boolean>;
}
