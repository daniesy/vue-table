f<template>
  <div id="app">
    <vue-table
      :data="items"
      @clicked="clickedItem"
      @update-item="updateItem"
      @sort="sortTable"
      :row-spacing="10"
      id="demo"
      wrap
      vertical-align
      vertical-actions
      left-actions
    >
      <column id="first_name" label="First Name" editable sortable resizable />
      <column id="last_name" label="Last Name" editable sortable resizable />
      <!-- <column id="email" label="Email"/>
      <column id="country" label="Country"/>
      <column id="address" label="Address"/>-->
      <column id="iban" label="IBAN" />
      <column id="nested.status" label="Status" editable />
      <template #first_name="{ item }">
        {{ item.first_name }}<br /><small>{{ item.country }}</small>
      </template>
      <template #actions="{ index }">
        <action type="primary" tooltip="Click here to edit" edit>Edit</action>
        <action type="danger" @clicked="deleteItem(index)">Delete</action>
      </template>
      <!-- <template #dropdown-actions="{ index }">
        <action type="primary" edit>Edit</action>
        <action type="danger" @clicked="deleteItem(index)">Delete</action>
      </template> -->
    </vue-table>
  </div>
</template>

<script>
import VueTable from "./components/Table";
import Column from "./components/Column";
import Action from "./components/Action";

import { set } from "./tools";

export default {
  name: "App",
  components: {
    VueTable,
    Action,
    Column
  },
  methods: {
    deleteItem(index) {
      this.items.splice(index, 1);
    },
    updateItem({ isDirty, index, values }, success, error) {
      if (!isDirty) {
        error({ last_name: "Nothing changed!" });
      } else {
        values.forEach(item => {
          set(this.items[index], item.key, item.value);
        });
        success();
      }
    },

    sortTable(key, direction) {
      const compareDesc = (a, b) => {
        if (a[key] < b[key]) {
          return 1;
        }
        if (a[key] > b[key]) {
          return -1;
        }
        return 0;
      };

      const compareAsc = (a, b) => {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      };

      const compare = direction === "asc" ? compareAsc : compareDesc;
      this.items.sort(compare);
    },
    clickedItem(event, item, index) {
      console.log("Clicked item", event, item, index);
    }
  },
  data: () => ({
    items: [
      {
        id: 1,
        first_name: "Ricardo",
        last_name: "Leeming",
        email: "rleeming0@is.gd",
        country: "Japan",
        address: "8 Rieder Place",
        iban: "FR27 6552 4610 89H2 BHPF YVTZ E61",
        nested: {
          status: "ok"
        }
      },
      {
        id: 2,
        first_name: "Amabelle",
        last_name: "Heibel",
        email: "aheibel1@sbwire.com",
        country: "Mongolia",
        address: "2 8th Circle",
        iban: "EE12 8534 4088 6653 2021",
        nested: {
          status: "ok"
        }
      },
      {
        id: 3,
        first_name: "Natala",
        last_name: "Kill",
        email: "nkill2@utexas.edu",
        country: "Syria",
        address: "580 Arapahoe Parkway",
        iban: "FR85 9583 2048 93YI DAIA GVSX U06",
        nested: {
          status: "ok"
        }
      },
      {
        id: 4,
        first_name: "Markus",
        last_name: "Brightman",
        email: "mbrightman3@photobucket.com",
        country: "China",
        address: "19 American Center",
        iban: "GE70 DT37 6963 8607 0176 39",
        nested: {
          status: "ok"
        }
      },
      {
        id: 5,
        first_name: "Shelton",
        last_name: "McGinn",
        email: "smcginn4@about.me",
        country: "Sweden",
        address: "1 Sycamore Trail",
        iban: "MU50 UTQP 1304 8450 4625 8935 383R PR",
        nested: {
          status: "ok"
        }
      },
      {
        id: 6,
        first_name: "Homerus",
        last_name: "Osban",
        email: "hosban5@wunderground.com",
        country: "Philippines",
        address: "72172 Mifflin Plaza",
        iban: "SK24 7680 5909 5375 8687 4916",
        nested: {
          status: "ok"
        }
      },
      {
        id: 7,
        first_name: "Perren",
        last_name: "Krinks",
        email: "pkrinks6@oracle.com",
        country: "Kazakhstan",
        address: "04535 Kim Pass",
        iban: "FR50 3221 9772 68VC 9LZ5 J35O Y92",
        nested: {
          status: "ok"
        }
      },
      {
        id: 8,
        first_name: "Quinn",
        last_name: "Liggins",
        email: "qliggins7@multiply.com",
        country: "Indonesia",
        address: "42262 Havey Parkway",
        iban: "SE81 6425 3048 2790 2241 4175",
        nested: {
          status: "ok"
        }
      },
      {
        id: 9,
        first_name: "Ivar",
        last_name: "Keld",
        email: "ikeld8@mac.com",
        country: "Jordan",
        address: "34682 Ridgeview Way",
        iban: "AZ19 TWKE TSJ2 OFWO R6YT DL2Y MZBU",
        nested: {
          status: "ok"
        }
      },
      {
        id: 10,
        first_name: "Carol-jean",
        last_name: "Bunch",
        email: "cbunch9@oakley.com",
        country: "France",
        address: "00 Shelley Point",
        iban: "CZ63 1886 3197 8748 8643 9175",
        nested: {
          status: "ok"
        }
      },
      {
        id: 11,
        first_name: "Maurita",
        last_name: "Bragge",
        email: "mbraggea@4shared.com",
        country: "Jordan",
        address: "9 Prairieview Pass",
        iban: "HU05 3429 3366 5573 5750 1223 5278",
        nested: {
          status: "ok"
        }
      },
      {
        id: 12,
        first_name: "Ramona",
        last_name: "Bazoge",
        email: "rbazogeb@canalblog.com",
        country: "Ecuador",
        address: "01 Tony Park",
        iban: "DO13 HPKR 2709 1723 3447 2835 0614",
        nested: {
          status: "ok"
        }
      },
      {
        id: 13,
        first_name: "Farly",
        last_name: "Izzatt",
        email: "fizzattc@miitbeian.gov.cn",
        country: "France",
        address: "508 Dakota Street",
        iban: "SE80 6194 7665 3836 4470 5403",
        nested: {
          status: "ok"
        }
      },
      {
        id: 14,
        first_name: "Lionello",
        last_name: "Dagon",
        email: "ldagond@hao123.com",
        country: "Ukraine",
        address: "255 Myrtle Road",
        iban: "BG51 IHVG 1363 47AC RL6I RE",
        nested: {
          status: "ok"
        }
      },
      {
        id: 15,
        first_name: "Lotti",
        last_name: "Kennard",
        email: "lkennarde@alibaba.com",
        country: "Portugal",
        address: "26 Lake View Circle",
        iban: "GR54 4593 917V A6NZ FRLJ JAU0 XUI",
        nested: {
          status: "ok"
        }
      },
      {
        id: 16,
        first_name: "Charis",
        last_name: "Crossdale",
        email: "ccrossdalef@intel.com",
        country: "Poland",
        address: "830 Kropf Terrace",
        iban: "RO62 FBRM FWXK ZZML L8OO QNCJ",
        nested: {
          status: "ok"
        }
      },
      {
        id: 17,
        first_name: "Jeffry",
        last_name: "Tweddle",
        email: "jtweddleg@freewebs.com",
        country: "China",
        address: "02 Sherman Way",
        iban: "VG80 ASDP 7286 0153 1642 1583",
        nested: {
          status: "ok"
        }
      },
      {
        id: 18,
        first_name: "Pavla",
        last_name: "Gardener",
        email: "pgardenerh@istockphoto.com",
        country: "Ukraine",
        address: "9 Meadow Valley Way",
        iban: "IS26 2313 5532 6013 2030 1202 11",
        nested: {
          status: "ok"
        }
      },
      {
        id: 19,
        first_name: "Lauritz",
        last_name: "Aumerle",
        email: "laumerlei@opera.com",
        country: "Angola",
        address: "82 Michigan Drive",
        iban: "NO86 0101 7099 267",
        nested: {
          status: "ok"
        }
      },
      {
        id: 20,
        first_name: "Tarah",
        last_name: "Mingus",
        email: "tmingusj@java.com",
        country: "New Zealand",
        address: "19481 Nova Court",
        iban: "AT31 8530 8451 9377 7918",
        nested: {
          status: "ok"
        }
      }
    ]
  })
};
</script>

<style lang="scss">
body {
  background: #fbfafd;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
}
</style>
