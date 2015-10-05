from collections import OrderedDict

from django.core.exceptions import ImproperlyConfigured
from django.http.response import Http404
from django.core.urlresolvers import reverse

from shopengine.utils.import_module import load_module

class CheckoutStepBucket(object):

<<<<<<< HEAD
    def __init__(self, request, identifier):
        self._identifier = identifier
        self._request = request

    def put(self, key, value):
        self._request.session[self._get_key(key)] = value

    def get(self, key):
        return self._request.session[self._get_key(key)]
=======
    def __init__(self, request, step_identifier):
        self.request = request
        self.step_identifier = step_identifier
>>>>>>> be843565a4085df2cc004c89b39dec489f5acb6d

    def reset(self):
        to_pop = filter(
                lambda i: i.startswith("checkout_%s:" % self.step_identifier),
                self._request.session.keys()
            )
        for key in set(to_pop):
            self._request.session.pop(key, None)

<<<<<<< HEAD
    def _get_key(self, key):
        return "checkout_%s:%s" % (self._identifier, key)
=======
    def set(self, key, value):
        self.request.session["checkout_%s:%s" % (self.step_identifier, key)] = value

    def get(self, key, default=None):
        return self.request.session.get("checkout_%s:%s" % (self.step_identifier, key), default)
>>>>>>> be843565a4085df2cc004c89b39dec489f5acb6d

    def has_all(self, keys):
        return all(self.get(key) for key in keys)

    def __setitem__(self, key, value):
        self.set(key, value)

    def __getitem__(self, key):
        return self.get(key)

class CheckoutStepMixin:
    identifier = None
    title = None  # User-visible
    final = False  # Should be set for final steps (those that may be accessed via the previous step's URL)

    checkout_process = None  # set as an instance variable
    steps = ()  # set as an instance variable; likely accessed via template (`view.steps`)
    next_step = None  # set as an instance variable
    previous_step = None  # set as an instance variable
    request = None  # exists via being a view

    def is_valid(self):
        return True

    def should_skip(self):
        return False

    def process(self):
        raise NotImplementedError("`process` MUST be overridden in %r" % self.__class__)

    def reset(self):
        self.storage.reset()

    def get_success_url(self):
        if self.next_step:
            return reverse("checkout", kwargs={"step": self.next_step.identifier})

    @property
    def storage(self):
        if not hasattr(self, "_storage"):
            self._storage = CheckoutStepBucket(self.request, self.identifier)
        return self._storage

class CheckoutProcess:

    def __init__(self, step_specs, step_kwargs):
        self.step_specs = step_specs
        self.step_kwargs = step_kwargs
        self.current_step = None

    @property
    def steps(self):
        if not getattr(self, '_steps', None):
            self._steps = self._load_steps()
        return self._steps

    def instantiate_step_class(self, step_class, **extra_kwargs):
        if not step_class.identifier:  # pragma: no cover
            raise ImproperlyConfigured("step %r has no identifier" % step_class)
        kwargs = {}
        kwargs.update(self.step_kwargs)
        kwargs.update(extra_kwargs)
        step = step_class(**kwargs)
        step.checkout_process = self
        return step

    def _load_steps(self):
        steps = OrderedDict()
        for step in self.step_specs:
            step_class = load_module(step)
            steps[step_class.identifier] = self.instantiate_step_class(step_class)
        return list(steps.values())

    def get_current_step(self, requested_step_identifier):
        found = False
        for step in self.steps:
            if step.is_valid():
                step.process()
            if found or not requested_step_identifier or requested_step_identifier == step.identifier:
                found = True
                if not step.should_skip():
                    return step
            if not step.should_skip() and not step.is_valid():
                return step
        raise Http404("step with identifier %s not found" % requested_step_identifier)

    def _get_next_step(self, steps, current_step):
        found = False
        for step in steps:
            if step.identifier == current_step:
                found = True
                continue
            if found and not step.should_skip():
                return step

    def get_next_step(self, current_step):
        return self._get_next_step(self.steps, current_step)

    def get_previous_step(self, current_step):
        return self._get_next_step(reversed(self.steps), current_step)

    def prepare_current_step(self, step_identifier):
        current_step = self.get_current_step(step_identifier)
        self.add_step_attributes(current_step)
        self.current_step = current_step
        return current_step

    def add_step_attributes(self, target_step, current_step=None):
        """
        Add step instance attributes (previous, next, etc) to the given target step,
        using the optional `current_step` as the current step for previous and next.

        This is exposed as a public API for the benefit of steps that need to do sub-step
        initialization and dispatching, such as method steps.
        """
        current_step = (current_step or target_step)
        target_step.previous_step = self.get_previous_step(current_step)
        target_step.next_step = self.get_next_step(current_step)
        target_step.steps = self.steps
        if current_step in self.steps:
            current_step_index = self.steps.index(current_step)
            # Set up attributes that are handy for the step bar in the templates.
            for i, step in enumerate(self.steps):
                setattr(step, "is_past", i > current_step_index)
                setattr(step, "is_current", step == current_step)
                setattr(step, "is_future", i < current_step_index)
                setattr(step, "is_previous", step == target_step.previous_step)
                setattr(step, "is_next", step == target_step.next_step)
        return target_step

    def reset(self):
        for step in self.steps:
            step.reset()

    def complete(self):
        """
        To be called from a step (`self.checkout_process.complete()`) when the checkout process is complete.
        """
        self.reset()
