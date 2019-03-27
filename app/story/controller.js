import { scheduleOnce } from '@ember/runloop';
import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';



export default Controller.extend({
  queryParams:  ['tab'],
  tab: null,
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  setTab() {
    if (get(this, 'isFastBoot')) {
      return;
    }
    if (location.hash.substr(1) === "transcript"){
      this.set("tab", 'transcript');
    }
  },

  init(){
    this._super(...arguments);
    scheduleOnce("afterRender", this, this.setTab);
  },
});
