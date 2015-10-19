# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopengine', '0005_auto_20151016_1741'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='created_at',
            field=models.DateTimeField(verbose_name='Date added', null=True, auto_now_add=True),
        ),
        migrations.AddField(
            model_name='product',
            name='updated_at',
            field=models.DateTimeField(verbose_name='Last modified', null=True, auto_now=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.IntegerField(verbose_name='Product type', default=10, choices=[(50, 'Grouped'), (20, 'Variable'), (10, 'Simple'), (30, 'Variant'), (40, 'External')]),
        ),
    ]
