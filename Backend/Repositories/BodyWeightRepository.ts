import { db } from "../DB/mongo";
import { ObjectId } from "mongodb";
import type { IBodyWeightRepository, IBodyWeightLog, ICreateBodyWeightLogRequest } from "../Types/Repositories/IBodyWeightRepository";

const bodyWeightCollection = db.collection("body_weight_logs");

export async function getAllBodyWeightLogs(user_id: number): Promise<IBodyWeightLog[]> {
  const results = await bodyWeightCollection.find({ user_id }).toArray();
  return results.map(doc => ({
    id: (doc._id as ObjectId).toString(),
    user_id: doc.user_id,
    weight: doc.weight,
    date: doc.date,
    created_at: doc.created_at
  }));
}

export async function createBodyWeightLog(logData: ICreateBodyWeightLogRequest): Promise<IBodyWeightLog> {
  const newLog = {
    ...logData,
    created_at: new Date()
  };
  
  const result = await bodyWeightCollection.insertOne(newLog);
  return {
    id: result.insertedId.toString(),
    ...newLog
  };
}

export async function getBodyWeightLogById(id: string): Promise<IBodyWeightLog | null> {
  const objectId = new ObjectId(id);
  const result = await bodyWeightCollection.findOne({ _id: objectId });
  
  if (!result) return null;
  
  return {
    id: (result._id as ObjectId).toString(),
    user_id: result.user_id,
    weight: result.weight,
    date: result.date,
    created_at: result.created_at
  };
}

export async function updateBodyWeightLog(id: string, weight: number, date: Date): Promise<boolean> {
  const objectId = new ObjectId(id);
  const result = await bodyWeightCollection.updateOne(
    { _id: objectId },
    { $set: { weight, date } }
  );
  return result.matchedCount > 0;
}

export async function deleteBodyWeightLog(id: string): Promise<boolean> {
  const objectId = new ObjectId(id);
  const result = await bodyWeightCollection.deleteOne({ _id: objectId });
  return result.deletedCount > 0;
}
