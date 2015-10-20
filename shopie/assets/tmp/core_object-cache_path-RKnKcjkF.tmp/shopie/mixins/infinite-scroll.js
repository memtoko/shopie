define('shopie/mixins/infinite-scroll', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        isLoading: false,
        triggerPoint: 100,

        /**
         * Determines if we are past a scroll point where we need to fetch the next page
         * @param {object} event The scroll event
         */
        checkScroll: function checkScroll(event) {
            var element = event.target,
                triggerPoint = this.get('triggerPoint'),
                isLoading = this.get('isLoading');

            // If we haven't passed our threshold or we are already fetching content, exit
            if (isLoading || element.scrollTop + element.clientHeight + triggerPoint <= element.scrollHeight) {
                return;
            }

            this.sendAction('fetch');
        },

        didInsertElement: function didInsertElement() {
            var el = this.get('element');

            el.onscroll = Ember['default'].run.bind(this, this.checkScroll);

            if (el.scrollHeight <= el.clientHeight) {
                this.sendAction('fetch');
            }
        },

        willDestroyElement: function willDestroyElement() {
            // turn off the scroll handler
            this.get('element').onscroll = null;
        }
    });

});