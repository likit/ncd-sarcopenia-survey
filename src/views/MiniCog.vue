<template>
<section class="section">
  <Navigation v-if="form.record.followUpId == null"></Navigation>
  <Navigationtwo v-else></Navigationtwo>
  <br>
  <div class="container">
    <b-steps
        :rounded="true"
        :has-navigation="false"
        mobile-mode="minimalist"
    >
      <b-step-item :step="form.record.followUpId == null ? 3 : 7" label="สมรรถภาพเบื้องต้น" :clickable="true">
        <div class="has-text-centered" v-if="form.record.followUpId != null">
          <b-tag rounded type="is-danger">เพิ่มการติดตามผล</b-tag>
        </div>
        <label class="label">Three Word Registration</label>
        <b-field label="ให้ตั้งใจฟังดี ๆ เดี๋ยวจะบอกคำ 3 คำ เมื่อพูดจบแล้วให้พูดตามและจำไว้เดี๋ยวจะกลับมาถามซ้ำ">
          <ul>
            <li>หลานสาว</li>
            <li>สวรรค์</li>
            <li>ภูเขา</li>
          </ul>
        </b-field>
        <b-field label="ให้ตั้งใจฟังดี ๆ เดี๋ยวจะบอกคำ 3 คำ เมื่อพูดจบแล้วให้พูดตามและจำไว้เดี๋ยวจะกลับมาถามซ้ำ">
          <b-checkbox :disabled="q4 == true"
                      @input="updateScore('หลานสาว')" v-model="q1">หลานสาว</b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox :disabled="q4 == true"
                      @input="updateScore('สวรรค์')" v-model="q2">สวรรค์</b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox :disabled="q4 == true"
                      @input="updateScore('ภูเขา')" v-model="q3">ภูเขา</b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox :disabled="q1 == true || q2 == true || q3 == true"
                      @input="updateScore('None')" v-model="q4">จำไม่ได้ทั้งหมด</b-checkbox>
        </b-field>
        <p>
          คะแนน {{ form.record.minicog.score !== null ? form.record.minicog.score : 'N/A' }}
        </p>
      </b-step-item>
    </b-steps>
    <div class="buttons is-centered">
      <button class="button is-light" @click="$router.back()">
        <span class="icon">
          <i class="fas fa-chevron-left"></i>
        </span>
      </button>
      <button class="button is-primary" @click="saveData">
        <span class="icon">
          <i class="far fa-save"></i>
        </span>
        <span>Save</span>
      </button>
      <router-link :to="{ name: 'Clock' }" class="button is-success">
        <span class="icon">
          <i class="fas fa-chevron-right"></i>
        </span>
      </router-link>
    </div>
  </div>
</section>
</template>

<script>
import Navigation from "@/components/navigation";
import {mapState} from "vuex";
import Navigationtwo from "@/components/navigationTwo.vue";

export default {
  name: "MiniCog",
  components: {Navigationtwo, Navigation},
  data() {
    return {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
    }
  },
  computed: {
    ...mapState(['form'])
  },
  mounted() {
    let self = this
    this.form.record.minicog.items.forEach((d)=>{
      switch (d) {
        case "หลานสาว":
          self.q1 = true;
          break;
        case "สวรรค์":
          self.q2 = true;
          break;
        case "ภูเขา":
          self.q3 = true;
          break;
        case "None":
          self.q4 = true;
          break;
      }
    })
  },
  methods: {
    updateScore: function (item) {
      this.$store.commit('updateMiniCogItems', item)
    },
    saveData() {
      let self = this
      if (this.form.record.code == null) {
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
        if (this.form.record.followUpId != null) {
          this.$store.dispatch('saveFollowUpForm')
        } else {
          this.$store.dispatch('saveForm')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>