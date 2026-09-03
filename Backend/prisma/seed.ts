import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

const EXERCISES = [
  { name: 'Barbell Bench Press',    equipment: ['Barbell', 'Bench'],       muscleGroups: ['Chest', 'Triceps', 'Front Delts'] },
  { name: 'Overhead Press',          equipment: ['Barbell'],                 muscleGroups: ['Shoulders', 'Triceps'] },
  { name: 'Incline Dumbbell Press',  equipment: ['Dumbbell', 'Bench'],      muscleGroups: ['Chest', 'Front Delts'] },
  { name: 'Dips',                    equipment: ['Bodyweight', 'Dip Bar'],  muscleGroups: ['Chest', 'Triceps'] },
  { name: 'Tricep Pushdown',         equipment: ['Cable'],                  muscleGroups: ['Triceps'] },
  { name: 'Lateral Raises',          equipment: ['Dumbbell'],               muscleGroups: ['Side Delts'] },
  { name: 'Barbell Deadlift',        equipment: ['Barbell'],                muscleGroups: ['Back', 'Hamstrings', 'Glutes'] },
  { name: 'Pull-ups',                equipment: ['Bodyweight', 'Pull-up Bar'], muscleGroups: ['Back', 'Biceps'] },
  { name: 'Barbell Row',             equipment: ['Barbell'],                muscleGroups: ['Back', 'Biceps'] },
  { name: 'Cable Row',               equipment: ['Cable'],                  muscleGroups: ['Back', 'Biceps'] },
  { name: 'Lat Pulldown',            equipment: ['Cable', 'Machine'],       muscleGroups: ['Back', 'Biceps'] },
  { name: 'Barbell Curl',            equipment: ['Barbell'],                muscleGroups: ['Biceps'] },
  { name: 'Face Pull',               equipment: ['Cable'],                  muscleGroups: ['Rear Delts', 'Rotator Cuff'] },
  { name: 'Barbell Squat',           equipment: ['Barbell', 'Rack'],        muscleGroups: ['Quads', 'Glutes', 'Hamstrings'] },
  { name: 'Romanian Deadlift',       equipment: ['Barbell'],                muscleGroups: ['Hamstrings', 'Glutes'] },
  { name: 'Leg Press',               equipment: ['Machine'],                muscleGroups: ['Quads', 'Glutes'] },
  { name: 'Leg Curl',                equipment: ['Machine'],                muscleGroups: ['Hamstrings'] },
  { name: 'Leg Extension',           equipment: ['Machine'],                muscleGroups: ['Quads'] },
  { name: 'Calf Raise',              equipment: ['Machine'],                muscleGroups: ['Calves'] },
  { name: 'Bulgarian Split Squat',   equipment: ['Dumbbell', 'Bench'],      muscleGroups: ['Quads', 'Glutes'] },
  { name: 'Ab Wheel Rollout',        equipment: ['Ab Wheel'],               muscleGroups: ['Abs', 'Core'] },
  { name: 'Cable Crunch',            equipment: ['Cable'],                  muscleGroups: ['Abs'] },
];

// 6 weeks of Push/Pull/Legs — one session every 2 days, 3 per week
const PUSH_DAYS  = [41, 34, 27, 20, 13, 6];
const PULL_DAYS  = [39, 32, 25, 18, 11, 4];
const LEGS_DAYS  = [37, 30, 23, 16,  9, 2];
const LABELS     = ['A', 'B', 'C', 'D', 'E', 'F'];

// Progressive overload per week: [bench, ohp, incline_db, pushdown, laterals]
const PUSH_W = [
  [60, 40, 20, 30, 10],
  [62.5, 42.5, 22.5, 32.5, 10],
  [65, 42.5, 22.5, 35, 12],
  [67.5, 45, 25, 35, 12],
  [70, 47.5, 25, 37.5, 12],
  [72.5, 50, 27.5, 40, 12],
];

// [deadlift, row, lat_pulldown, curl, face_pull]
const PULL_W = [
  [100, 60, 55, 15, 20],
  [105, 62.5, 57.5, 17.5, 22.5],
  [110, 65, 60, 17.5, 22.5],
  [115, 67.5, 62.5, 20, 25],
  [120, 70, 65, 20, 25],
  [125, 72.5, 67.5, 22.5, 27.5],
];

// [squat, rdl, leg_press, leg_curl, calf_raise]
const LEGS_W = [
  [80,  60,  100, 40, 60],
  [82.5, 62.5, 110, 42.5, 65],
  [85,  65,  120, 42.5, 65],
  [87.5, 67.5, 130, 45, 70],
  [90,  70,  135, 47.5, 75],
  [95,  75,  140, 50, 80],
];

// Body weight: starts at 82 kg, slight drop each week
const BW_SCHEDULE = [
  { daysAgo: 43, weight: 82.0 },
  { daysAgo: 36, weight: 81.8 },
  { daysAgo: 29, weight: 81.5 },
  { daysAgo: 22, weight: 81.2 },
  { daysAgo: 15, weight: 81.0 },
  { daysAgo:  8, weight: 80.8 },
  { daysAgo:  1, weight: 80.5 },
];

type SetInput = { name: string; equipment: string[]; muscleGroups: string[]; sets: number; reps: number; weight: number };

function makeSet(exerciseName: string, sets: number, reps: number, weight: number, ex: typeof EXERCISES[0]): SetInput {
  return { name: exerciseName, equipment: ex.equipment, muscleGroups: ex.muscleGroups, sets, reps, weight };
}

async function main() {
  console.log('🌱 Seeding database…');

  // ── 1. Exercises ──────────────────────────────────────────────────────────
  for (const ex of EXERCISES) {
    await prisma.exerciseCatalog.upsert({
      where:  { name: ex.name },
      update: {},
      create: ex,
    });
  }
  console.log(`✓ ${EXERCISES.length} exercises upserted`);

  // ── 2. Users ──────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const demoHash  = await bcrypt.hash('Demo123!', 10);

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@hercules.dev' },
    update: {},
    create: { email: 'admin@hercules.dev', password: adminHash, role: 'Admin' },
  });

  const demo = await prisma.user.upsert({
    where:  { email: 'demo@hercules.dev' },
    update: {},
    create: { email: 'demo@hercules.dev', password: demoHash, role: 'User' },
  });

  console.log(`✓ Users: ${admin.email} (Admin), ${demo.email} (User)`);

  // ── 3. Body weight logs ───────────────────────────────────────────────────
  for (const entry of BW_SCHEDULE) {
    await prisma.bodyWeightLog.create({
      data: { user_id: demo.id, body_weight: entry.weight, date: daysAgo(entry.daysAgo) },
    });
  }
  console.log(`✓ ${BW_SCHEDULE.length} body weight entries`);

  // ── 4. Workouts ───────────────────────────────────────────────────────────
  const exMap = Object.fromEntries(EXERCISES.map(e => [e.name, e]));

  let workoutCount = 0;

  for (let i = 0; i < 6; i++) {
    const label = LABELS[i]!;

    // Push
    const pushInputs: SetInput[] = [
      makeSet('Barbell Bench Press',   4, 8,  PUSH_W[i]![0]!, exMap['Barbell Bench Press']!),
      makeSet('Overhead Press',         3, 8,  PUSH_W[i]![1]!, exMap['Overhead Press']!),
      makeSet('Incline Dumbbell Press', 3, 10, PUSH_W[i]![2]!, exMap['Incline Dumbbell Press']!),
      makeSet('Tricep Pushdown',        3, 12, PUSH_W[i]![3]!, exMap['Tricep Pushdown']!),
      makeSet('Lateral Raises',         3, 15, PUSH_W[i]![4]!, exMap['Lateral Raises']!),
    ];
    await createWorkout(demo.id, `Push Day ${label}`, daysAgo(PUSH_DAYS[i]!), pushInputs);
    workoutCount++;

    // Pull
    const pullInputs: SetInput[] = [
      makeSet('Barbell Deadlift', 4, 5,  PULL_W[i]![0]!, exMap['Barbell Deadlift']!),
      makeSet('Barbell Row',      4, 8,  PULL_W[i]![1]!, exMap['Barbell Row']!),
      makeSet('Lat Pulldown',     3, 10, PULL_W[i]![2]!, exMap['Lat Pulldown']!),
      makeSet('Barbell Curl',     3, 10, PULL_W[i]![3]!, exMap['Barbell Curl']!),
      makeSet('Face Pull',        3, 15, PULL_W[i]![4]!, exMap['Face Pull']!),
    ];
    await createWorkout(demo.id, `Pull Day ${label}`, daysAgo(PULL_DAYS[i]!), pullInputs);
    workoutCount++;

    // Legs
    const legsInputs: SetInput[] = [
      makeSet('Barbell Squat',    4, 8,  LEGS_W[i]![0]!, exMap['Barbell Squat']!),
      makeSet('Romanian Deadlift', 3, 10, LEGS_W[i]![1]!, exMap['Romanian Deadlift']!),
      makeSet('Leg Press',         3, 12, LEGS_W[i]![2]!, exMap['Leg Press']!),
      makeSet('Leg Curl',          3, 12, LEGS_W[i]![3]!, exMap['Leg Curl']!),
      makeSet('Calf Raise',        4, 15, LEGS_W[i]![4]!, exMap['Calf Raise']!),
    ];
    await createWorkout(demo.id, `Legs Day ${label}`, daysAgo(LEGS_DAYS[i]!), legsInputs);
    workoutCount++;
  }

  console.log(`✓ ${workoutCount} workouts created`);
  console.log('\n🎉 Seed complete!');
  console.log('   Admin: admin@hercules.dev / Admin123!');
  console.log('   Demo:  demo@hercules.dev  / Demo123!');
}

async function createWorkout(userId: string, title: string, date: Date, inputs: SetInput[]) {
  return prisma.$transaction(async (tx) => {
    const createdSets = await Promise.all(
      inputs.map(s =>
        tx.set.create({
          data: {
            name:                 s.name,
            equipment:            s.equipment,
            muscleGroups:         s.muscleGroups,
            sets:                 s.sets,
            reps:                 s.reps,
            weight:               s.weight,
            volume:               s.reps * s.weight,
            total_exercise_volume: s.sets * s.reps * s.weight,
            user_id:              userId,
          },
        })
      )
    );

    const totalVolume = createdSets.reduce((acc, s) => acc + s.total_exercise_volume, 0);

    const workout = await tx.workout.create({
      data: {
        title,
        creator_id:           userId,
        user_id:              userId,
        date,
        total_workout_volume: totalVolume,
      },
    });

    await tx.set.updateMany({
      where: { id: { in: createdSets.map(s => s.id) } },
      data:  { workout_id: workout.id },
    });

    return workout;
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
