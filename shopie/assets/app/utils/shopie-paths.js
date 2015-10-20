let makeRoute = function(root, args) {
    var slashAtStart,
        slashAtEnd,
        parts,
        route;

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

let shopiePaths = function () {
    let adminRoot = '/console',
        oauth2Root = '/o',
        apiRoot = '/api/v1';

    return {
        adminRoot: adminRoot,
        apiRoot: apiRoot,
        oauth2Root: oauth2Root,
        url: {
            admin: () => makeRoute(adminRoot, arguments),
            api: () => makeRoute(apiRoot, arguments),
            oauth2: () => makeRoute(oauth2Root, arguments),
            isSecure: function(url) {
                var link = document.createElement('a');
                link.href = url;
                return link.protocol === 'https:';
            },

            join: function() {
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
