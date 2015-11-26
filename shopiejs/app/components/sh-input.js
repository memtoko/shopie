import Ember from 'ember'
import TextInputMixin from '../mixins/text-input';

export default Ember.TextField.extend(TextInputMixin, {
  classNames: 'sh-input'
});
