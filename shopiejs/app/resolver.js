import Ember from 'ember';
import Resolver from 'ember/resolver';
// this resolver allows us to place our form components on subdir
function startsWith(string, beginning) {
  return string.indexOf(beginning) === 0;
};

function endsWith(string, tail) {
  return string.indexOf(tail, string.length - tail.length) !== -1;
};

export default Resolver.extend({
  // form module just a component that live under their directory
  formModuleName(parsedName) {
    if (endsWith(parsedName.name, '-form')) {
      var isComponent = parsedName.type === 'component',
        isComponentTemplate = startsWith(parsedName.name, 'components/'),
        path;

      if (isComponent || isComponentTemplate) {
        path = parsedName.prefix + '/' +  this.pluralize(parsedName.type) + '/';

        if (isComponentTemplate) {
          path += 'components/forms/' + parsedName.fullNameWithoutType.substr(11);
        } else {
          path += 'forms/' + parsedName.fullNameWithoutType;
        }

        return path;
      }
    }
  },

  moduleNameLookupPatterns: Ember.computed(function () {
    return Ember.A([
      this.formModuleName,
      this.podBasedModuleName,
      this.podBasedComponentsInSubdir,
      this.mainModuleName,
      this.defaultModuleName
    ]);
  })
});
