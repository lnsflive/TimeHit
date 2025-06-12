<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>Summary</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-card outlined>
              <v-card-text class="text-center">
                <div class="text-h4">{{ formatDuration(report.summary.totalHours) }}</div>
                <div class="text-subtitle-1">Total Hours</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card outlined>
              <v-card-text class="text-center">
                <div class="text-h4">${{ report.summary.totalPay.toFixed(2) }}</div>
                <div class="text-subtitle-1">Total Pay</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card outlined>
              <v-card-text class="text-center">
                <div class="text-h4">{{ report.summary.totalMiles }}</div>
                <div class="text-subtitle-1">Total Miles</div>
                <div class="text-caption">
                  ${{ report.summary.mileageReimbursement.toFixed(2) }} reimbursement
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-tabs v-model="activeTab" grow>
      <v-tab>Daily</v-tab>
      <v-tab>Weekly</v-tab>
      <v-tab>Monthly</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <v-data-table
          :headers="headers"
          :items="dailyItems"
          :items-per-page="7"
          class="elevation-1"
        >
          <template #[`item.date`]="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #[`item.hours`]="{ item }">
            {{ formatDuration(item.hours) }}
          </template>
          <template #[`item.pay`]="{ item }"> ${{ (item.hours * payRate).toFixed(2) }} </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item>
        <v-data-table
          :headers="weeklyHeaders"
          :items="weeklyItems"
          :items-per-page="7"
          class="elevation-1"
        >
          <template #[`item.dateRange`]="{ item }">
            {{ formatDateRange(item.startDate, item.endDate) }}
          </template>
          <template #[`item.hours`]="{ item }">
            {{ formatDuration(item.hours) }}
          </template>
          <template #[`item.pay`]="{ item }"> ${{ (item.hours * payRate).toFixed(2) }} </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item>
        <v-data-table
          :headers="monthlyHeaders"
          :items="monthlyItems"
          :items-per-page="7"
          class="elevation-1"
        >
          <template #[`item.month`]="{ item }">
            {{ formatMonth(item.month) }}
          </template>
          <template #[`item.hours`]="{ item }">
            {{ formatDuration(item.hours) }}
          </template>
          <template #[`item.pay`]="{ item }"> ${{ (item.hours * payRate).toFixed(2) }} </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { generateTimesheetReport, formatDuration, formatDateRange } from '@/utils/timesheet'

export default {
  props: {
    entries: {
      type: Array,
      required: true
    },
    payRate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeTab: 0,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Hours', value: 'hours' },
        { text: 'Miles', value: 'miles' },
        { text: 'Pay', value: 'pay' }
      ],
      weeklyHeaders: [
        { text: 'Week', value: 'dateRange' },
        { text: 'Hours', value: 'hours' },
        { text: 'Miles', value: 'miles' },
        { text: 'Pay', value: 'pay' },
        { text: 'Days Worked', value: 'daysWorked' }
      ],
      monthlyHeaders: [
        { text: 'Month', value: 'month' },
        { text: 'Hours', value: 'hours' },
        { text: 'Miles', value: 'miles' },
        { text: 'Pay', value: 'pay' },
        { text: 'Days Worked', value: 'daysWorked' }
      ]
    }
  },
  computed: {
    report() {
      return generateTimesheetReport(this.entries, { payRate: this.payRate })
    },
    dailyItems() {
      return Object.entries(this.report.daily).map(([date, data]) => ({
        date,
        hours: data.totalHours,
        miles: data.totalMiles,
        pay: data.totalHours * this.payRate
      }))
    },
    weeklyItems() {
      return Object.entries(this.report.weekly).map(([startDate, data]) => ({
        startDate,
        endDate: this.getWeekEndDate(startDate),
        hours: data.totalHours,
        miles: data.totalMiles,
        pay: data.totalHours * this.payRate,
        daysWorked: data.uniqueDays.length
      }))
    },
    monthlyItems() {
      return Object.entries(this.report.monthly).map(([month, data]) => ({
        month,
        hours: data.totalHours,
        miles: data.totalMiles,
        pay: data.totalHours * this.payRate,
        daysWorked: data.uniqueDays.length
      }))
    }
  },
  methods: {
    formatDuration,
    formatDateRange,
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    },
    formatMonth(monthStr) {
      const [year, month] = monthStr.split('-')
      return new Date(year, month - 1).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      })
    },
    getWeekEndDate(startDate) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + 6)
      return date.toISOString().split('T')[0]
    }
  }
}
</script>
