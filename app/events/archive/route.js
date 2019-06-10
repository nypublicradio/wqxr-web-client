import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({

  redirect() {
    let year  = moment().format('YYYY');
    let month = moment().format('MMM').toLowerCase();
    this.transitionTo('djangorendered', `events/${year}/${month}`);
  }
});
