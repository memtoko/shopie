# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0004_auto_20151015_0621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(choices=[(20, 'Variable'), (50, 'Grouped'), (10, 'Simple'), (40, 'External'), (30, 'Variant')], default=10, verbose_name='Product type'),
        ),
    ]
