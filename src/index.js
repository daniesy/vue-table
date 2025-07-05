import vTable from "./components/Table";
import Column from "./components/Column";
import Action from "./components/Action";

const Components = { Action, Column, vTable };

export default {
  install(app) {
    for (let key in Components) {
      app.component(key, Components[key]);
    }
  },
  ...Components
};
