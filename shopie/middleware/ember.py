class EmberPreload:
    def process_request(self, request):
        request._ember_preload = {}
