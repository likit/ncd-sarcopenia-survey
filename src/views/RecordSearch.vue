<template>
  <section class="section">
    <Navigation></Navigation>
    <br>
    <div class="container">
      <div class="has-text-centered">
        <h1 class="title">ณ จังหวัด{{ $store.state.province.name }}</h1>
        <div class="buttons is-centered">
          <button @click="addRecord" class="button is-light is-success">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span>
            <span>เพิ่มรายการ</span>
          </button>
          <button @click="fetch(query)" class="button is-light">
            <span class="icon">
              <i class="fas fa-redo-alt"></i>
            </span>
            <span>refresh</span>
          </button>
        </div>
      </div>
      <b-field label="Filter">
        <b-radio native-value="all" v-model="createdBy">ทั้งหมด</b-radio>
        <b-radio native-value="yours" v-model="createdBy">สร้างโดยฉัน</b-radio>
      </b-field>
      <b-field label="Search">
        <b-input placeholder="research code" v-model="query" type="search" :expanded="true"></b-input>
        <p class="control">
          <b-button class="button is-primary" @click="fetch(query)">
            <span class="icon">
              <i class="fas fa-search"></i>
            </span>
            <span>Search</span>
          </b-button>
        </p>
      </b-field>
      <b-table :data="filteredItems"
               :paginated="true"
               :default-sort="['code', 'firstname']"
               :debounce-search="1000">
        <b-table-column field="code" label="Code" sortable v-slot="props">
          {{ props.row.code }}
        </b-table-column>
        <b-table-column field="firstname" label="First Name" sortable v-slot="props">
          {{ props.row.firstname }}
        </b-table-column>
        <b-table-column field="lastname" label="Last Name" sortable v-slot="props">
          {{ props.row.lastname }}
        </b-table-column>
        <b-table-column field="province" label="Province" sortable v-slot="props">
          {{ props.row.province }}
        </b-table-column>
        <b-table-column field="creator" label="Creator" sortable v-slot="props">
          {{ props.row.creator }}
        </b-table-column>
        <b-table-column sortable v-slot="props">
          <div class="buttons">
            <button @click="setRecord(props.row.code)" class="button is-primary is-light">
            <span class="icon">
              <i class="fas fa-pencil-alt"></i>
            </span>
              <span>Edit</span>
            </button>
            <button @click="deleteRecord(props.row.id)" class="button is-danger is-light">
            <span class="icon">
              <i class="fas fa-trash"></i>
            </span>
              <span>Delete</span>
            </button>
          </div>
        </b-table-column>
      </b-table>
    </div>
  </section>
</template>

<script>
import Navigation from "@/components/navigation";
import {records, auth} from '../firebase';
import {mapState} from "vuex";

export default {
  name: "RecordSearch",
  components: {Navigation},
  data() {
    return {
      query: '',
      createdBy: "all",
      items: [],
    }
  },
  computed: {
    ...mapState(['province']),
    filteredItems: function() {
      let self = this
      let fltItems;
      fltItems = this.items.filter((d)=>{
        if (self.createdBy !== 'all') {
          return d.creator === auth.currentUser.email
        } else {
          return true
        }
      })
      return fltItems
    }
  },
  methods: {
    addRecord: function() {
      this.$store.commit('resetForm')
      this.$router.push({name: 'FormMain'})
    },
    setRecord: function(code) {
      let self = this
      records.where('code', '==', code)
          .where('province', '==', self.province.name)
          .get().then((snapshot) => {
            if (!snapshot.empty) {
              let d = snapshot.docs[0]
              this.$store.dispatch('setRecord', d.data()).then(()=>{
                self.$router.push({ name: 'FormMain'})
              })
            }
      })
    },
    deleteRecord: function(id) {
      this.$buefy.dialog.confirm({
        type: 'is-warning',
        title: 'ยืนยันการลบรายการ',
        message: 'ท่านต้องการลบรายการนี้หรือไม่',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
        ariaRole: 'alertdialog',
        ariaModal: true,
        onConfirm: ()=>{
          records.doc(id).delete().then(()=> {
            this.$buefy.toast.open({
              message: 'The record has been deleted.',
              type: 'is-success'})
            this.items = this.items.filter((d)=>{
              return d.id != id
            })
          }).catch(()=>this.$buefy.toast.open({
            message: 'Oops, the error occurred.',
            type: 'is-danger'
          }))
        }
      })
    },
    fetchAll: function() {
      let self = this
      records.where('province', '==', self.$store.state.province.name).get()
          .then((snapshot) => {
            snapshot.forEach((r) => {
              let d = r.data()
              self.items.push({
                id: r.id,
                code: d.code,
                firstname: d.personal.firstname,
                lastname: d.personal.lastname,
                province: d.province,
                updatedAt: d.lastUpdate.datetime,
                creator: d.creator,
              })
            })
          })
    },
    fetch: function(code) {
      let self = this
      self.items.splice(0)
      if (code == '') {
        self.fetchAll()
      } else {
        records.where('province', '==', self.$store.state.province.name)
            .where('code', '==', code).get()
            .then((snapshot) => {
              snapshot.forEach((r) => {
                let d = r.data()
                self.items.push({
                  id: r.id,
                  code: d.code,
                  firstname: d.personal.firstname,
                  lastname: d.personal.lastname,
                  province: d.province,
                  updatedAt: d.lastUpdate.datetime,
                  creator: d.creator,
                })
              })
            })
      }
    },
  },
  mounted() {
    if (this.$route.params.query) {
      this.query = this.$route.params.query
    }
    this.fetch(this.query)
  }
}
</script>

<style scoped>

</style>