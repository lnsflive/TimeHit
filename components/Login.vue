<template>
  <v-container style="height: 100%" class="d-flex align-center justify-center">
    <v-card style="background: #1d204b; width: 300px; padding: 20px">
      <v-form ref="form" v-model="valid" @submit.prevent="checkSend">
        <h3 class="text-center text-h3 my-8">TimeForge</h3>
        <v-divider />
        <v-card-text style="font-size: 35px" class="text-center pb-8 accent--text">
          {{ status }}
        </v-card-text>
        <v-text-field
          ref="username"
          v-model="username"
          prepend-inner-icon="mdi-email"
          autocomplete="username"
          autofocus
          label="Username"
          type="text"
          value="u"
          name="username"
          :placeholder="placeUsername"
          persistent-placeholder
          outlined
          clearable
          rounded
          required
          tabindex="1"
        />
        <v-text-field
          v-if="registered"
          v-model="email"
          :rules="emailRules"
          prepend-inner-icon="mdi-email"
          autocomplete="email"
          label="E-mail"
          type="email"
          value="sample"
          name="e"
          :placeholder="placeEmail"
          persistent-placeholder
          outlined
          clearable
          rounded
          required
          tabindex="2"
        />
        <v-text-field
          v-model="password"
          :rules="nameRules"
          prepend-inner-icon="mdi-key"
          autocomplete="password"
          label="Password"
          name="password"
          :placeholder="placePass"
          persistent-placeholder
          value="p"
          outlined
          clearable
          rounded
          type="password"
          required
          tabindex="3"
        />
        <v-btn
          block
          :disabled="!valid"
          color="success"
          style="height: 50px; margin-top: 10px"
          type="submit"
        >
          {{ btnStatus }}
        </v-btn>
        <v-btn
          block
          color="warning"
          style="width: 100%; height: 50px; margin-top: 20px"
          @click="clear"
        >
          reset
        </v-btn>
        <v-btn text plain class="float-right" @click="toggleRegister">
          {{ btnRegister }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    username: '',
    status: 'Login',
    btnStatus: 'Submit',
    btnRegister: 'Register',
    registered: false,
    placeUsername: 'Username',
    placeEmail: 'Email',
    placePass: 'Password',
    error: null,
    autofill: false,
    valid: false,
    email: null,
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    password: null,
    nameRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 10) || 'Password must be more than 10 characters'
    ]
  }),
  computed: {
    counter() {
      return this.$store.state.counter
    },
    user() {
      return this.$strapi.user
    }
  },
  methods: {
    async register() {
      this.error = null
      try {
        this.$axios.setToken(false)
        await this.$axios.post('auth/local/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.$alerter.showMessage({ content: 'Please confirm your email', value: 'success' })
        this.clear()
        this.toggleRegister()
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message
        this.$alerter.showMessage({ content: this.error, value: 'error' })
      }
    },
    async login() {
      this.error = null
      try {
        await this.$auth.loginWith('local', {
          data: {
            identifier: this.username,
            password: this.password
          }
        })
        this.$alerter.showMessage({
          content: 'Welcome ' + this.$auth.user.username,
          value: 'success'
        })
      } catch (e) {
        this.error = e.response.data.message[0].messages[0].message
        this.$notifier.showMessage({ content: this.error, color: 'error', timeout: 3000 })
      }
    },
    clear() {
      this.$refs.form.reset()
      this.$refs.username.focus()
    },
    toggleRegister() {
      if (!this.registered) {
        this.status = 'Register'
        this.btnStatus = 'Register'
        this.btnRegister = 'Already a User'
        this.registered = true
      } else {
        this.status = 'Login'
        this.btnStatus = 'Submit'
        this.btnRegister = 'Register'
        this.registered = false
      }
    },
    checkSend() {
      if (this.registered) {
        this.register()
      } else {
        this.login()
      }
    }
  }
}
</script>
<style>
.v-input input:invalid,
input:-webkit-autofill {
  border: none;
  -webkit-text-fill-color: #787dbf;
  box-shadow: 0 0 0px 1000px #1d204b inset;
  -webkit-box-shadow: 0 0 0px 1000px #1d204b inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
