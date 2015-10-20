# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0006_auto_20151019_0633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(default=10, choices=[(10, 'Simple'), (50, 'Grouped'), (40, 'External'), (30, 'Variant'), (20, 'Variable')], verbose_name='Product type'),
        ),
    ]
