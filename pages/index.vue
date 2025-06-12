<template>
  <v-container class="d-flex justify-center fill-height pa-0">
    <v-row class="text-center align-center fill-height ma-0">
      <v-col class="d-flex flex-column justify-space-between fill-height py-16">
        <div>
          <div class="text-subtitle-1">
            {{ datestamp }}
          </div>
          <div class="text-h2">
            {{ timestamp }}
          </div>
          <div class="text-body-1">{{ statusMessage }}</div>
        </div>

        <div>
          <v-btn
            v-if="clockedIn"
            fab
            large
            width="188"
            height="188"
            color="error"
            :disabled="!canClockOut"
            @click="clockOut"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="56" class="mb-4">mdi-alarm</v-icon>
              <span>Clock Out</span>
            </div>
          </v-btn>
          <v-btn
            v-else
            fab
            large
            width="188"
            height="188"
            color="success"
            :disabled="!canClockIn"
            @click="clockIn"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="56" class="mb-4">mdi-alarm</v-icon>
              <span>Clock In</span>
            </div>
          </v-btn>
        </div>

        <div>
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                rounded
                :class="['ma-2', isOnBreak ? 'orange darken-2' : 'orange']"
                :disabled="!clockedIn || isOnLunch"
                height="76"
                min-width="200"
                max-width="424"
                style="width: calc(100% - 16px)"
                @click="toggleBreak"
              >
                <v-icon left size="32">mdi-coffee</v-icon>
                <span class="text-h6">{{ isOnBreak ? 'End Break' : 'Take Break' }}</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                rounded
                :class="['ma-2', isOnLunch ? 'success darken-2' : 'success']"
                :disabled="!clockedIn || isOnBreak"
                height="76"
                min-width="200"
                max-width="424"
                style="width: calc(100% - 16px)"
                @click="toggleLunch"
              >
                <v-icon left size="32">mdi-food</v-icon>
                <span class="text-h6">{{ isOnLunch ? 'End Lunch' : 'Take Lunch' }}</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <div>
          <v-row class="pa-0 ma-0">
            <v-col cols="12" class="d-flex flex-wrap justify-center">
              <v-btn
                v-for="(btn, index) in buttons"
                :key="index"
                min-width="200"
                height="66"
                :class="['ma-2', getButtonActive(btn) ? 'green' : 'white']"
                :disabled="btn.disabled || isOnBreak"
                :to="btn.route || undefined"
                @click="btn.handler ? handleButtonClick(btn) : undefined"
              >
                <div class="d-flex align-center justify-start" style="width: 100%; padding: 0 16px">
                  <v-icon :class="['rounded-lg', btn.iconColor || 'green']" class="pa-2" size="32">
                    {{ btn.icon }}
                  </v-icon>
                  <span class="black--text ml-4 text-body-1">{{ btn.text }}</span>
                </div>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <!-- <v-col>
        <v-progress-circular
          rotate="270"
          size="160"
          width="10"
          :value="counter"
          color="teal"
        >
          <h1>{{ hours }} Hrs</h1>
        </v-progress-circular>
      </v-col> -->
    </v-row>
    <v-navigation-drawer
      v-model="milesActive"
      absolute
      bottom
      color="primary"
      class="rounded-t-xl mb-n10 pa-4"
      temporary
    >
      <v-text-field v-model="startMiles" label="Mileage Start" type="text" class="dataInput mt-8" />
      <v-text-field v-model="endMiles" label="Mileage End" type="text" class="dataInput mt-8" />
    </v-navigation-drawer>

    <!-- Break Timer Modal -->
    <v-dialog v-model="isOnBreak" persistent max-width="400px" overlay-opacity="0.9">
      <v-card :class="breakCardColor">
        <v-card-title class="text-center d-block">
          <v-icon size="48" class="mb-2">mdi-coffee</v-icon>
          <div class="text-h4">Break Time</div>
        </v-card-title>

        <v-card-text class="text-center">
          <div class="text-h2 mb-4">{{ breakTimeFormatted }}</div>
          <div class="text-subtitle-1">{{ breakStatus }}</div>

          <v-progress-circular
            :value="breakProgress"
            :color="breakColor"
            size="200"
            width="15"
            class="ma-4"
          >
            <span class="text-h5">{{ Math.round(breakProgress) }}%</span>
          </v-progress-circular>
        </v-card-text>

        <v-card-actions class="justify-center pb-6">
          <v-btn color="error" large @click="toggleBreak"> End Break </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      lunchActive: false,
      milesActive: false,
      errors: null,
      datestamp: '',
      timestamp: '',
      success: null,
      clockedIn: false,
      startTime: null,
      endTime: null,
      startLunch: null,
      endLunch: null,
      startMiles: null,
      endMiles: null,
      breakStartTime: null,
      breakDuration: 0,
      breakHistory: [],
      counter: 0,
      hours: 0,
      today: '',
      buttons: [
        {
          text: 'Timesheet',
          icon: 'mdi-newspaper',
          route: '/dashboard',
          iconColor: 'green',
          disabled: false
        },
        {
          text: 'Mileage',
          icon: 'mdi-car',
          handler: 'toggleMileage',
          iconColor: 'green',
          activeKey: 'milesActive',
          disabled: false
        }
      ],
      isOnBreak: false,
      isOnLunch: false,
      breakElapsed: 0,
      breakInterval: null
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    canTakeLunch() {
      return this.clockedIn && !this.endTime && !this.endLunch
    },
    statusMessage() {
      if (!this.clockedIn) return 'Not clocked in'
      if (this.isOnBreak) return `On break (${this.breakTimeFormatted})`
      if (this.isOnLunch) return 'On lunch break'
      return 'Clocked in'
    },
    canClockIn() {
      return !this.clockedIn && !this.startTime
    },
    canClockOut() {
      return this.clockedIn && !this.endTime && !this.isOnBreak && !this.isOnLunch
    },
    currentBreakDuration() {
      if (!this.breakStartTime) return 0
      const now = new Date()
      const start = new Date(this.breakStartTime)
      return Math.round((now - start) / 60000)
    },
    breakTimeFormatted() {
      const minutes = Math.floor(this.breakElapsed / 60)
      const seconds = this.breakElapsed % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    },
    breakProgress() {
      return Math.min(100, (this.breakElapsed / (15 * 60)) * 100)
    },
    breakColor() {
      if (this.breakElapsed >= 15 * 60) return 'error'
      if (this.breakElapsed >= 14 * 60) return 'warning'
      return 'success'
    },
    breakStatus() {
      if (this.breakElapsed >= 15 * 60) return 'Break time exceeded!'
      if (this.breakElapsed >= 14 * 60) return 'Break ending soon!'
      return 'Enjoy your break'
    },
    breakCardColor() {
      return {
        'warning-bg': this.breakElapsed >= 14 * 60 && this.breakElapsed < 15 * 60,
        'error-bg': this.breakElapsed >= 15 * 60
      }
    }
  },
  watch: {
    clockedIn(newValue) {
      localStorage.clockStatus = JSON.stringify(newValue)
    },
    startTime(newTime) {
      localStorage.startTime = newTime
    },
    endTime(newTime) {
      localStorage.endTime = newTime
    },
    startLunch(newTime) {
      localStorage.startLunch = newTime
    },
    endLunch(newTime) {
      localStorage.endLunch = newTime
    },
    startMiles(newTime) {
      localStorage.startMiles = newTime
    },
    endMiles(newTime) {
      localStorage.endMiles = newTime
    },
    breakDuration(newDuration) {
      localStorage.breakDuration = newDuration
    },
    breakHistory(newHistory) {
      localStorage.breakHistory = JSON.stringify(newHistory)
    },
    isOnBreak(newVal) {
      if (newVal) {
        this.$alerter.showMessage({
          content: 'Break started - Take a moment to relax!',
          value: 'info'
        })
      }
    }
  },
  mounted() {
    const tmpDate = new Date()
    this.getDateTime()
    this.today = tmpDate.toISOString().slice(0, 10)

    if (localStorage.clockStatus) {
      this.clockedIn = JSON.parse(localStorage.clockStatus)
    }
    if (localStorage.startTime) {
      this.startTime = localStorage.startTime
      this.clockedIn = true
    }
    if (localStorage.endTime) {
      this.endTime = localStorage.endTime
      this.clockedIn = false
    }
    if (localStorage.startLunch) {
      this.startLunch = localStorage.startLunch
    }
    if (localStorage.endLunch) {
      this.endLunch = localStorage.endLunch
    }
    if (localStorage.startMiles) {
      this.startMiles = localStorage.startMiles
    }
    if (localStorage.endMiles) {
      this.endMiles = localStorage.endMiles
    }
    if (localStorage.breakDuration) {
      this.breakDuration = Number(localStorage.breakDuration)
    }
    if (localStorage.breakHistory) {
      this.breakHistory = JSON.parse(localStorage.breakHistory)
    }

    // Restore break state
    const savedBreak = localStorage.getItem('breakState')
    if (savedBreak) {
      try {
        const { startTime } = JSON.parse(savedBreak)
        if (startTime) {
          const now = new Date()
          const start = new Date(startTime)
          // Calculate elapsed time including time while away
          this.breakElapsed = Math.floor((now - start) / 1000)
          this.breakStartTime = start
          this.isOnBreak = true
          this.startBreakTimer()
        }
      } catch (e) {
        localStorage.removeItem('breakState')
      }
    }

    setInterval(this.getDateTime, 1000)
    setInterval(this.updateBreakDuration, 60000)
  },
  beforeDestroy() {
    this.clearBreakTimer()
  },
  methods: {
    formatDuration(minutes) {
      const hrs = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
    },
    updateBreakDuration() {
      if (this.breakStartTime) {
        this.counter++
      }
    },
    toggleBreak() {
      if (this.isOnBreak) {
        const finalDuration = this.breakTimeFormatted
        this.isOnBreak = false
        this.clearBreakTimer()
        localStorage.removeItem('breakState')
        this.$alerter.showMessage({
          content: `Break ended - Duration: ${finalDuration}`,
          value: 'success'
        })
      } else {
        this.isOnBreak = true
        this.breakStartTime = new Date()
        this.breakElapsed = 0
        this.startBreakTimer()
        localStorage.setItem(
          'breakState',
          JSON.stringify({
            startTime: this.breakStartTime
          })
        )
        this.$alerter.showMessage({
          content: 'Break started',
          value: 'info'
        })
      }
    },
    startBreakTimer() {
      if (this.breakInterval) return
      this.breakInterval = setInterval(() => {
        const now = new Date()
        this.breakElapsed = Math.floor((now - this.breakStartTime) / 1000)
        // Save state every second to ensure accuracy
        localStorage.setItem(
          'breakState',
          JSON.stringify({
            startTime: this.breakStartTime
          })
        )
      }, 1000)
    },
    clearBreakTimer() {
      if (this.breakInterval) {
        clearInterval(this.breakInterval)
        this.breakInterval = null
      }
      this.breakStartTime = null
      this.breakElapsed = 0
    },
    getDateTime() {
      const today = new Date()
      const month = today.toLocaleString('en-us', { month: 'long' })
      const hour = today.getHours()
      const suffix = hour >= 12 ? 'PM' : 'AM'
      const hours = ((hour + 11) % 12) + 1
      let strMonth = '' + today.getMinutes()
      if (strMonth.length === 1) {
        strMonth = '0' + strMonth
      }
      const date = month + ' ' + today.getDate() + ', ' + today.getFullYear()
      const time = hours + ':' + strMonth + suffix
      this.datestamp = date
      this.timestamp = time
    },
    getTimeStamp() {
      return new Date().toISOString()
    },
    lunch() {
      if (!this.canTakeLunch) {
        this.$alerter.showMessage({
          content: 'You must be clocked in to take lunch',
          value: 'error'
        })
        return
      }

      if (!this.startLunch) {
        this.startLunch = this.getTimeStamp()
        this.$alerter.showMessage({
          content: 'Lunch break started',
          value: 'success'
        })
      } else if (!this.endLunch) {
        this.endLunch = this.getTimeStamp()
        this.$alerter.showMessage({
          content: 'Lunch break ended',
          value: 'success'
        })
      } else {
        this.$alerter.showMessage({
          content: 'You have already taken your lunch break',
          value: 'error'
        })
      }
    },
    mileage() {
      if (this.startMiles == null && this.endMiles == null) {
        this.startMiles = prompt('Enter your Start Miles')
        this.milesActive = true
      } else if (this.endMiles == null) {
        this.endMiles = prompt('Enter your End Miles')
      } else {
        this.$alerter.showMessage({
          content: 'Already entered mileage',
          value: 'error'
        })
      }
    },
    clockIn() {
      if (!this.canClockIn) {
        this.$alerter.showMessage({
          content: 'You are already clocked in',
          value: 'error'
        })
        return
      }

      this.clockedIn = true
      this.startTime = this.getTimeStamp()
      this.breakDuration = 0
      this.breakHistory = []
      this.$alerter.showMessage({
        content: 'Successfully clocked in',
        value: 'success'
      })
    },
    clockOut() {
      if (this.isOnBreak) {
        this.$alerter.showMessage({
          content: 'Please end your break before clocking out',
          value: 'error'
        })
        return
      }
      if (!this.canClockOut) {
        this.$alerter.showMessage({
          content: 'Cannot clock out: You are not clocked in',
          value: 'error'
        })
        return
      }

      if (this.breakStartTime) {
        this.toggleBreak()
      }

      this.clockedIn = false
      this.endTime = this.getTimeStamp()
      this.postTime()
    },
    async postTime() {
      this.errors = null
      try {
        await this.$axios.post('/timesheets', {
          startTime: this.startTime,
          endTime: this.endTime,
          startLunch: null,
          endLunch: null,
          startMiles: this.startMiles,
          endMiles: this.endMiles,
          date: this.today,
          owner: this.loggedInUser.username
        })
        this.success = 'Time entry submitted successfully'
        this.$alerter.showMessage({ content: this.success, value: 'success' })
        this.clearLocalStorage()
        this.$router.push('/dashboard')
      } catch (e) {
        this.errors = e.response.data.message[0].messages[0].message
        this.$alerter.showMessage({ content: this.errors, value: 'error' })
      }
    },
    clearLocalStorage() {
      localStorage.clear()
    },
    getButtonActive(btn) {
      if (btn.text === 'Break') {
        return !!this.breakStartTime
      }
      return btn.activeKey ? this[btn.activeKey] : false
    },
    handleButtonClick(btn) {
      if (btn.disabled) {
        this.$alerter.showMessage({
          content: 'This action is not available right now',
          value: 'warning'
        })
        return
      }

      if (btn.handler && typeof this[btn.handler] === 'function') {
        this[btn.handler]()
      }
    },
    toggleMileage() {
      this.milesActive = !this.milesActive
    },
    toggleLunch() {
      if (!this.clockedIn) {
        this.$alerter.showMessage({
          content: 'You must be clocked in to take lunch',
          value: 'error'
        })
        return
      }

      if (!this.startLunch) {
        this.startLunch = this.getTimeStamp()
        this.isOnLunch = true
        this.$alerter.showMessage({
          content: 'Lunch break started',
          value: 'success'
        })
      } else if (!this.endLunch) {
        this.endLunch = this.getTimeStamp()
        this.isOnLunch = false
        this.$alerter.showMessage({
          content: 'Lunch break ended',
          value: 'success'
        })
      } else {
        this.$alerter.showMessage({
          content: 'You have already taken your lunch break',
          value: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.warning-bg {
  background-color: #fff3e0 !important;
}
.error-bg {
  background-color: #ffebee !important;
}
.v-btn.orange {
  background-color: #ff9800 !important;
  color: white !important;
}
.v-btn.orange.darken-2 {
  background-color: #f57c00 !important;
}
</style>
