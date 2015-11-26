from oauth2_provider.models import get_application_model

Application = get_application_model()

def application(request):
    try:
        selfapp = Application.objects.get(pk=1)
    except Application.DoesNotExist:
        pass
    else:
        request._ember_preload.update({
            'clientId': selfapp.client_id,
            'clientSecret': selfapp.client_secret
        })
    return {'ember_preload': request._ember_preload}
