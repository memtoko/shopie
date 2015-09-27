from importlib import import_module

from django.core import exceptions
from django.conf import settings

class BaseBackendPool(object):
    """This backend pool make it easy to load the specific module. Use same
    method as django do.

    Override the CONSTANT_SETTINGS in the actual backend pool.
    """
    USE_CACHE = True
    CONSTANT_SETTINGS = None #override this

    def __init__(self):
        self._backend_list = []

    def get_backend_list(self):
        if not self.USE_CACHE or not self._backend_list:
            self._backend_list = self._load_backend_list()
        return self._backend_list

    def _get_backend_list(self):
        if self.CONSTANT_SETTINGS is None:
            return []
        return getattr(settings, self.CONSTANT_SETTINGS, [])

    def _load_backend_list(self):
        result = []

        #iterate it
        for mod in self._get_backend_list():
            try:
                mod_module, mod_classname = mod.rsplit('.', 1)
            except ValueError:
                raise exceptions.ImproperlyConfigured(
                        'We are sory, i can\'t import module %s' % (mod_module)
                    )
            try:
                module = import_module(mod_module)
            except ImportError:
                raise exceptions.ImproperlyConfigured(
                        'Error importing module %s' % (mod_module)
                    )
            try:
                mod_class = getattr(module, mod_classname)
            except AttributeError:
                raise exceptions.ImproperlyConfigured(
                    'Module "%s" does not define a "%s" class' %
                        (mod_module, mod_classname))
            mod_instance = mod_class()
            result.append(mod_instance)

        return result
