from django.contrib import admin

# Register your models here.
from shopengine import models

class ProductAdmin(admin.ModelAdmin):
    exclude = ["uuid", "slug"]

admin.site.register(models.Product, ProductAdmin)
