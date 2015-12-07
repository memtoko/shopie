from django.contrib import admin

# Register your models here.
from shopie import models

class ProductAdmin(admin.ModelAdmin):
    exclude = ["uuid", "slug"]

class ProductTagAdmin(admin.ModelAdmin):
    exclude = ["uuid", "slug"]

admin.site.register(models.Product, ProductAdmin)
admin.site.register(models.ProductTag, ProductTagAdmin)
