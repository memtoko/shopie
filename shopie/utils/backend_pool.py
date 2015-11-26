from django.core import exceptions
from shopie.settings import shopie_settings

from .import_module import load_module

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
        return getattr(shopie_settings, self.CONSTANT_SETTINGS, [])

    def _load_backend_list(self):
        result = []

        #iterate it
        for mod in self._get_backend_list():
            mod_class = load_module(mod)
            mod_instance = mod_class()
            result.append(mod_instance)

        return result
