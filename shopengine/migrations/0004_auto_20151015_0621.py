# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0003_auto_20151010_0205'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(choices=[(10, 'Simple'), (20, 'Variable'), (40, 'External'), (30, 'Variant'), (50, 'Grouped')], default=10, verbose_name='Product type'),
        ),
    ]
