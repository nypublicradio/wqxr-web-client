import $ from 'jquery';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { set } from '@ember/object';

import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';

let validations = {
  legal: validatePresence(true)
};

export default Component.extend({
  tagName: 'section',
  classNames: ['newsletter-signup', 'background--light'],
  formLoading: false,
  successMsg: null,
  errorMsg: null,

  init() {
    this._super(...arguments);
    let changeset = new Changeset(
      { legal: true },
      lookupValidator(validations),
      validations
    );
    set(this, 'changeset', changeset);
  },

  disableSubmit: computed('changeset.legal', function() {
    if (!this.changeset.get('legal') || this.changeset.get('errors.length')) {
      return true;
    } else {
      return false;
    }
  }),

  hasErrors: function(){
    let emailAddress = this.get("email");
    if (!emailAddress){
      this.set('errorMsg', "Please enter your email address");
      return true;
    }
    if (this.validateEmail(emailAddress)) {
      this.set('errorMsg', null);
      return false;
    } else {
      this.set('errorMsg', "The email address you entered doesn't look correct.");
      return true;
    }
  },

  validateEmail: function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  actions: {
    submitForm: function(){
      if (!this.hasErrors()){
        this.set("formLoading", true);
        let options = {
          type: 'GET',
          url: "https://wqxr.us5.list-manage.com/subscribe/post-json?u=4109fdd323aaac7078eadaa8f&amp;id=aa1c2a6097",
          dataType: 'jsonp',
          jsonp: 'c',
          data: this.$('form').serialize(),
        };
        $.ajax(options).always(function(response) {
          if ( response.result === "error" ) {
            this.set('formLoading', false);
            this.set('errorMsg', htmlSafe(response.msg));
          } else {
            this.set('formLoading', false);
            this.set('successMsg', htmlSafe(response.msg));
          }
        }.bind(this));

      }
    },

    //release the error state as the user enters text
    releaseErrorState: function(){
      this.set('errorMsg', null);
    },

  }
});
