/**
 * Calculate the total hours worked for a timesheet entry
 * @param {Object} entry - Timesheet entry
 * @returns {number} Hours worked (decimal)
 */
export const calculateHoursWorked = (entry) => {
  if (!entry.startTime || !entry.endTime) return 0

  const start = new Date(entry.startTime)
  const end = new Date(entry.endTime)
  const totalMinutes = (end - start) / (1000 * 60) // Convert to minutes

  // If there's a lunch break, subtract it
  if (entry.startLunch && entry.endLunch) {
    const lunchStart = new Date(entry.startLunch)
    const lunchEnd = new Date(entry.endLunch)
    const lunchMinutes = (lunchEnd - lunchStart) / (1000 * 60)
    return (totalMinutes - lunchMinutes) / 60 // Convert to hours
  }

  return totalMinutes / 60 // Convert to hours
}

/**
 * Calculate miles driven for a timesheet entry
 * @param {Object} entry - Timesheet entry
 * @returns {number} Miles driven
 */
export const calculateMilesDriven = (entry) => {
  if (!entry.startMiles || !entry.endMiles) return 0
  return parseInt(entry.endMiles) - parseInt(entry.startMiles)
}

/**
 * Group timesheet entries by date ranges
 * @param {Array} entries - Array of timesheet entries
 * @param {string} grouping - 'daily', 'weekly', or 'monthly'
 * @returns {Object} Grouped entries with calculations
 */
export const groupTimesheetEntries = (entries, grouping = 'daily') => {
  const grouped = {}

  entries.forEach((entry) => {
    let key
    const date = new Date(entry.date)

    switch (grouping) {
      case 'weekly': {
        // Get the Monday of the week
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)
        const monday = new Date(date.setDate(diff))
        key = monday.toISOString().split('T')[0]
        break
      }

      case 'monthly': {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      }

      default:
        // daily
        key = entry.date
    }

    if (!grouped[key]) {
      grouped[key] = {
        entries: [],
        totalHours: 0,
        totalMiles: 0,
        averageHoursPerDay: 0,
        uniqueDays: new Set()
      }
    }

    grouped[key].entries.push(entry)
    grouped[key].totalHours += calculateHoursWorked(entry)
    grouped[key].totalMiles += calculateMilesDriven(entry)
    grouped[key].uniqueDays.add(entry.date)
  })

  // Calculate averages and clean up
  Object.values(grouped).forEach((group) => {
    group.averageHoursPerDay = group.totalHours / group.uniqueDays.size
    group.uniqueDays = Array.from(group.uniqueDays) // Convert Set to Array
  })

  return grouped
}

/**
 * Generate a summary report for timesheet entries
 * @param {Array} entries - Array of timesheet entries
 * @param {Object} options - Report options
 * @returns {Object} Report summary
 */
export const generateTimesheetReport = (entries, options = {}) => {
  const { startDate, endDate, payRate = 0 } = options

  // Filter entries by date range if provided
  let filteredEntries = entries
  if (startDate && endDate) {
    filteredEntries = entries.filter((entry) => {
      const date = new Date(entry.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
  }

  // Calculate totals
  const totalHours = filteredEntries.reduce((sum, entry) => sum + calculateHoursWorked(entry), 0)
  const totalMiles = filteredEntries.reduce((sum, entry) => sum + calculateMilesDriven(entry), 0)
  const uniqueDays = new Set(filteredEntries.map((entry) => entry.date)).size

  // Group by different periods
  const dailyGroups = groupTimesheetEntries(filteredEntries, 'daily')
  const weeklyGroups = groupTimesheetEntries(filteredEntries, 'weekly')
  const monthlyGroups = groupTimesheetEntries(filteredEntries, 'monthly')

  return {
    summary: {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalMiles,
      totalDays: uniqueDays,
      averageHoursPerDay: parseFloat((totalHours / uniqueDays).toFixed(2)),
      totalPay: parseFloat((totalHours * payRate).toFixed(2)),
      mileageReimbursement: parseFloat((totalMiles * 0.655).toFixed(2)) // Current IRS rate
    },
    daily: dailyGroups,
    weekly: weeklyGroups,
    monthly: monthlyGroups
  }
}

/**
 * Format a duration in hours to a human-readable string
 * @param {number} hours - Number of hours
 * @returns {string} Formatted duration
 */
export const formatDuration = (hours) => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)

  if (wholeHours === 0) {
    return `${minutes}m`
  }

  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`
}

/**
 * Format a date range for display
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString(
    'en-US',
    options
  )}`
}
