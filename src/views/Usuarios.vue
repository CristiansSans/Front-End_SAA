<template>
  <div class="py-4 container-fluid">
    <a-modal v-model:visible="modals.modal1" title="Registrar usuario">
      <template #footer>
        <a-button key="back" >Cerrar</a-button>
        <a-button key="submit" v-on:click="createUser()" type="primary">Registrar</a-button>
      </template>
      <h6>Usuario:</h6>
      <a-input v-model:value="userData.user" placeholder="Nombre de usuario" />
      <h6>Contraseña:</h6>
      <a-input-password  v-model:value="userData.password" placeholder="Contraseña" />
      <h6>Cargo:</h6>
      <a-select
        v-model:value="userData.status"
        placeholder="Selecciones cargo"
        style="width: 220px"
      >
        <a-select-option value="Administrador">Administrador</a-select-option>
        <a-select-option value="Supervisor">Supervisor</a-select-option>
      </a-select>
     
    </a-modal>
    <a-modal v-model:visible="modals.modal2" title="Editar usuario">
      <template #footer>
        <a-button key="back" >Cerrar</a-button>
        <a-button key="submit" v-on:click="editUser()" type="primary">Editar</a-button>
      </template>
      <h6>Usuario:</h6>
      <a-input v-model:value="userData.user" placeholder="Nombre de usuario" />
      <h6>Contraseña:</h6>
      <a-input-password  v-model:value="userData.password" placeholder="Contraseña" />
      <h6>Cargo:</h6>
      <a-select
        v-model:value="userData.status"
        placeholder="Selecciones cargo"
        style="width: 220px"
      >
        <a-select-option value="Administrador">Administrador</a-select-option>
        <a-select-option value="Supervisor">Supervisor</a-select-option>
      </a-select>
     
    </a-modal>
    <div class="row">
      <div style="display:block" class="col-12 mb-2 p-2">
        <div class="row">
          <h5 class="col-10">Tabla de usuarios</h5>
          <div class="col-2">
            <vsud-button variant="outlined" v-on:click="initialState(), modals.modal1 = true" color="success">Registrar usuario</vsud-button>
          </div>
          
        </div>
      </div>
      <div class="col-12 pt-3 card">
        <a-table :data-source="data" :columns="columns">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span style="color: #1890ff">Name</span>
            </template>
          </template>
          <template
            #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          >
            <div style="padding: 8px">
              <a-input
                ref="searchInput"
                :placeholder="`Search ${column.dataIndex}`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-button
                type="primary"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
              >
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
              <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                Reset
              </a-button>
            </div>
          </template>
          <template #customFilterIcon="{ filtered }">
            <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
          </template>
          <template #bodyCell="{ text, column, record }">
            <span v-if="searchText && searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                >
                  {{ fragment }}
                </mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-if="column.key === 'action'">
              <vsud-button style="margin-right: 10px" variant="outlined" v-on:click="pushData(record.user, record.password, record.status, record._id)" color="info">Editar</vsud-button>
              <vsud-button class="ml-2" variant="outlined" v-on:click="deleteUser(record._id)" color="danger">Eliminar</vsud-button>
          </template>
          </template>
          
        </a-table>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
      </div>
    </div>
  </div>
</template>

<script>
import VsudButton from "@/components/VsudButton.vue";
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import router from '../router'

export default {
  name: "tables",
  components: {
    VsudButton
  },
  data(){
    return {
      modals:{
        modal1: false,
        modal2 : false
      },
      userData: {
        user: "",
        password: '',
        status: 'Seleccione cargo'
      },
      data: [],
      searchInput: null,
      columns: [
        {
          title: 'Usuario',
          dataIndex: 'user',
          key: 'user',
          customFilterDropdown: true,
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.value.focus();
              }, 100);
            }
          },
        },
        {
          title: 'Cargo',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Ultimo acceso',
          dataIndex: 'lastAccess',
          key: 'lastAccess',
        },
        {
          title: 'Acciones',
          dataIndex: '_id',
          key: 'action'
        },
      ]
    }
  },
  created(){
      this.getUsers()
      this.verifyLogin()
  },
  methods: {
    verifyLogin(){
      var valid = localStorage.loging
      if (valid == "false") {
        console.log("mamadera de gallo?")
        this.$swal({
            customClass: {container:"fixModal"},
            icon: 'error',
            title: 'Sesión caducada',
            showConfirmButton: false,
            timer: 1500
        })
        router.push({path: '/sign-in'})
      }
    },
    async getUsers(){
      try {
          const getUsers = await axios.get(endPoint.endpointTarget+'/users/')
          this.data = getUsers.data
      }catch(err){
          if (!err.response) {
              this.$swal({
                  icon: 'error',
                  title: 'Error de conexión',
                  showConfirmButton: false,
                  timer: 1500
              })
          }else if (err.response.status == 401) {
              this.$swal({
                  icon: 'error',
                  title: 'Session caducada',
                  showConfirmButton: false,
                  timer: 1500
              })
              // setTimeout(() => {
              //     router.push("login")
              // }, 1550);
          }
      }
    },

    async createUser(){
      if (this.userData.user.length >= 4 && this.userData.password.length >= 6 && this.userData.status != "Seleccione cargo") {
        try{
          const createUser = await axios.post(endPoint.endpointTarget+'/users/createuser',{
            user: this.userData.user,
            password: this.userData.password,
            status: this.userData.status
          })
          if (createUser.data.status == 'ok') {
            this.$swal({
                icon: 'success',
                title: 'Usuario creado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.userData.user = ''
            this.userData.password = ''
            this.userData.status = 'Seleccione cargo'
            this.getUsers()
            this.modals.modal1 = false
          }
        }catch(err){
          console.log(err)
        }
      }else{
        this.$swal({
            icon: 'error',
            title: 'Debe ingresar correctamente los datos',
            html: '- Usuario debe tener mas de 3 dígitos <br> - La contraseña debe tener mas de 5 dígitos <br> - Debe elegir un cargo',
            showConfirmButton: true
        })
      }
    },

    async editUser(){
      if (this.userData.user.length >= 4 && this.userData.password.length >= 6 && this.userData.status != "Seleccione cargo") {
        try{
          const editUser = await axios.put(endPoint.endpointTarget+'/users/edituser',{
            id: this.userData._id,
            user: this.userData.user,
            password: this.userData.password,
            status: this.userData.status
          })
          if (editUser.data.status == 'ok') {
            this.$swal({
                icon: 'success',
                title: 'Usuario editado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.userData.user = ''
            this.userData.password = ''
            this.userData.status = 'Seleccione cargo'
            this.getUsers()
            this.modals.modal2 = false
          }else if(editUser.data.status == 'User already registered'){
            this.$swal({
                icon: 'error',
                title: 'El usuario ingresado ya se encuentra registrado',
                showConfirmButton: true
            })
          }else if(editUser.data.status == 'Bad'){
            this.$swal({
                icon: 'error',
                title: 'Error técnico',
                showConfirmButton: true
            })
          }
        }catch(err){
          console.log(err)
        }
      }else{
        this.$swal({
            icon: 'error',
            title: 'Debe ingresar correctamente los datos',
            html: '- Usuario debe tener mas de 3 dígitos <br> - La contraseña debe tener mas de 5 dígitos <br> - Debe elegir un cargo',
            showConfirmButton: true
        })
      }
    },
    
    pushData(user, pass, status, id){
      this.userData = {
        _id: id,
        user: user,
        password: pass,
        status: status
      }
      this.modals.modal2 = true
    },

    deleteUser(id){
      this.$swal({
				title: '¿Desea eliminar este usuario?',
				text: 'No puede revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
          if (result.value) {
              try {
                const deleteUser = axios.delete(endPoint.endpointTarget+'/users/'+id)
                if (deleteUser) {
                    this.$swal({
                        icon: 'success',
                        title: 'Usuario eliminado con éxito',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.getUsers()
                  }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Error técnico',
                        showConfirmButton: true
                    })
                  }
              } catch (err) {
                console.log(err)
              }
          }else{
              this.$swal({
                  icon: 'info',
                  title: 'Acción cancelada',
                  showConfirmButton: false,
                  timer: 1500
              })
          }
      })
    },

    initialState(){
      this.userData = {
        user: '',
        password: '',
        status: 'Seleccione cargo'
      }
    }
  }
};
</script>
<style>
  /* .ant-modal-mask{
    z-index: 10000 !important;
  }
  .ant-modal-wrap{
    z-index: 100000 !important;
  } */
</style>
