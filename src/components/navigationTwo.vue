<template>
  <b-navbar :mobile-burger="true" :shadow="false" :fixed-top="true" type="is-primary">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-icon icon="home" size="is-medium"></b-icon>
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item :to="{ name: 'Province' }" tag="router-link">
        จังหวัด
      </b-navbar-item>
      <b-navbar-item :to="{ name: 'MainPage' }" tag="router-link">
        หน้าแรก
      </b-navbar-item>
      <b-navbar-item>
        รหัสวิจัย {{ form.record.code }}
      </b-navbar-item>
      <b-navbar-dropdown label="Form">
        <b-navbar-item :to="{ name: 'FollowUpMain'}" tag="router-link">
          หน้าแรก
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpPersonal'}" tag="router-link">
          ข้อมูลส่วนตัว
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpFRAILScale'}" tag="router-link">
          FRAIL
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpBIA' }" tag="router-link">
          แบบบันทึกการประเมิน BIA
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpBADL'}" tag="router-link">
          ADL
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpIADL'}" tag="router-link">
          IADL
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpMNA'}" tag="router-link">
          แบบประเมินภาวะโภชนาการ (MNA)
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpMiniCog'}" tag="router-link">
          สมรรถภาพเบื้องต้น (Mini Cog)
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpClock'}" tag="router-link">
          วาดรูปหน้าปัดนาฬิกา
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpExhaustion'}" tag="router-link">
          Self-report Exhaustion
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpGPAQ'}" tag="router-link">
          GPAQ
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpEQ-5D-5L'}" tag="router-link">
          EQ-5D-5L
        </b-navbar-item>
        <b-navbar-item :to="{ name: 'FollowUpBehavior' }" tag="router-link">
          พฤติกรรมการกิน ออกกำลังกาย และอารมณ์
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "navigationtwo",
  computed: {
    ...mapState(['form']),
  }
}
</script>

<style scoped>

</style>