// Personality type calculator based on 7 Spark Quiz answers
export type PersonalityType = 'steady_flame' | 'electric_spark' | 'deep_current' | 'shifting_tide';

export function calculatePersonality(answers: Record<string, 'A' | 'B'>): PersonalityType {
  let expressive = 0;
  let active = 0;

  // Q1: A=expressive, B=active
  if (answers.q1 === 'A') expressive++;
  else active++;

  // Q4: A=expressive (sends message), B=active (tells in person)
  if (answers.q4 === 'A') expressive++;
  else active++;

  // Q6: A=expressive, B=active
  if (answers.q6 === 'A') expressive++;
  else active++;

  // Q7: A=expressive, B=deep
  if (answers.q7 === 'A') expressive++;

  // Q2: A=deep, B=present
  const isDeeply = answers.q2 === 'A' && answers.q3 === 'A';
  const isPresent = answers.q2 === 'B' && answers.q5 === 'B';

  const isExpressive = expressive > active;

  if (isExpressive && isDeeply) return 'deep_current';
  if (isExpressive && isPresent) return 'steady_flame';
  if (!isExpressive && isDeeply) return 'shifting_tide';
  return 'electric_spark';
}

// Score segment resolver
export function getSegment(score: number): string {
  if (score <= 2) return 'segment_1';
  if (score <= 4) return 'segment_2';
  if (score <= 6) return 'segment_3';
  if (score <= 8) return 'segment_4';
  return 'segment_5';
}
