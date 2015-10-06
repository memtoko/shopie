# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='parent',
            field=models.ForeignKey(null=True, to='shopengine.Product', verbose_name='Product Parent', blank=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(default=10, verbose_name='Product type', choices=[(20, 'Variable'), (10, 'Simple'), (30, 'Variant'), (40, 'External'), (50, 'Grouped')]),
        ),
    ]
