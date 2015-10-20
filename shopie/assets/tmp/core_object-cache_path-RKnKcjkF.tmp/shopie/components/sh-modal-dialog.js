define('shopie/components/sh-modal-dialog', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({

        notifications: Ember['default'].inject.service(),

        didInsertElement: function didInsertElement() {
            this.$('.js-modal-container, .js-modal-background').addClass('fade-in open');
            this.$('.js-modal').addClass('open');
        },

        close: function close() {
            var self = this;

            this.$('.js-modal, .js-modal-background').removeClass('fade-in').addClass('fade-out');

            // The background should always be the last thing to fade out, so check on that instead of the content
            this.$('.js-modal-background').on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (event) {
                if (event.originalEvent.animationName === 'fade-out') {
                    self.$('.js-modal, .js-modal-background').removeClass('open');
                }
            });

            this.sendAction();
        },

        handleAction: function handleAction(promise) {
            var _this = this;

            promise.then(function (resolved) {
                _this.close();
                return resolved;
            }, function (error) {
                _this.get('notifications').showErrors(error, {});
            });
        },

        actions: {
            closeModal: function closeModal() {
                this.close();
            },
            confirmAccept: function confirmAccept() {
                this.handleAction(this.attrs.confirmAccept());
            },
            confirmReject: function confirmReject() {
                this.handleAction(this.attrs.confirmReject());
            },
            noBubble: Ember['default'].K
        },

        klass: Ember['default'].computed('type', 'style', function () {
            var classNames = [];

            classNames.push(this.get('type') ? 'modal-' + this.get('type') : 'modal');

            if (this.get('style')) {
                this.get('style').split(',').forEach(function (style) {
                    classNames.push('modal-style-' + style);
                });
            }

            return classNames.join(' ');
        }),

        acceptButtonClass: Ember['default'].computed('confirm.accept.buttonClass', function () {
            return this.get('confirm.accept.buttonClass') ? this.get('confirm.accept.buttonClass') : 'btn btn-green';
        }),

        rejectButtonClass: Ember['default'].computed('confirm.reject.buttonClass', function () {
            return this.get('confirm.reject.buttonClass') ? this.get('confirm.reject.buttonClass') : 'btn btn-red';
        })
    });

});