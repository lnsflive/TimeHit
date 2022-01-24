<template>
  <v-container class="d-flex justify-center">
    <v-col class="shrink">
      <v-card
        class="rounded-lg mb-8"
        style="background-color:#1d204b;width:326px;height:182px;"
      >
        <v-card
          class="d-flex align-center"
          style="background-color:#5746ea;width:100%;height:134px;"
        >
          <v-row>
            <v-col
              class="d-flex justify-center"
            >
              <v-avatar
                size="70px"
                style="outline: 5px solid white;"
              >
                <v-img :src="avatarImage" />
              </v-avatar>
            </v-col>
            <v-col
              class="ml-n16"
            >
              <h1>Welcome</h1>
              <h3> {{ $auth.user.username }} </h3>
            </v-col>
          </v-row>
        </v-card>
        <v-row>
          <v-col>
            <v-tabs
              v-model="tab"
              background-color="#1d204b"
              class="d-flex justify-center"
            >
              <v-tab>Daily</v-tab>
              <v-tab>Weekly</v-tab>
              <v-tab>Monthly</v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card>
      <v-tabs-items
        v-model="tab"
        style="background:none"
      >
        <v-tab-item
          v-if="timesheets"
        >
          <v-card
            class="rounded-lg"
            style="background-color:#ff8b64;width:326px;height:160px;margin-bottom:25px;"
          >
            <div class="pa-2">
              Last Entry: {{ dailyDate }}
            </div>
            <v-card
              style="background-color:#1d204b;width:100%;height:120px;position:absolute;bottom:-1px;"
            >
              <v-row>
                <v-col>
                  <v-card-subtitle>Work</v-card-subtitle>
                </v-col>
                <v-col>
                  <v-btn fab text style="position:absolute;right:0;top:5px;" @click="viewInfo()">
                    <h1>...</h1>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top:-30px;">
                <v-col>
                  <h1 class="ml-4">
                    {{ dailyHr }}hrs
                  </h1>
                </v-col>
                <v-col>
                  <v-card-subtitle style="position:absolute;right:0;">
                    Mileage: {{ dailyMi }}mi
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
          <v-card
            class="rounded-lg"
            style="background-color:#4bcf83;width:326px;height:160px;"
          >
            <v-card
              style="background-color:#1d204b;width:100%;height:120px;position:absolute;bottom:-1px;padding:1px"
            >
              <v-row>
                <v-col>
                  <v-card-title>Pay</v-card-title>
                </v-col>
                <v-col>
                  <v-btn fab text style="position:absolute;right:0;top:5px;" @click="viewInfo()">
                    <h1>...</h1>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top:-30px;">
                <v-col>
                  <h1 class="ml-4">
                    $ {{ dailyPay }}
                  </h1>
                </v-col>
                <v-col>
                  <v-card-subtitle style="position:absolute;right:0;">
                    {{ dailyHr }}hrs@${{ payRate }}/hr
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-tab-item>
        <v-tab-item
          v-if="timesheets"
        >
          <v-card
            class="rounded-lg"
            style="background-color:#ff8b64;width:326px;height:160px;margin-bottom:25px;"
          >
            <div class="pa-2">
              Entries: {{ weekDates }}
            </div>
            <v-card
              style="background-color:#1d204b;width:100%;height:120px;position:absolute;bottom:-1px;"
            >
              <v-row>
                <v-col>
                  <v-card-subtitle>Work</v-card-subtitle>
                </v-col>
                <v-col>
                  <v-btn fab text style="position:absolute;right:0;top:5px;" @click="viewInfo()">
                    <h1>...</h1>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top:-30px;">
                <v-col>
                  <h1 class="ml-4">
                    {{ weekHr }}hrs
                  </h1>
                </v-col>
                <v-col>
                  <v-card-subtitle style="position:absolute;right:0;">
                    Mileage: {{ weekMi }}mi
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
          <v-card
            class="rounded-lg"
            style="background-color:#4bcf83;width:326px;height:160px;"
          >
            <v-card
              style="background-color:#1d204b;width:100%;height:120px;position:absolute;bottom:-1px;padding:1px"
            >
              <v-row>
                <v-col>
                  <v-card-title>Pay</v-card-title>
                </v-col>
                <v-col>
                  <v-btn fab text style="position:absolute;right:0;top:5px;" @click="viewInfo()">
                    <h1>...</h1>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top:-30px;">
                <v-col cols="7">
                  <h1 class="ml-4">
                    $ {{ weekPay }}
                  </h1>
                </v-col>
                <v-col>
                  <v-card-subtitle style="position:absolute;right:0;">
                    {{ weekHr }}hrs@${{ payRate }}/hr
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <v-col />
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    tab: null,
    error: null,
    allSheets: [],
    weekSheet: [],
    timesheets: [],
    dailyDate: '',
    dailyHr: 0.00,
    dailyMi: 0,
    dailyExp: 0,
    dailyPay: 0.00,
    weekDates: '',
    weekHr: 0.00,
    weekMi: 0,
    payRate: 0,
    weekExp: 0,
    weekPay: 0.00,
    today: ''
  }),
  computed: {
    ...mapGetters(['loggedInUser', 'avatarImage'])
  },
  async mounted () {
    const tmpDate = new Date()
    this.payRate = this.loggedInUser.payRate
    // tmpDate.setDate(tmpDate.getDate() - this.delay)
    this.today = tmpDate.toISOString().slice(0, 10)
    try {
      const response = await this.$axios.get('https://strapi.jaimegonzalezjr.com/timesheets')
      this.allSheets = response.data
      this.weekSheet = this.allSheets.slice(-5)
      this.converForWeek(this.weekSheet)
      this.timesheets = this.allSheets.at(-1)
      this.convertForDay(this.timesheets)
      // eslint-disable-next-line dot-notation
    } catch (e) {
      this.error = e
      this.$alerter.showMessage({ content: this.error, value: 'error' })
    }
  },
  methods: {
    viewInfo () {
      // eslint-disable-next-line no-console
      console.log('view-info')
    },
    convertDown (newTime) {
      return newTime / 1000 / 60 / 60
    },
    calcTime (ts) {
    // get work hours for the day
      const startD = new Date(ts.startTime)
      const endD = new Date(ts.endTime)
      const startL = new Date(ts.startLunch)
      const endL = new Date(ts.endLunch)
      const work = endD - startD
      const lunch = endL - startL
      const diff = work - lunch
      return this.convertDown(diff)
    },
    calcMiles (ts) {
      return ts.endMiles - ts.startMiles - 15
    },
    calcExp (dx) {
      return dx * 0.43
    },
    calcPay (dt) {
      return dt * this.payRate
    },
    convertForDay (ts) {
      this.dailyDate = ts.date
      this.dailyHr = this.calcTime(ts).toFixed(2)
      this.dailyMi = this.calcMiles(ts)
      this.dailyPay = this.calcPay(this.dailyHr) + this.calcExp(this.dailyMi)
    },
    converForWeek (tss) {
      this.weekDates = tss[0].date + ' - ' + tss[4].date
      tss.forEach((ts) => {
        this.weekHr += this.calcTime(ts)
        this.weekMi += this.calcMiles(ts)
      })
      this.weekHr = this.weekHr.toFixed(2)
      this.weekPay = (this.calcPay(this.weekHr) + this.calcExp(this.weekMi))
    }
  }
}
</script>
