import getGravatar from '../utils/gravatar';

let gravatarDirective = function() {

    let linker = function(scope) {
        scope.url = getGravatar(scope.email);
        scope.$watch('email', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                scope.url = getGravatar(newValue);
            }
        });
    };
    return {
        restrict: 'EA',
        template: '<img src="{{url}}"></img>',
        replace: true,
        scope: {
            email: '='
        },
        link: linker
    };
};
