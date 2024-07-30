// stats.ts

import { Timestamp } from "firebase/firestore";
import { users } from "./users"; // Assuming users are defined in users.ts
import { Stats } from "@/types/stats";
import { Player } from "@/types";

// Generate 10 mock data
export const stats: Stats[] = [
  {
    id: "stats1",
    owner: users[0] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 25.4,
    fieldGoalPercentage: 48.2,
    threePointPercentage: 36.5,
    freeThrowPercentage: 85.1,
    reboundsPerGame: 8.7,
    offensiveReboundsPerGame: 2.1,
    defensiveReboundsPerGame: 6.6,
    assistsPerGame: 5.2,
    stealsPerGame: 1.8,
    blocksPerGame: 0.7,
    turnoversPerGame: 2.5,
    playerEfficiencyRating: 25.3,
    plusMinus: 8.2,
    minutesPerGame: 34.5,
    usageRate: 28.1,
    trueShootingPercentage: 60.3,
    effectiveFieldGoalPercentage: 54.1,
    winShares: 10.2,
    offensiveRating: 115,
    defensiveRating: 104,
    assistToTurnoverRatio: 2.1,
    foulsPerGame: 2.3,
  },
  {
    id: "stats2",
    owner: users[1] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 18.3,
    fieldGoalPercentage: 42.7,
    threePointPercentage: 34.8,
    freeThrowPercentage: 79.4,
    reboundsPerGame: 7.4,
    offensiveReboundsPerGame: 1.9,
    defensiveReboundsPerGame: 5.5,
    assistsPerGame: 6.1,
    stealsPerGame: 2.0,
    blocksPerGame: 0.9,
    turnoversPerGame: 3.1,
    playerEfficiencyRating: 20.8,
    plusMinus: 5.7,
    minutesPerGame: 32.1,
    usageRate: 25.4,
    trueShootingPercentage: 56.7,
    effectiveFieldGoalPercentage: 49.6,
    winShares: 8.3,
    offensiveRating: 110,
    defensiveRating: 108,
    assistToTurnoverRatio: 2.0,
    foulsPerGame: 2.7,
  },
  {
    id: "stats3",
    owner: users[2] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 22.1,
    fieldGoalPercentage: 45.6,
    threePointPercentage: 38.2,
    freeThrowPercentage: 81.3,
    reboundsPerGame: 9.0,
    offensiveReboundsPerGame: 2.5,
    defensiveReboundsPerGame: 6.5,
    assistsPerGame: 4.3,
    stealsPerGame: 1.9,
    blocksPerGame: 1.1,
    turnoversPerGame: 2.8,
    playerEfficiencyRating: 23.5,
    plusMinus: 7.1,
    minutesPerGame: 35.0,
    usageRate: 26.7,
    trueShootingPercentage: 58.2,
    effectiveFieldGoalPercentage: 51.4,
    winShares: 9.1,
    offensiveRating: 112,
    defensiveRating: 106,
    assistToTurnoverRatio: 1.5,
    foulsPerGame: 2.6,
  },
  {
    id: "stats4",
    owner: users[3] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 15.6,
    fieldGoalPercentage: 41.9,
    threePointPercentage: 33.7,
    freeThrowPercentage: 78.5,
    reboundsPerGame: 6.3,
    offensiveReboundsPerGame: 1.7,
    defensiveReboundsPerGame: 4.6,
    assistsPerGame: 3.9,
    stealsPerGame: 1.6,
    blocksPerGame: 0.5,
    turnoversPerGame: 2.1,
    playerEfficiencyRating: 17.4,
    plusMinus: 4.3,
    minutesPerGame: 30.2,
    usageRate: 22.5,
    trueShootingPercentage: 54.1,
    effectiveFieldGoalPercentage: 46.7,
    winShares: 6.7,
    offensiveRating: 108,
    defensiveRating: 110,
    assistToTurnoverRatio: 1.9,
    foulsPerGame: 2.8,
  },
  {
    id: "stats5",
    owner: users[4] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 27.8,
    fieldGoalPercentage: 50.4,
    threePointPercentage: 40.1,
    freeThrowPercentage: 89.6,
    reboundsPerGame: 7.8,
    offensiveReboundsPerGame: 2.0,
    defensiveReboundsPerGame: 5.8,
    assistsPerGame: 4.9,
    stealsPerGame: 2.2,
    blocksPerGame: 1.3,
    turnoversPerGame: 2.7,
    playerEfficiencyRating: 28.1,
    plusMinus: 9.4,
    minutesPerGame: 36.3,
    usageRate: 30.2,
    trueShootingPercentage: 64.0,
    effectiveFieldGoalPercentage: 57.3,
    winShares: 11.5,
    offensiveRating: 117,
    defensiveRating: 102,
    assistToTurnoverRatio: 2.5,
    foulsPerGame: 2.4,
  },
  {
    id: "stats6",
    owner: users[0] as Player,
    timestamp: Timestamp.now(),
    pointsPerGame: 14.7,
    fieldGoalPercentage: 39.8,
    threePointPercentage: 32.4,
    freeThrowPercentage: 76.3,
    reboundsPerGame: 5.9,
    offensiveReboundsPerGame: 1.8,
    defensiveReboundsPerGame: 4.1,
    assistsPerGame: 4.5,
    stealsPerGame: 1.5,
    blocksPerGame: 0.6,
    turnoversPerGame: 2.3,
    playerEfficiencyRating: 16.9,
    plusMinus: 3.8,
    minutesPerGame: 29.5,
    usageRate: 21.7,
    trueShootingPercentage: 52.8,
    effectiveFieldGoalPercentage: 44.9,
    winShares: 5.9,
    offensiveRating: 106,
    defensiveRating: 111,
    assistToTurnoverRatio: 1.9,
    foulsPerGame: 3.0,
  },
];