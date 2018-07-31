import Route from '@ember/routing/route';

export default Route.extend({
  titleToken: 'Set Password',

  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
