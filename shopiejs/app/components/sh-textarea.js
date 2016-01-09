import Ember from 'ember';
import TextInputMixin from '../mixins/text-input';

export default Ember.TextArea.extend(TextInputMixin, {
  classNames: 'sh-input'
});
