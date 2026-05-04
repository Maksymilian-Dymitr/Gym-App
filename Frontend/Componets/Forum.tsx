import { useEffect, useState } from "react";
import axios from "axios";

const View = () => {
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [workoutList, setWorkoutList] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/workouts");
        setWorkoutList(res.data);
        if (res.data.length > 0) setWorkoutId(res.data[0].id);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    const fetchSessionByWorkout = async (id: number) => {
      try {
        const { data: sessionLink } = await axios.get(
          `http://localhost:3001/sessions/by-workout/${id}`,
        );

        if (sessionLink && sessionLink.sessionId) {
          const { data: fullSession } = await axios.get(
            `http://localhost:3001/sessions/${sessionLink.sessionId}`,
          );
          setSession(fullSession);
        } else {
          setSession("not-found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSession("not-found");
      }
    };

    if (workoutId !== null) {
      setSession(null);
      fetchSessionByWorkout(workoutId);
    }
  }, [workoutId]);

  if (!session) return <div>Loading session...</div>;

  return (
    <div className="w-[400px] p-4 text-white rounded-xl">
      {session.workouts?.map((workout: any) =>
        workout.workout_id === workoutId ? (
          <div key={workout.workout_id} className="">
            <div className="bg-[#282828] p-3 rounded-t-lg">
              <h3 className="font-medium">{workout.workout_name}</h3>
            </div>

            <ul className="bg-[#212121]">
              {workout.exercises?.map((exercise: any) => (
                <li
                  key={exercise.exercise_id}
                  className="border-b border-gray-600 p-2"
                >
                  <div className="flex justify-between">
                    <p className="font-bold">{exercise.name}</p>
                    {exercise.muscle_groups?.length > 0 && (
                      <p className="text-sm text-gray-300">
                        Muscles:{" "}
                        {exercise.muscle_groups
                          .map((mg: any) => mg?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between mt-1">
                    {exercise.sets?.map((set: any) => (
                      <p key={set.set_id}>
                        {set.reps} reps / {set.amount_of_sets || 1} sets
                      </p>
                    ))}
                    {exercise.sets?.map((set: any) => (
                      <p key={set.set_id + "-weight"}>{set.weight} kg</p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null,
      )}
      <div className="flex justify-between p-3 bg-[#282828] rounded-b-lg">
        <p className="font-medium">Duration</p>
        <p>{session.duration_min} min</p>
      </div>

      <select
        onChange={(e) => setWorkoutId(Number(e.target.value))}
        value={workoutId || ""}
        className="mt-4 w-full px-3 py-2 border border-white rounded-xl
         bg-[#222222] text-white"
      >
        {workoutList.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default View;

