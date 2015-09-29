from functools import update_wrapper

class ShopViewMixins:

    generic_template = None

    def get_template_names(self):
        templates = super(ShopViewMixins, self).get_template_names()
        if not self.generic_template in templates:
            templates.append(self.generic_template)
        return templates
