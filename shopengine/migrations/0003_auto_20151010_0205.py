# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0002_auto_20151006_0406'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(default=10, choices=[(30, 'Variant'), (20, 'Variable'), (10, 'Simple'), (40, 'External'), (50, 'Grouped')], verbose_name='Product type'),
        ),
    ]
