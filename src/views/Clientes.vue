<template>
  <div class="py-4 container-fluid">
    <a-modal v-model:visible="modals.modal1" title="Registrar cliente">
      <template #footer>
        <a-button key="back" v-on:click="modals.modal1 = false">Cerrar</a-button>
        <a-button key="submit" v-on:click="createClient()" type="primary">Registrar</a-button>
      </template>
      <h6>Código de empresa:</h6>
      <a-input v-model:value="clientData.businessCode" placeholder="Código de empresa" />
      <h6>Nombre de empresa:</h6>
      <a-input  v-model:value="clientData.businessName" placeholder="Nombre de empresa" />
     
    </a-modal>

    <a-modal v-model:visible="modals.modal3" title="Registrar equipo">
      <template #footer>
        <a-button key="back" v-on:click="modals.modal3 = false">Cerrar</a-button>
        <a-button key="submit" v-on:click="createPc()" type="primary">Registrar</a-button>
      </template>
      <h6>Sitio:</h6>
      <a-input v-model:value="pcData.site" placeholder="Sitio" />
      <h6 class="mt-2">Descripción:</h6>
      <a-input  v-model:value="pcData.description" placeholder="Descripción" />
      <h6 class="mt-2">MAC:</h6>
      <a-input  v-model:value="pcData.mac" placeholder="MAC" />
      <h6 class="mt-2">Monitoreado: <a-switch v-model:checked="pcData.monitoring" /></h6>
      <div class="row">
        <div class="col-md-6">
          <h6>IP:</h6>
          <a-input v-model:value="pcData.ip" placeholder="IP" />
        </div>
        <div class="col-md-6">
          <h6>IP Administrador:</h6>
          <a-input v-model:value="pcData.ipAdmin" placeholder="IP Administrador" />
        </div>
      </div>
    </a-modal>

    <a-modal v-model:visible="modals.modal4" title="Editar equipo">
      <template #footer>
        <a-button key="back" v-on:click="modals.modal4 = false">Cerrar</a-button>
        <a-button key="submit" v-on:click="editPc()" type="primary">Editar</a-button>
      </template>
      <h6>Sitio:</h6>
      <a-input v-model:value="pcData.site" placeholder="Sitio" />
      <h6 class="mt-2">Descripción:</h6>
      <a-input  v-model:value="pcData.description" placeholder="Descripción" />
      <h6 class="mt-2">MAC:</h6>
      <a-input  v-model:value="pcData.mac" placeholder="MAC" />
      <h6 class="mt-2">Monitoreado: <a-switch v-model:checked="pcData.monitoring" /></h6>
      <div class="row">
        <div class="col-md-6">
          <h6>IP:</h6>
          <a-input v-model:value="pcData.ip" placeholder="IP" />
        </div>
        <div class="col-md-6">
          <h6>IP Administrador:</h6>
          <a-input v-model:value="pcData.ipAdmin" placeholder="IP Administrador" />
        </div>
      </div>
    </a-modal>

    <a-modal v-model:visible="modals.modal2" width="1200px" title="Editar cliente">
      <template #footer>
        <a-button key="back" v-on:click="modals.modal2 = false">Cerrar</a-button>
        <a-button key="submit" v-on:click="editClient()" type="primary">Editar</a-button>
      </template>
      <div class="row mb-4">
        <div class="col-md-6"><h6>Código de empresa:</h6>
      <a-input v-model:value="clientData.businessCode" placeholder="Código de empresa" /></div>
        <div class="col-md-6"><h6>Nombre de empresa:</h6>
      <a-input  v-model:value="clientData.businessName" placeholder="Nombre de empresa" /></div>
      </div>
      <div style="display:block" class="col-12 mb-2 p-2">
        <div class="row">
          <h5 class="col-9">Tabla de equipos</h5>
          <div class="col-3">
            <vsud-button variant="outlined" size="sm" v-on:click="modals.modal3 = true, pcData = {site:'', description: '', monitoring: '', ip: '', ipAdmin: ''}" color="success">Registrar equipo</vsud-button>
          </div>
          
        </div>
      </div>
      <a-table :columns="editColumns" :key="index" :data-source="clientData.items" :pagination="false">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'monitor'">
            <a-tooltip placement="top">
              <template #title>
                <span>Monitoreado</span>
              </template>
              <desktop-outlined />
            </a-tooltip>
              
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <vsud-button size="sm" style="margin-right: 10px" variant="outlined" v-on:click="pushDataPc(record.site, record.description, record.monitoring, record.ip, record.ipAdmin, record.key, record.mac), modals.modal4 = true" color="info">Editar</vsud-button>
            <vsud-button size="sm" class="ml-2" variant="outlined" v-on:click="deletePc(record.key)" color="danger">Eliminar</vsud-button>
          </template>
          <template v-else-if="column.key === 'monitor'">
            
            <span v-if="record.monitoring" style="color:green"> Si</span>
            <span v-else style="color:red"> No</span>
          </template>
        </template>
      </a-table>
      
     
    </a-modal>
    <div class="row">
      <div style="display:block" class="col-12 mb-2 p-2">
        <div class="row">
          <h5 class="col-10">Tabla de clientes</h5>
          <div class="col-2">
            <vsud-button variant="outlined" v-on:click="modals.modal1 = true, clientData.businessCode = '', clientData.businessName = ''" color="success">Registrar cliente</vsud-button>
          </div>
          
        </div>
      </div>
      <div class="col-12 pt-3 card">
        <a-table :columns="columns" :data-source="clients" class="components-table-demo-nested tableClients">
          <template #bodyCell="{ column, index  }">
            <template v-if="column.key === 'actions'">
              <vsud-button size="sm" style="margin-right: 10px" variant="outlined" v-on:click="pushData(clients[index].businessCode, clients[index].name, clients[index].items, clients[index]._id), modals.modal2 = true" color="info">Info</vsud-button>

              <vsud-button size="sm" class="ml-2" variant="outlined" v-on:click="deleteClient(clients[index]._id)" color="danger">Eliminar</vsud-button>
            </template>
          </template>
          <template #expandedRowRender="{ record, index }">
            <a-table :columns="innerColumns" :key="index" :data-source="record.items" :pagination="false">
              <template #bodyCell="{ column, index }">
                <!-- <template v-if="column.key === 'site'">
                  <span>
                    <a-badge status="success" />
                    hola
                  </span>
                </template> -->
                <template v-if="column.key === 'monitor'">
                  <span v-if="record.items[index].monitoring" style="color:green"> Si</span>
                  <span v-else style="color:red">No </span>
                </template>
              </template>
            </a-table>
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
import { DesktopOutlined } from '@ant-design/icons-vue';
import router from '../router'

export default {
  name: "tables",
  components: {
    VsudButton,
    DesktopOutlined
  },
  data(){
    return {
      clientData: {
        _id: '',
        businessCode: '',
        businessName: '',
        items: []
      },
      pcData: {
        site: '',
        description: '',
        monitoring: false,
        ip: '',
        ipAdmin: '',
        key: '',
        mac: ''
      },
      modals: {
        modal1: false,
        modal2: false,
        modal3: false,
        modal4: false
      },
      columns : [
        { title: 'Código de empresa', dataIndex: 'businessCode', key: 'code' },
        { title: 'Nombre de empresa', dataIndex: 'name', key: 'name' },
        { title: 'Acciones', dataIndex: '_id', key: 'actions' }
      ],
      innerColumns : [
        { title: 'Sitio', dataIndex: 'site', key: 'site' },
        { title: 'MAC', dataIndex: 'mac', key: 'desc' },
        { title: 'Monitoreado', dataIndex: 'monitoring', key: 'monitor' },
        { title: 'IP', dataIndex: 'ip', key: 'ip' },
        { title: 'IP Administrador', dataIndex: 'ipAdmin', key: 'ipAdmin' },
      ],
      editColumns : [
        { title: 'Sitio', dataIndex: 'site', key: 'site' },
        { title: 'Detalles', dataIndex: 'description',width:370, key: 'desc' },
        { title: 'IP', dataIndex: 'ip', key: 'ip' },
        { title: 'monitor', dataIndex: 'monitoring', key: 'monitor' },
        { title: 'Acciones', dataIndex: 'id', key: 'action' },
      ],
      clients:[]
    }
  },
  created(){
      this.getClients()
      this.verifyLogin()
  },
  methods: {
    async getClients(){
      try {
          const getClients = await axios.get(endPoint.endpointTarget+'/clients/')
          this.clients = getClients.data
          console.log(this.clients)
      }catch(err){
          if (!err.response) {
              this.$swal({
                  customClass: {container:"fixModal"},
                  icon: 'error',
                  title: 'Error de conexión',
                  showConfirmButton: false,
                  timer: 1500
              })
          }else if (err.response.status == 401) {
              this.$swal({
                  customClass: {container:"fixModal"},
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
    async createClient(){
      if (this.clientData.businessName != '' && this.clientData.businessCode != '') {
        try{
          const createClient = await axios.post(endPoint.endpointTarget+'/clients/createclient',{
            businessCode: this.clientData.businessCode,
            name: this.clientData.businessName
          })
          if (createClient.data.status == 'ok') {
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'success',
                title: 'Cliente creado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.clientData.businessCode = ''
            this.clientData.businessName = ''
            this.getClients()
            this.modals.modal1 = false
          }
        }catch(err){
          console.log(err)
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

    pushData(code, bName, items, id){
      this.clientData.businessCode = code 
      this.clientData.businessName = bName 
      this.clientData.items = items
      this.clientData._id = id
    },

    pushDataPc(site, description, monitoring, ip, ipAdmin, key, mac){
      this.pcData.site = site 
      this.pcData.description = description 
      this.pcData.monitoring = monitoring
      this.pcData.ip = ip
      this.pcData.ipAdmin = ipAdmin
      this.pcData.key = key
      this.pcData.mac = mac
    },

    async editClient(){
      if (this.clientData.businessCode != "" && this.clientData.businessName != "" ) {
        try{
          const editClient = await axios.put(endPoint.endpointTarget+'/clients/editclient',{
            id: this.clientData._id,
            name: this.clientData.businessName,
            code: this.clientData.businessCode
          })
          if (editClient.data.status == 'ok') {
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'success',
                title: 'Cliente editado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.clientData.businessCode = ''
            this.clientData.businessName = ''
            this.getClients()
            this.modals.modal2 = false
          }else if(editClient.data.status == 'client already registered'){
            this.modals.modal2 = false
            setTimeout(() => {
              this.modals.modal2 = true
            }, 2500);
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'error',
                title: 'El Cliente ingresado ya se encuentra registrado',
                showConfirmButton: false,
                timer:2500
            })
          }else if(editClient.data.status == 'Bad'){
            this.$swal({
                customClass: {container:"fixModal"},
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
            customClass: {container:"fixModal"},
            icon: 'error',
            title: 'Debe ingresar todos los datos',
            html: '- El código y nombre de cliente no deben estar vacíos',
            showConfirmButton: true
        })
      }
    },

    async editPc(){
      if (this.pcData.site != "" && this.pcData.description != "" && this.pcData.ip != "" && this.pcData.mac != "" ) {
        try{
          const editPc = await axios.put(endPoint.endpointTarget+'/clients/editpc',{
            key: this.pcData.key,
            site: this.pcData.site,
            description: this.pcData.description,
            monitoring: this.pcData.monitoring,
            ip: this.pcData.ip,
            ipAdmin: this.pcData.ipAdmin,
            mac: this.pcData.mac
          })
          if (editPc.data.status == 'ok') {
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'success',
                title: 'Equipo editado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.getClients()
            this.clientData.items = editPc.data.data[0].items
            this.modals.modal4 = false
          }else if(editPc.data.status == 'pc already registered'){
            // this.modals.modal2 = false
            // setTimeout(() => {
            //   this.modals.modal2 = true
            // }, 2500);
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'error',
                title: 'La ip o mac ingresada ya se encuentra registrada',
                showConfirmButton: false,
                timer:2500
            })
          }else if(editPc.data.status == 'Bad'){
            this.$swal({
                customClass: {container:"fixModal"},
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
            customClass: {container:"fixModal"},
            icon: 'error',
            title: 'Debe ingresar todos los datos',
            html: '- El sitio, descripción, ip y mac del equipo no deben estar vacíos',
            showConfirmButton: true
        })
      }
    },

    async createPc(){
      if (this.pcData.site != '' && this.pcData.description != '' && this.pcData.ip != '' && this.pcData.mac != '') {
        try{
          const createPc = await axios.post(endPoint.endpointTarget+'/clients/createpc',{
            id: this.clientData._id,
            pcData: this.pcData
          })
          if (createPc.data.status == 'ok') {
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'success',
                toast: true,
                position: 'top-end',
                title: 'Equipo creado con éxito',
                showConfirmButton: false,
                timer: 2000
            })
            this.clientData.items = createPc.data.data.items
            this.getClients()
            this.modals.modal3 = false
          }else if(createPc.data.status == 'pc already registered'){
            // this.modals.modal2 = false
            // setTimeout(() => {
            //   this.modals.modal2 = true
            // }, 2500);
            this.$swal({
                customClass: {container:"fixModal"},
                icon: 'error',
                title: 'La ip o mac ingresada ya se encuentra registrada',
                showConfirmButton: false,
                timer:2500
            })
          }
        }catch(err){
          console.log(err)
        }
      }else{
        this.$swal({
            customClass: {container:"fixModal"},
            icon: 'error',
            title: 'Debe ingresar correctamente los datos',
            html: '- Los campos Sitio, Descripción, IP y mac no pueden estar vacíos.',
            showConfirmButton: true
        })
      }
    },

    deleteClient(id){
      this.$swal({
          customClass: {container:"fixModal"},
				title: '¿Desea eliminar este cliente?',
				text: 'No puede revertir esta acción, serán eliminados todos los equipos vinculados a este',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
          if (result.value) {
              try {
                const deleteClient =  axios.delete(endPoint.endpointTarget+'/clients/'+id)
                if (deleteClient) {
                    this.$swal({
                        customClass: {container:"fixModal"},
                        icon: 'success',
                        title: 'Cliente eliminado con éxito',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.getClients()
                  }else{
                    this.$swal({
                        customClass: {container:"fixModal"},
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
                  customClass: {container:"fixModal"},
                  icon: 'info',
                  title: 'Acción cancelada',
                  showConfirmButton: false,
                  timer: 1500
              })
          }
      })
    },
    deletePc(key){
      this.$swal({
          customClass: {container:"fixModal"},
				title: '¿Desea eliminar este equipo?',
				text: 'No puede revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
          if (result.value) {
                axios.put(endPoint.endpointTarget+'/clients/deletepc',{
                  key:key
                })
                .then(deletePc => {
                    if (deletePc) {
                    this.$swal({
                        customClass: {container:"fixModal"},
                        icon: 'success',
                        title: 'Equipo eliminado con éxito',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.getClients()
                    this.clientData.items = deletePc.data.data.items
                  }else{
                    this.$swal({
                        customClass: {container:"fixModal"},
                        icon: 'error',
                        title: 'Error técnico',
                        showConfirmButton: true
                    })
                  }
                })
                
          }else{
              this.$swal({
                  customClass: {container:"fixModal"},
                  icon: 'info',
                  title: 'Acción cancelada',
                  showConfirmButton: false,
                  timer: 1500
              })
          }
      })
    },
  }
};
</script>

<style>
  /* .fixModal {

    z-index: 10000000;
  } */
</style>
