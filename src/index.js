import Vue from "vue";

import Table from "./components/Table";
import Column from "./components/Column";
import Action from "./components/Action";

const Components = { Action, Column, Table };

for (let key in Components) {
  Vue.component(key, Components[key]);
}

export default Components;
