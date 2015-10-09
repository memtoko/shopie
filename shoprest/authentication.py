from tastypie.authentication import Authentication, SessionAuthentication

class SessionCheckDangerous(Authentication):

    def __init__(self, backend=None, **kwargs):
        if backend is None:
            backend = SessionAuthentication()
        self._backend = backend
        super(SessionCheckDangerous, self).__init__(**kwargs)

    def is_authenticated(self, request, **kwargs):
        if request.method == 'GET':
            return True
        return self._backend.is_authenticated(request, **kwargs)
