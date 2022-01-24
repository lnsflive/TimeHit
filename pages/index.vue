<template>
  <v-container class="d-flex justify-center">
    <v-row class="text-center align-center">
      <v-col>
        <span style="font-size:18px">
          {{ datestamp }}
        </span><br>
        <span style="font-size:54px">
          {{ timestamp }}
        </span><br>
        Field Service Technician<br>
        <v-btn
          v-if="test == true"
          fab
          large
          width="188px"
          height="188px"
          color="error"
          class="mt-6"
          @click="clockOut"
        >
          <v-icon
            style="padding:30px;margin-top:-30px"
            size="56px"
          >
            mdi-alarm
          </v-icon>
          <div
            style="position:absolute;top:30px;"
          >
            Clock Out
          </div>
        </v-btn>
        <v-btn
          v-else
          fab
          large
          width="188px"
          height="188px"
          color="success"
          class="mt-6"
          @click="clockIn"
        >
          <v-icon
            style="padding:30px;margin-top:-30px"
            size="56px"
          >
            mdi-alarm
          </v-icon>
          <div
            style="position:absolute;top:30px;"
          >
            Clock In
          </div>
        </v-btn>
        <v-row>
          <v-col>
            <v-btn
              rounded
              class="ma-3"
              color="orange"
              height="42px"
              width="90%"
            >
              <v-icon>
                mdi-coffee
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          class="pa-0 ma-0"
        >
          <v-col>
            <v-btn
              width="155px"
              height="66px"
              class="black--text ma-2"
              color="white"
              to="/dashboard"
            >
              <v-icon
                color="white"
                left
                style="background-color:green;border-radius:20px;padding:20px;"
              >
                mdi-newspaper
              </v-icon>
              Timesheet
            </v-btn>
            <v-btn
              width="155px"
              height="66px"
              class="black--text ma-2"
              :class="[lunchActive? 'green': 'white']"
              @click="lunch"
            >
              <v-icon
                color="white"
                left
                style="background-color:green;border-radius:20px;padding:20px;"
              >
                mdi-silverware-fork-knife
              </v-icon>
              Lunch
            </v-btn>
            <v-btn
              width="155px"
              height="66px"
              class="black--text ma-2"
              color="white"
              click=""
            >
              <v-icon
                color="white"
                left
                style="background-color:green;border-radius:20px;padding:20px;"
              >
                mdi-map-marker
              </v-icon>
              Locations
            </v-btn>
            <v-btn
              width="155px"
              height="66px"
              class="black--text ma-2"
              :class="[milesActive? 'green': 'white']"
              @click="milesActive = !milesActive"
            >
              <v-icon
                color="white"
                left
                style="background-color:green;border-radius:20px;padding:20px;"
              >
                mdi-car
              </v-icon>
              Mileage
            </v-btn>
          </v-col>
        </v-row>
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
      <v-text-field
        v-model="startMiles"
        label="Mileage Start"
        type="text"
        class="dataInput mt-8"
      />
      <v-text-field
        v-model="endMiles"
        label="Mileage End"
        type="text"
        class="dataInput mt-8"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data: () => ({
    lunchActive: false,
    milesActive: false,
    errors: null,
    datestamp: '',
    timestamp: '',
    success: null,
    test: null,
    startTime: null,
    endTime: null,
    startLunch: null,
    endLunch: null,
    startMiles: null,
    endMiles: null,
    counter: 0,
    hours: 0,
    today: ''
  }),
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  watch: {
    test (newName) {
      localStorage.clockStatus = newName
    },
    startTime (newTime) {
      localStorage.startTime = newTime
    },
    endTime (newTime) {
      localStorage.endTime = newTime
    },
    startLunch (newTime) {
      localStorage.startLunch = newTime
    },
    endLunch (newTime) {
      localStorage.endLunch = newTime
    },
    startMiles (newTime) {
      localStorage.startMiles = newTime
    },
    endMiles (newTime) {
      localStorage.endMiles = newTime
    }
  },
  mounted () {
    const tmpDate = new Date()
    this.getDateTime()
    // tmpDate.setDate(tmpDate.getDate() - this.delay)
    this.today = tmpDate.toISOString().slice(0, 10)
    if (localStorage.clockStatus) { this.test = JSON.parse(localStorage.clockStatus) }
    if (localStorage.startTime) { this.startTime = localStorage.startTime }
    if (localStorage.endTime) { this.endTime = localStorage.endTime }
    if (localStorage.startLunch) { this.startLunch = localStorage.startLunch; this.lunchActive = true }
    if (localStorage.endLunch) { this.endLunch = localStorage.endLunch }
    if (localStorage.startMiles) { this.startMiles = localStorage.startMiles }
    if (localStorage.endMiles) { this.endMiles = localStorage.endMiles }
    setInterval(this.getDateTime, 1000)
  },
  methods: {
    getDateTime () {
      const today = new Date()
      const month = today.toLocaleString('en-us', { month: 'long' })
      const hour = today.getHours()
      const suffix = hour >= 12 ? 'PM' : 'AM'
      const hours = ((hour + 11) % 12 + 1)
      let strMonth = '' + today.getMinutes()
      if (strMonth.length === 1) {
        strMonth = '0' + strMonth
      }
      const date = month + ' ' + today.getDate() + ', ' + today.getFullYear()
      const time = hours + ':' + strMonth + suffix
      this.datestamp = date
      this.timestamp = time
    },
    getTimeStamp () {
      return new Date().toISOString()
    },
    lunch () {
      if (this.startLunch == null && this.endLunch == null) {
        this.startLunch = this.getTimeStamp()
        this.lunchActive = true
      } else if (this.endLunch == null) {
        this.endLunch = this.getTimeStamp()
      } else {
        this.$alerter.showMessage({ content: 'Already entered your lunch', value: 'error' })
      }
    },
    mileage () {
      if (this.startMiles == null && this.endMiles == null) {
        this.startMiles = prompt('Enter your Start Miles')
        this.milesActive = true
      } else if (this.endMiles == null) {
        this.endMiles = prompt('Enter your End Miles')
      } else {
        this.$alerter.showMessage({ content: 'Already entered mileage', value: 'error' })
      }
    },
    clockIn () {
      if (this.test === false) {
        this.$alerter.showMessage({ content: 'Already entered mileage', value: 'error' })
      } else {
        this.test = true
        this.startTime = this.getTimeStamp()
      }
      // try {
      //   await this.$axios.put('/content-manager/collection-types/plugins::users-permissions.user/' + this.loggedInUser.id, {
      //     isClockedIn: true
      //   })
      //   this.success = 'Clocked In'
      //   this.$alerter.showMessage({ content: this.success, value: 'success' })
      // } catch (e) {
      //   this.errors = e.response.data.message[0].messages[0].message
      //   this.$alerter.showMessage({ content: this.errors, value: 'error' })
      // }
    },
    clockOut () {
      this.test = false
      this.endTime = this.getTimeStamp()
      this.postTime()
    },
    async postTime () {
      this.errors = null
      try {
        await this.$axios.post('/timesheets', {
          startTime: this.startTime,
          endTime: this.endTime,
          startLunch: this.startLunch,
          endLunch: this.endLunch,
          startMiles: this.startMiles,
          endMiles: this.endMiles,
          date: this.today,
          owner: this.loggedInUser.username
        })
        this.success = 'Submitted'
        this.$alerter.showMessage({ content: this.success, value: 'success' })
        this.clearLocalStorage()
        this.$router.push('/dashboard')
      } catch (e) {
        this.errors = e.response.data.message[0].messages[0].message
        this.$alerter.showMessage({ content: this.errors, value: 'error' })
      }
    },
    clearLocalStorage () {
      localStorage.clear()
    },
    checkSwitch () {
      if (this.test == null) {
        this.clockIn()
      } else {
        this.clockOut()
      }
    }
  }
}
</script>
