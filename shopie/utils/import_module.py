from importlib import import_module
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

_LOADED_CACHE = {}

def load_module(specification, context="Load"):
    delimiter = (":" if ":" in specification else ".")
    module_name, object_name = specification.rsplit(delimiter, 1)
    try:
        module = import_module(module_name)
    except ImportError as ie:  # pragma: no cover
        raise ImproperlyConfigured(
            "%s: Could not import module %r to load %r from. (%r)" %
            (context, module_name, object_name, ie)
        )

    obj = getattr(module, object_name, None)
    if obj is None:  # pragma: no cover
        raise ImproperlyConfigured(
            "%s: Module %r does not have a name %r, or its value is None." % (
                context_explanation, module, object_name))
    return obj

def clear_loaded_cache():
    _LOADED_CACHE.clear()

def cached_load(setting_name, default_value=None):
    if setting_name in _LOAD_CACHE:
        return _LOAD_CACHE[setting_name]
    setting_value = getattr(settings, setting_name, None)
    if setting_value is not None:
        value = load_module(setting_value)
    else:
        value = default_value
    _LOAD_CACHE[setting_name] = value
    return value
