<template>
  <v-container>
    <v-dialog
      v-model="avatarDialogue"
    >
      <v-form
        ref="uploadForm"
        class="pa-4 primary pb-16"
        @submit.prevent="uploadToStrapi"
      >
        <v-file-input
          persistent-placeholder
          prepend-icon="mdi-camera"
          name="files"
          placeholder="Choose Image"
          label="Change Avatar"
          @change="checkFile"
        />
        <v-btn type="submit" class="float-right primary">
          Submit
        </v-btn>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="payDialogue"
    >
      <v-form
        ref="uploadForm"
        class="pa-4 primary pb-16"
        @submit.prevent="changeRate"
      >
        <v-text-field
          v-model="newRate"
          persistent-placeholder
          prepend-icon="mdi-cash"
          label="Set Pay Rate"
          :placeholder="payRate"
        />
        <v-btn type="submit" class="float-right primary">
          Submit
        </v-btn>
      </v-form>
    </v-dialog>

    <v-list subheader color="primary" rounded>
      <v-subheader>Settings</v-subheader>
      <v-list-item
        @click="avatarDialogue = !avatarDialogue"
      >
        <v-list-item-avatar>
          <v-img
            :src="avatarImage"
          />
        </v-list-item-avatar>
        <v-list-item-title>Change Profile Picture</v-list-item-title>
        <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
      </v-list-item>
      <v-list-item
        @click="payDialogue = !payDialogue"
      >
        <v-list-item-avatar>
          <v-icon x-large color="success">
            mdi-cash
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Change Pay Rate</v-list-item-title>
        <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {

  data: () => ({
    avatarDialogue: false,
    payDialogue: false,
    selectedFile: null,
    payRate: 0,
    newRate: null,
    t1: '',
    t2: '',
    errors: []
  }),
  computed: {
    ...mapGetters(['loggedInUser', 'avatarImage'])
  },
  mounted () {
    this.payRate = this.loggedInUser.payRate
  },
  methods: {
    checkFile (event) {
      // eslint-disable-next-line no-console
      console.log(event)
      this.selectedFile = event
    },
    async uploadToStrapi () {
      this.errors = null
      // eslint-disable-next-line prefer-const
      let formData = new FormData()
      formData.append('files', this.selectedFile) // Imagine `avatar` here is inside your `data()` after upload
      this.avatarDialogue = false
      try {
        // upload to user.image
        await this.$axios.post('/upload?id=' + this.loggedInUser.id, formData)
        this.$alerter.showMessage({ content: 'File uploaded', value: 'success' })
      } catch (e) {
        this.errors = e.response.data.message[0].messages[0].message
        this.$alerter.showMessage({ content: this.errors, value: 'error' })
      }
    },
    async changeRate () {
      this.errors = null
      this.payDialogue = false
      try {
        await this.$axios.put('/users/' + this.loggedInUser.id, {
          payRate: this.newRate
        })
        location.reload()
        this.success = 'Your pay rate was changed'
        this.$alerter.showMessage({ content: this.success, value: 'success' })
      } catch (e) {
        this.errors = e.response.data.message[0].messages[0].message
        this.$alerter.showMessage({ content: this.errors, value: 'error' })
      }
    }
  }

}
</script>
