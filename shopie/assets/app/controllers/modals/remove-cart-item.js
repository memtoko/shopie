import Ember from 'ember';
import getCookie from 'shopie/utils/get-cookie';

export default Ember.Controller.extend({
    notifications: Ember.inject.service(),

    actions: {
        confirmAccept: function () {
            let item = this.get('model'),
                itemName = item.get('productName'),
                cart = item.get('cart');
            return new Ember.RSVP.Promise((resolve, reject) => {
                let request = Ember.$.ajax({
                    url: '/cart/item/',
                    method: 'POST',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    data: {
                        add_item_id: item.product.id,
                        add_item_quantity: 0
                    }
                });
                request.then((json) => {
                    let message = `${itemName} telah dihapus dari keranjang anda`;
                    this.get('notifications').showNotification(message, {
                        delayed: false,
                        key: 'cart.items.remove'
                    });
                    this.get('model').deleteRecord();
                    this.send('refreshCart');
                    Ember.run(null, resolve, json);
                });
                request.fail((jqXHR, textStatus) => {
                    Ember.run(null, reject, `error removing ${itemName} from the cart`);
                    this.get('notifications').showAPIError(textStatus, {key: 'cart.items.remove'});
                });
            });
        },

        confirmReject: function() {
            return new Ember.RSVP.Promise((resolve, reject) => resolve());
        }
    },

    confirm: {
        accept: {
            text: 'Remove',
            buttonClass: 'button tiny alert radius'
        },
        reject: {
            text: 'Cancel',
            buttonClass: 'button tiny radius'
        }
    }
});
