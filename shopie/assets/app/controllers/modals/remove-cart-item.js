import Ember from 'ember';
import getCookie from 'shopie/utils/get-cookie';
import {request as ajax} from 'ic-ajax';

export default Ember.Controller.extend({
    notifications: Ember.inject.service(),

    actions: {
        confirmAccept: function () {
            let item = this.get('model'),
                itemId = this.get('id'),
                itemName = item.get('productName'),
                cart = item.get('cart');

            return ajax({
                url: `/cart/item/${itemId}/delete/`,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                data: {
                    product_id: item.productId,
                    add_item_quantity: 0
                }
            }).then((json) => {
                let message = `${itemName} telah dihapus dari keranjang anda`;
                this.get('notifications').showNotification(message, {
                    delayed: false,
                    key: 'cart.items.remove'
                });
                this.get('model').deleteRecord();
                this.send('refreshCart');
                return json;
            }, (error) => {
                this.get('notifications').showAPIError(error, {key: 'cart.items.remove'});
            });
        },

        confirmReject: function() {
            return new Ember.RSVP.Promise((resolve, reject) => resolve());
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
