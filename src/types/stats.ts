import { Timestamp } from "firebase/firestore";
import { Player } from "./user";

export type Stats = {
  id: string;
  owner: Player;
  timestamp: Timestamp;
  pointsPerGame: number; // Points per game (PPG)
  fieldGoalPercentage: number; // Field goal percentage (FG%)
  threePointPercentage: number; // Three-point percentage (3P%)
  freeThrowPercentage: number; // Free throw percentage (FT%)
  reboundsPerGame: number; // Rebounds per game (RPG)
  offensiveReboundsPerGame: number; // Offensive rebounds per game (OREB)
  defensiveReboundsPerGame: number; // Defensive rebounds per game (DREB)
  assistsPerGame: number; // Assists per game (APG)
  stealsPerGame: number; // Steals per game (SPG)
  blocksPerGame: number; // Blocks per game (BPG)
  turnoversPerGame: number; // Turnovers per game (TO)
  playerEfficiencyRating: number; // Player efficiency rating (PER)
  plusMinus: number; // Plus/Minus (+/-)
  minutesPerGame: number; // Minutes per game (MPG)
  usageRate: number; // Usage rate (USG%)
  trueShootingPercentage: number; // True shooting percentage (TS%)
  effectiveFieldGoalPercentage: number; // Effective field goal percentage (eFG%)
  winShares: number; // Win shares (WS)
  offensiveRating: number; // Offensive rating (ORtg)
  defensiveRating: number; // Defensive rating (DRtg)
  assistToTurnoverRatio: number; // Assist-to-turnover ratio (A/TO)
  foulsPerGame: number; // Fouls per game (FPG)
};
