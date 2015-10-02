from collections import OrderedDict

from django.core.exceptions import ImproperlyConfigured
from django.http.response import Http404
from django.core.urlresolvers import reverse

from shopengine.utils.import_module import load_module

class CheckoutStepBucket:

	def __init__(self, request, identifier):
		self._identifier = identifier
		self._request = request

	def put(self, key, value):
		self._request.session[self._get_key(key)] = value

	def get(self, key):
		return self._request.session[self._get_key(key)]

    def reset(self):
        to_pop = filter(
                lambda i: i.startswith("checkout_%s:" % self._identifier),
                self._request.session.keys()
            )
        for key in set(to_pop):
            self._request.session.pop(key, None)

	def _get_key(self, key):
		return "checkout_%s:%s" % (self._identifier, key)

    def has_all(self, keys):
        return all(self.get(key) for key in keys)

    def __getitem__(self, key):
        return self.get(key)

    def __setitem__(self, key, value):
        self.put(key, value)

class CheckoutStepMixin:
    identifier = None
    title = None  # User-visible
    final = False  # Should be set for final steps (those that may be accessed via the previous step's URL)

    checkout_process = None  # set as an instance variable
    steps = ()  # set as an instance variable; likely accessed via template (`view.phases`)
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
            self._storage = CheckoutStepBucket(request=self.request, identifier=self.identifier)
        return self._storage

class CheckoutProcess:

    def __init__(self, step_specs, step_kwargs):
        self.step_specs = step_specs
        self.step_kwargs = step_kwargs
        self.current_step = None

    def steps(self):
        if not getattr(self, '_steps', None):
            self._steps = self._load_steps()
        return self._steps

    def instantiate_step_class(self, step_class, **extra_kwargs):
        if not step_class.identifier:  # pragma: no cover
            raise ImproperlyConfigured("Phase %r has no identifier" % phase_class)
        kwargs = {}
        kwargs.update(self.step_kwargs)
        kwargs.update(extra_kwargs)
        step = step_class(**kwargs)
        step.checkout_process = self
        return phase

    def _load_steps(self):
        steps = OrderedDict()
        for step in self.step_specs:
            step_class = load_module(step)
            steps[step_class.identifier] = self.instantiate_step_class(step_class)
        return list(steps.values())

    def get_current_step(self, requested_phase_identifier):
        found = False
        for step in self.steps:
            if step.is_valid():
                step.process()
            if found or not requested_phase_identifier or requested_phase_identifier == step.identifier:
                found = True
                if not step.should_skip():
                    return step
            if not step.should_skip and not step.is_valid():
                return step
            raise Http404("Phase with identifier %s not found" % requested_phase_identifier)

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
        current_phase = self.get_current_step(step_identifier)
        self.add_step_attributes(current_step)
        self.current_step = current_step
        return current_step

    def add_phase_attributes(self, target_step, current_step=None):
        """
        Add phase instance attributes (previous, next, etc) to the given target phase,
        using the optional `current_phase` as the current phase for previous and next.

        This is exposed as a public API for the benefit of phases that need to do sub-phase
        initialization and dispatching, such as method phases.
        """
        current_step = (current_step or target_step)
        target_step.previous_step = self.get_previous_step(current_step)
        target_phase.next_step = self.get_next_step(current_step)
        target_phase.steps = self.steps
        if current_step in self.steps:
            current_step_index = self.steps.index(current_step)
            # Set up attributes that are handy for the phase bar in the templates.
            for i, phase in enumerate(self.steps):
                setattr(phase, "is_past", i > current_step_index)
                setattr(phase, "is_current", phase == current_step)
                setattr(phase, "is_future", i < current_step_index)
                setattr(phase, "is_previous", phase == target_step.previous_step)
                setattr(phase, "is_next", phase == target_phase.next_step)
        return target_step

    def reset(self):
        for step in self.steps:
            step.reset()

    def complete(self):
        """
        To be called from a phase (`self.checkout_process.complete()`) when the checkout process is complete.
        """
        self.reset()

