import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce, later, cancel } from '@ember/runloop';
import toggleBoxPositioner from '../../utils/toggle-box-positioner';

export default Component.extend({
  classNames: ['toggle-box'],
  classNameBindings: ['open:is-active', 'theme', 'hPos', 'vPos'],
  open: false,
  theme: 'dark',
  icon: 'caret-down',
  closeDelay: 5000,
  contentClass: '',
  timer: 0,

  contentClasses: computed('theme', function() {
    return `toggle-box__dropdown ${this.theme} ${this.contentClass}`;
  }),

  calculatePosition(trigger, content, _destination, ref) {
    scheduleOnce('afterRender',() => {
      // #calculatePosition is called without this component's context
      // so we have to reach into this component through the ref argument
      ref.dropdown.parentView.hookUpContentListeners(content, ref);
    });

    return toggleBoxPositioner(...arguments);
  },

  hookUpContentListeners(contentElement, ref) {
    let _this = ref.dropdown.parentView;

    let autoclose = () => {
      _this.autoclose(ref.dropdown);
    }

    contentElement.addEventListener('mouseenter', autoclose, true);
    contentElement.addEventListener('mousemove', autoclose, true);

    autoclose(); // trigger the first autoclose, which will be cancelled/deferred with element interaction
  },

  autoclose: function(dropdown) {
    if (this.timer) {
      cancel(this.timer);
      this.timer = 0;
    }
    this.timer = later(this, function() {
      this.timer = 0;

      // These differ based on how they were called, unfortunately
      if (dropdown && dropdown.actions && dropdown.actions.close) {
        dropdown.actions.close()
      }
      else if (dropdown && dropdown.close) {
        dropdown.close();
      }
    }, this.closeDelay);
  },
});
