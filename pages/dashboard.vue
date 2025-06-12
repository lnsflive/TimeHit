<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Timesheet Report</span>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">
                  <v-icon left> mdi-calendar </v-icon>
                  {{ dateRangeText }}
                </v-btn>
              </template>
              <v-date-picker v-model="dateRange" range no-title @input="menu = false" />
            </v-menu>
          </v-card-title>

          <v-divider />

          <timesheet-report :entries="filteredEntries" :pay-rate="payRate" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TimesheetReport from '@/components/TimesheetReport.vue'

export default {
  components: {
    TimesheetReport
  },
  data() {
    return {
      entries: [],
      dateRange: [],
      menu: false,
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    payRate() {
      return this.loggedInUser?.payRate || 0
    },
    dateRangeText() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        return 'All Time'
      }
      return `${this.dateRange[0]} to ${this.dateRange[1]}`
    },
    filteredEntries() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        return this.entries
      }
      return this.entries.filter((entry) => {
        const date = entry.date
        return date >= this.dateRange[0] && date <= this.dateRange[1]
      })
    }
  },
  async mounted() {
    await this.fetchTimesheets()
  },
  methods: {
    async fetchTimesheets() {
      this.loading = true
      this.error = null
      try {
        const response = await this.$axios.get('/timesheets', {
          params: {
            owner: this.loggedInUser.username
          }
        })
        this.entries = response.data
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to fetch timesheets'
        this.$alerter.showMessage({ content: this.error, value: 'error' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
