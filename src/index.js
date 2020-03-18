import Vue from "vue";

import VueTable from "./components/VueTable";
import Column from "./components/Column";
import Action from "./components/Action";

const Components = { Action, Column, VueTable };

for (let key in Components) {
  Vue.component(key, Components[key]);
}

export default Components;
