<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur blur-rounded my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content main-content-bg">
    <section>
      <div class="page-header min-vh-75">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
              <div class="mt-8 card card-plain">
                <div class="pb-0 card-header text-start">
                  <h3 class="font-weight-bolder text-success text-gradient">
                    Bienvenido
                  </h3>
                  <p class="mb-0">Ingresa tus credenciales</p>
                </div>
                <div class="card-body">
                    <label>Usuario</label>
                    
                    <a-input v-model:value="user" placeholder="Usuario" />
                    <label>Contraseña</label>
                    
                    <a-input type="password" v-model:value="password" v-on:keyup.enter="login()" placeholder="Contraseña" />
                    <div class="text-center">
                      <vsud-button
                        class="my-4 mb-2"
                        variant="gradient"
                        color="success"
                        full-width
                        v-on:click="login()"
                        >Ingresar
                      </vsud-button>
                    </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div
                class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
              >
                <div
                  class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                  :style="{
                    backgroundImage:
                      'url(' +
                      require('@/assets/img/curved-images/curved9.jpg') +
                      ')',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import VsudButton from "@/components/VsudButton.vue";
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";

export default {
  name: "SignIn",
  components: {
    Navbar,
    AppFooter,
    VsudButton,
  },
  data(){
    return {
      user: '',
      password: ''
    }
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    this.logout()
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    async login(){
      if (this.user != '' && this.password != '') {
        try {
          const login = await axios.post(endPoint.endpointTarget+'/users/login',{
            user: this.user,
            password: this.password
          })
          if (login) {
            if (login.data.status == "ok") {
              localStorage.setItem('user', login.data.data[0].user)
              localStorage.setItem('status', login.data.data[0].status)
              localStorage.setItem('loging', true)
              router.push({path: '/Dashboard'})
            }
            if (login.data.status == "bad") {
              this.$swal({
                  customClass: {container:"fixModal"},
                  icon: 'error',
                  title: 'Los datos ingresados son incorrectos.',
                  showConfirmButton: true
              })
            }
          }
        } catch (error) {
          console.log(error)
        }
      }else{
        this.$swal({
            customClass: {container:"fixModal"},
            icon: 'error',
            title: 'Debe ingresar correctamente los datos',
            html: '- Los campos no pueden estar vacíos.',
            showConfirmButton: true
        })
      }
    },
    logout(){
      localStorage.user = ''
      localStorage.status = ''
      localStorage.loging = false
      console.log(localStorage)
    }
  },
};
</script>
