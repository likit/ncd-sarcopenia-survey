import Vue from 'vue'
import Vuex from 'vuex'
import {auth, records} from '../firebase'
import {ToastProgrammatic} from "buefy";

Vue.use(Vuex)

function initializeForm() {
    return {
        record: {
            province: null,
            creator: null,
            lastUpdate: [],
            code: null,
            recordDate: new Date(),
            personal: {
                id: null,
                firstname: null,
                lastname: null,
                height: null,
                weight: null,
                gender: null,
                age: null,
                maritalStatus: null,
                address: null,
                education: null,
                living: null,
                saving: null,
                club: null,
                healthStatus: null,
                smoking: null,
                pastYearWeight: null,
                currentSmokingPerDay: null,
                currentSmokingPerWeek: null,
                smokingPerDay: null,
                smokingYears: null,
                quitSmokingYears: null,
                alcohol: null,
                currentDrinkPerDay: null,
                currentDrinkPerDayBottle: null,
                drinkPerDay: null,
                drinkPerDayBottle: null,
                drinkYears: null,
                quitDrinkYears: null,
                underlyingDis: null,
                underlyingDisOther: null,
                healthCoverage: null,
                hospitalized: null,
                fell: null,
                medication: null,
                medicationTypes: null,
                job: {
                    jobBeforeRetirement: null,
                    jobBeforeRetirementOther: null,
                    jobAfterRetirement: null,
                    jobAfterRetirementOther: null,
                    currentJob: {
                        duration: null,
                        quit: null,
                        quitReason: null,
                    }
                }
            },
            charlson: {
                score: 0,
                diseases: [],
            },
            minicog: {
                items: [],
                score: null
            },
            clock: {
                score: 0,
                file: null,
            },
            mna: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
                six: null,
            },
            adl: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
                six: null,
                seven: null,
                eight: null,
                nine: null,
                ten: null,
            },
            iadl: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
                six: null,
            },
            eq5d5l: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
            },
            gpaq: {
                p1: null,
                p2: null,
                p3: {
                    minutes: null,
                    hours: null
                },
                p4: null,
                p5: null,
                p6: {
                    minutes: null,
                    hours: null
                },
                p7: null,
                p8: null,
                p9: {
                    minutes: null,
                    hours: null
                },
                p10: null,
                p11: null,
                p12: {
                    minutes: null,
                    hours: null
                },
                p13: null,
                p14: null,
                p15: {
                    minutes: null,
                    hours: null
                },
                sedentary: null,
            },
            form9q: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
                six: null,
                seven: null,
                eight: null,
                nine: null,
            },
            kihon: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
                six: null,
                seven: null,
                eight: null,
                nine: null,
                ten: null,
                eleven: null,
                twelve: null,
                thirteen: null,
                forteen: null,
                fifteen: null,
                sixteen: null,
                seventeen: null,
                eighteen: null,
                nineteen: null,
                twenty: null,
                twentyone: null,
                twentytwo: null,
                twentythree: null,
                twentyfour: null,
                twentyfive: null,
            },
            exhaustion: {
                one: null,
                two: null
            },
            sarcf: {
                one: null,
                two: null,
                three: null,
                four: null,
                five: null,
            },
            evaluation: {
                gait1: null,
                gait2: null,
                hand: null,
                gripLeft1: null,
                gripLeft2: null,
                gripLeft3: null,
                gripRight1: null,
                gripRight2: null,
                gripRight3: null,
                quadLeft1: null,
                quadLeft2: null,
                quadLeft3: null,
                quadRight1: null,
                quadRight2: null,
                quadRight3: null,
                leg: null,
                weight: null,
                height: null,
                muscleMass: null,
                fatFreeMass: null
            }
        }
    }
}

export default new Vuex.Store({
    state: {
        form: initializeForm(),
        province: null,
    },
    mutations: {
        resetForm(state) {
            state.form = initializeForm()
            state.form.record.province = state.province.name
        },
        setProvince(state, province) {
            state.province = province
        },
        setFormProvince(state) {
            state.form.province = state.province
        },
        updateCharlsonDisease (state, params) {
            let idx = state.form.record.charlson.diseases.indexOf(params.disease)
            if (idx == -1) {
                state.form.record.charlson.score += parseInt(params.score)
                state.form.record.charlson.diseases.push(params.disease)
            } else {
                state.form.record.charlson.score -= parseInt(params.score)
                state.form.record.charlson.diseases.splice(idx, 1)
            }
        },
        updateMiniCogItems(state, item) {
            let idx = state.form.record.minicog.items.indexOf(item)
            if (idx == -1) {
                state.form.record.minicog.items.push(item)
            } else {
                state.form.record.minicog.items.splice(idx, 1)
            }
            if (state.form.record.minicog.items.length == 3) {
                state.form.record.minicog.score = 1
            } else {
                state.form.record.minicog.score = 0
            }
            console.log(state.form.record.minicog.items, state.form.record.minicog.score)
        },
        setLastUpdate(state) {
            state.form.record.lastUpdate.push({
                datetime: new Date(),
                creator: auth.currentUser.email
            })
        },
        setUpRecord(state, record) {
            state.form.record = record
            state.form.record.recordDate = new Date(record.recordDate.toDate())
            if (record.lastUpdate.datetime) {
                state.form.record.lastUpdate.datetime = new Date(record.lastUpdate.datetime.toDate())
            }
        },
        setCreator(state) {
            state.form.record.creator = auth.currentUser.email
        },
        setClockFileName(state, fileName) {
            state.form.record.clock.file = fileName
        }
    },
    actions: {
        saveForm({commit, state}) {
            commit('setLastUpdate')
            commit('setFormProvince')
            records.where('code', '==', state.form.record.code)
                .where('province', '==', state.form.record.province)
                .get().then((snapshot) => {
                if (snapshot.empty) {
                    if (state.form.record.code != null) {
                        commit('setCreator')
                        records.add(state.form.record)
                    }
                } else {
                    let formData = snapshot.docs[0]
                    if (state.form.record.lastUpdate.length > 1) {
                        records.doc(formData.id).set(state.form.record)
                    } else {
                        ToastProgrammatic.open({
                            type: 'is-warning',
                            message: 'ไม่สามารถบันทึกได้เนื่องจากรหัสซ้ำในจังหวัดนี้'
                        })
                    }
                }
            })
        },
        setRecord({commit}, record) {
            commit('setUpRecord', record)
        }
    }
})