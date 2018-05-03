import Component from 'nypr-django-for-ember/components/django-page';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
});
