<template>
<section class="section">
  <Navigation v-if="form.record.followUpId == null"></Navigation>
  <NavigationTwo v-else></NavigationTwo>
  <br>
  <div class="container">
    <b-steps
        :rounded="true"
        :has-navigation="false"
        mobile-mode="minimalist"
    >
      <b-step-item :step="form.record.followUpId == null ? 4 : 8" label="วาดรูปหน้าปัดนาฬิกา" :clickable="true">
        <div class="has-text-centered" v-if="form.record.followUpId != null">
          <b-tag rounded type="is-danger">เพิ่มการติดตามผล</b-tag>
        </div>
        <div class="notification">
          <label class="label">
            ให้ผู้ถูกทดสอบวาดรูปนาฬิกาโดยใส่ตัวเลขและเข็มนาฬิกาที่เวลา 11.10 น.
          </label>
          <br>
          <b-field class="file is-primary">
            <b-upload v-model="imageFile" class="file-label" type="file">
              <span class="file-cta">
                  <b-icon class="file-icon" icon="upload"></b-icon>
                  <span class="file-label">Click to upload</span>
              </span>
            </b-upload>
          </b-field>
          <span v-if="imageFile">{{ imageFile.name }}</span>
          <b-field label="รวมคะแนน">
            <b-numberinput v-model="form.record.clock.score"></b-numberinput>
          </b-field>
        </div>
      <div class="buttons is-centered">
        <button class="button is-light" @click="$router.back()">
          <span class="icon">
            <i class="fas fa-chevron-left"></i>
          </span>
        </button>
        <button class="button is-primary" @click="saveData" v-if="form.record.followUpId == null">
          <span class="icon">
            <i class="far fa-save"></i>
          </span>
          <span>Save</span>
        </button>
        <button class="button is-primary" @click="saveFollowUpData" v-else>
          <span class="icon">
            <i class="far fa-save"></i>
          </span>
          <span>Save</span>
        </button>
        <router-link :to="{ name: 'MNA' }" class="button is-success" v-if="form.record.followUpId == null">
          <span class="icon">
            <i class="fas fa-chevron-right"></i>
          </span>
        </router-link>
        <router-link :to="{ name: 'FollowUpExhaustion' }" class="button is-success" v-else>
          <span class="icon">
            <i class="fas fa-chevron-right"></i>
          </span>
        </router-link>
      </div>
        <b-image v-if="imageUrl" :src="imageUrl" alt="Clock Photo"></b-image>
      </b-step-item>
    </b-steps>
  </div>
</section>
</template>

<script>
import Navigation from "@/components/navigation";
import {mapState} from "vuex"
import {storage} from "@/firebase";
import NavigationTwo from "@/components/navigationTwo.vue";

let storageRef = storage.ref()

export default {
  name: "Clock",
  components: {NavigationTwo, Navigation},
  data() {
    return {
      imageFile: null,
      imageFileRef: null,
      imageUrl: null
    }
  },
  computed: {
    ...mapState(['form']),
  },
  mounted() {
    let self = this
    if (self.form.record.followUpId == null) {
      this.imageFileRef = storageRef.child(this.form.record.code + '/' + this.form.record.clock.file)
    } else {
      this.imageFileRef = storageRef.child(this.form.record.followUpId + '/' + this.form.record.clock.file)
    }
    this.imageFileRef.getDownloadURL().then((url)=>{
      self.imageUrl = url
    })
  },
  methods: {
    saveData: function () {
      let self = this
      if (self.imageFile) {
        storageRef.child(self.form.record.code + '/' + self.imageFile.name)
            .put(self.imageFile).then(function() {
              self.$store.commit('setClockFileName', self.imageFile.name)
              self.imageFileRef = storageRef.child(self.form.record.code + '/' + self.form.record.clock.file)
              self.imageFileRef.getDownloadURL().then((url)=>{
                self.imageUrl = url
              })
          if (self.form.record.code == null) {
            self.$buefy.dialog.alert({
              title: 'Error!',
              message: 'กรุณาระบุหมายเลขรหัสวิจัย',
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true
            })
          } else {
            self.$store.dispatch('saveForm').then(() => {
              self.$buefy.toast.open({
                message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                type: 'is-success',
              })
            }).catch((error) => {
              self.$buefy.toast.open({
                message: error.toString(),
                type: 'is-danger',
              })
            })
          }
          self.$buefy.toast.open({
            message: 'Upload finished.',
            type: 'is-success'
          })
        }).catch((error)=>{
          self.$buefy.toast.open({
            message: error.toString(),
            type: 'is-danger'
          })
        })
      } else {
        if (self.form.record.code == null) {
          self.$buefy.dialog.alert({
            title: 'Error!',
            message: 'กรุณาระบุหมายเลขรหัสวิจัย',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        } else {
          self.$store.dispatch('saveForm')
        }
      }
    },
    saveFollowUpData: function () {
      let self = this
      if (self.imageFile) {
        storageRef.child(self.form.record.followUpId + '/' + self.imageFile.name)
            .put(self.imageFile).then(function() {
          self.$store.commit('setClockFileName', self.imageFile.name)
          self.imageFileRef = storageRef.child(self.form.record.followUpId + '/' + self.form.record.clock.file)
          self.imageFileRef.getDownloadURL().then((url)=>{
            self.imageUrl = url
          })
          if (self.form.record.code == null) {
            self.$buefy.dialog.alert({
              title: 'Error!',
              message: 'กรุณาระบุหมายเลขรหัสวิจัย',
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true
            })
          } else {
            self.$store.dispatch('saveFollowUpForm').then(() => {
              self.$buefy.toast.open({
                message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                type: 'is-success',
              })
            }).catch((error) => {
              self.$buefy.toast.open({
                message: error.toString(),
                type: 'is-danger',
              })
            })
          }
          self.$buefy.toast.open({
            message: 'Upload finished.',
            type: 'is-success'
          })
        }).catch((error)=>{
          self.$buefy.toast.open({
            message: error.toString(),
            type: 'is-danger'
          })
        })
      } else {
        if (self.form.record.code == null) {
          self.$buefy.dialog.alert({
            title: 'Error!',
            message: 'กรุณาระบุหมายเลขรหัสวิจัย',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        } else {
          self.$store.dispatch('saveFollowUpForm')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>