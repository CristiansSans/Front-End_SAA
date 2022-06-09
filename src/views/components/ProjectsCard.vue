<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="row">
        <div class="col-lg-6 col-7">
          <h6>Tickets de hoy</h6>
        </div>
        <div class="col-lg-6 col-5 my-auto text-end">
          <!-- <div class="dropdown float-lg-end pe-4">
            <a
              class="cursor-pointer"
              id="dropdownTable"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa fa-ellipsis-v text-secondary" aria-hidden="true"></i>
            </a>
            <ul
              class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5"
              aria-labelledby="dropdownTable"
            >
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Action</a
                >
              </li>
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Another action</a
                >
              </li>
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Something else here</a
                >
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-center text-uppercase text-default text-xxs font-weight-bolder"
              >
                Cliente
              </th>
              <th
                class="text-center text-uppercase text-default text-xxs font-weight-bolder ps-2"
              >
                Sitio
              </th>
              <th
                class="text-center text-uppercase text-default text-xxs font-weight-bolder"
              >
                IP
              </th>
              <th
                class="text-center text-uppercase text-default text-xxs font-weight-bolder"
              >
                Fecha de caída
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in tickets" :key="ticket.ip">
              <td class="align-middle text-center text-sm">
                  <h6 class="mb-0 text-sm">{{ticket.client}}</h6>
              </td>
              <td class="align-middle text-center text-sm">
                {{ticket.site}}
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold">{{ticket.ip}}</span>
              </td>
              <td class="align-middle">
                <div class="d-flex align-items-center justify-content-center">
                  <span class="text-xs font-weight-bold">{{formatDate(ticket.createdAt)}}</span>
                </div>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import setTooltip from "@/assets/js/tooltip.js";
import axios from 'axios'
import endPoint from '../../../config-endpoint/endpoint.js'
// import VsudButton from "@/components/VsudButton.vue";
// import VsudBadge from "@/components/VsudBadge.vue";
import img1 from "../../assets/img/small-logos/logo-xd.svg";
import img2 from "../../assets/img/team-1.jpg";
import img3 from "@/assets/img/team-2.jpg";
import img4 from "../../assets/img/team-3.jpg";
import img5 from "../../assets/img/team-4.jpg";
import img6 from "../../assets/img/small-logos/logo-atlassian.svg";
import img7 from "../../assets/img/team-2.jpg";
import img8 from "../../assets/img/team-4.jpg";
import img9 from "../../assets/img/small-logos/logo-slack.svg";
import img10 from "../../assets/img/team-3.jpg";
import img11 from "../../assets/img/team-1.jpg";
import img12 from "../../assets/img/small-logos/logo-spotify.svg";
import img13 from "../../assets/img/team-4.jpg";
import img14 from "../../assets/img/team-3.jpg";
import img15 from "../../assets/img/team-4.jpg";
import img16 from "../../assets/img/team-1.jpg";
import img17 from "../../assets/img/small-logos/logo-jira.svg";
import img18 from "../../assets/img/team-4.jpg";
import img19 from "../../assets/img/small-logos/logo-invision.svg";
import img20 from "../../assets/img/team-1.jpg";
import img21 from "../../assets/img/team-4.jpg";

export default {
  name: "projects-card",
  data() {
    return {
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      img10,
      img11,
      img12,
      img13,
      img14,
      img15,
      img16,
      img17,
      img18,
      img19,
      img20,
      img21,
      tickets:[]
    };
  },
  components: {
  },
  created(){
    this.getTickets()
  },
  mounted() {
    setTooltip();
  },
  methods:{
    async getTickets(){
      try {
          const getTickets = await axios.get(endPoint.endpointTarget+'/tickets/todaytickets')
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
    formatDate(date){
      var dat = date
      dat = dat.replace("T", " ( ")
      dat = dat.replace("Z", " )")
      var spli = dat.split("(")[1]
      var split = dat.split(" ")[0].split("-")
      dat = split[2]+"-"+split[1]+"-"+split[0] + " ("+spli
      return dat
    }
  }
};
</script>
