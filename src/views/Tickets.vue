<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div style="display:block" class="col-12 mb-2 p-2">
        <div class="row">
          <h5 class="col-10">Tabla de tickets</h5>
          <div class="col-2">
            <vsud-button variant="outlined" v-on:click="sendSms()" color="success">Prueba SMS</vsud-button>
            <vsud-button variant="outlined" v-on:click="createTicket()" color="success">Prueba Ticket</vsud-button>
          </div>
          
        </div>
      </div>
      <div class="col-12 pt-3 card">
        <a-table :data-source="tickets" :columns="columns">
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
          <template #bodyCell="{ text, column }">
            <template v-if="column.key === 'date'">
              {{formatDate(text)}}
            </template>
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
import io from 'socket.io-client';
import endPoint from '../../config-endpoint/endpoint.js'
import router from '../router'

export default {
  name: "tables",
  components: {
    VsudButton
  },
  data(){
    return {
      tickets:[],
      searchInput: null,
      socket : io(endPoint.endpointTarget),
      columns: [
        {
          title: 'Cliente',
          dataIndex: 'client',
          key: 'client',
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
          title: 'Sitio',
          dataIndex: 'site',
          key: 'site',
        },
        {
          title: 'Nombre de equipo',
          dataIndex: 'product',
          key: 'product',
          customFilterDropdown: true,
          onFilter: (value, record) =>
            record.address.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.value.focus();
              }, 100);
            }
          },
        },
        {
          title: 'IP Dispositivo',
          dataIndex: 'ip',
          key: 'ip',
        },
        {
          title: 'Alias de equipo',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Fecha de caída',
          dataIndex: 'createdAt',
          key: 'date',
        },
      ]
    }
  },
  created(){
      // this.createTicket()
      this.verifyLogin()
      this.getTickets()
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
    async getTickets(){
      try {
          const getTickets = await axios.get(endPoint.endpointTarget+'/tickets/')
          this.tickets = getTickets.data
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
    async createTicket(){
      
      try {
          const createTicket = await axios.post(endPoint.endpointTarget+'/tickets/',{
            ip: "192.168.1.1"
          })
          if (createTicket) {
            this.getTickets()
            //this.socket.emit('newTicket', createTicket)
          }
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
    async sendSms(){
      try {
        const sendSms = await axios.post(endPoint.endpointTarget+'/tickets/sendsms')
        if (sendSms) {
          console.log(sendSms)
        }
      }catch(err){
        console.log(err)
      }
    },
    formatDate(date){
      var dat = date
      dat = dat.replace("T", " ( ")
      dat = dat.replace("Z", " )")
      var spli = dat.split("(")[1]
      var split = dat.split(" ")[0].split("-")
      dat = split[2]+"-"+split[1]+"-"+split[0] + " ("+spli
      return dat
    }
  },
  mounted (){
      this.socket.on('ticket', (data) => {
        console.log(data)
          this.getTickets()
      });
    }
};
</script>
