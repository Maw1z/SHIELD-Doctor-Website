export function getStatusFromScore(score: number) {
  if (score >= 0.7) return "Critical";
  if (score >= 0.3) return "For Watch";
  return "Stable";
}
