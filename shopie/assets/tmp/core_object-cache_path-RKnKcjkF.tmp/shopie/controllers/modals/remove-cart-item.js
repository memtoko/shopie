define('shopie/controllers/modals/remove-cart-item', ['exports', 'ember', 'shopie/utils/get-cookie', 'ic-ajax'], function (exports, Ember, getCookie, ic_ajax) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        notifications: Ember['default'].inject.service(),

        actions: {
            confirmAccept: function confirmAccept() {
                var _this = this;

                var item = this.get('model'),
                    itemId = this.get('id'),
                    itemName = item.get('productName'),
                    cart = item.get('cart');

                return ic_ajax.request({
                    url: '/cart/item/' + itemId + '/delete/',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    headers: {
                        'X-CSRFToken': getCookie['default']('csrftoken')
                    },
                    data: {
                        product_id: item.productId,
                        add_item_quantity: 0
                    }
                }).then(function (json) {
                    var message = itemName + ' telah dihapus dari keranjang anda';
                    _this.get('notifications').showNotification(message, {
                        delayed: false,
                        key: 'cart.items.remove'
                    });
                    _this.get('model').deleteRecord();
                    _this.send('refreshCart');
                    return json;
                }, function (error) {
                    _this.get('notifications').showAPIError(error, { key: 'cart.items.remove' });
                });
            },

            confirmReject: function confirmReject() {
                return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                    return resolve();
                });
            }
        },

        confirm: {
            accept: {
                text: 'Remove',
                buttonClass: 'btn btn-red'
            },
            reject: {
                text: 'Cancel',
                buttonClass: 'btn btn-default btn-minor'
            }
        }
    });

});