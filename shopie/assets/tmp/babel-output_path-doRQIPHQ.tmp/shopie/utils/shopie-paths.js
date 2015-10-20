var makeRoute = function makeRoute(root, args) {
    var slashAtStart, slashAtEnd, parts, route;

    slashAtStart = /^\//;
    slashAtEnd = /\/$/;
    route = root.replace(slashAtEnd, '');
    parts = Array.prototype.slice.call(args, 0);

    parts.forEach(function (part) {
        if (part) {
            route = [route, part.replace(slashAtStart, '').replace(slashAtEnd, '')].join('/');
        }
    });
    return route += '/';
};

var shopiePaths = function shopiePaths() {
    var _arguments = arguments;

    var adminRoot = '/console',
        apiRoot = '/api/v1';

    return {
        adminRoot: adminRoot,
        apiRoot: apiRoot,
        url: {
            admin: function admin() {
                return makeRoute(adminRoot, _arguments);
            },
            api: function api() {
                return makeRoute(apiRoot, _arguments);
            },

            isSecure: function isSecure(url) {
                var link = document.createElement('a');
                link.href = url;
                return link.protocol === 'https:';
            },

            join: function join() {
                if (arguments.length > 1) {
                    return makeRoute(arguments[0], Array.prototype.slice.call(arguments, 1));
                } else if (arguments.length === 1) {
                    var arg = arguments[0];
                    return arg.slice(-1) === '/' ? arg : arg + '/';
                }
                return '/';
            }
        }
    };
};

export default shopiePaths;