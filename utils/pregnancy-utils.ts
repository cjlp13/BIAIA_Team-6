import { differenceInDays, addDays } from "date-fns"

// Average pregnancy duration is 280 days (40 weeks)
const PREGNANCY_DURATION_DAYS = 280

/**
 * Calculate pregnancy progress as a percentage
 * @param dueDate The expected due date
 * @returns Progress percentage (0-100)
 */
export function calculatePregnancyProgress(dueDate: string | Date): number {
  if (!dueDate) return 0

  const dueDateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  const today = new Date()

  // Calculate conception date (approximately 280 days before due date)
  const conceptionDate = addDays(dueDateObj, -PREGNANCY_DURATION_DAYS)

  // Calculate days elapsed since conception
  const daysElapsed = differenceInDays(today, conceptionDate)

  // Calculate progress percentage
  let progressPercentage = Math.round((daysElapsed / PREGNANCY_DURATION_DAYS) * 100)

  // Ensure progress is between 0 and 100
  progressPercentage = Math.max(0, Math.min(100, progressPercentage))

  return progressPercentage
}

/**
 * Calculate current pregnancy week
 * @param dueDate The expected due date
 * @returns Current week of pregnancy (1-40)
 */
export function calculatePregnancyWeek(dueDate: string | Date): number {
  if (!dueDate) return 0

  const dueDateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  const today = new Date()

  // Calculate conception date (approximately 280 days before due date)
  const conceptionDate = addDays(dueDateObj, -PREGNANCY_DURATION_DAYS)

  // Calculate days elapsed since conception
  const daysElapsed = differenceInDays(today, conceptionDate)

  // Calculate current week (days / 7, rounded up)
  let currentWeek = Math.ceil(daysElapsed / 7)

  // Ensure week is between 1 and 40
  currentWeek = Math.max(1, Math.min(40, currentWeek))

  return currentWeek
}

/**
 * Determine current trimester
 * @param week Current pregnancy week
 * @returns Trimester (first, second, or third)
 */
export function getCurrentTrimester(week: number): "first" | "second" | "third" {
  if (week <= 13) return "first"
  if (week <= 26) return "second"
  return "third"
}
