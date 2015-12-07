# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopie', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producttag',
            name='products',
            field=models.ManyToManyField(blank=True, verbose_name='products', to='shopie.Product', related_name='tags'),
        ),
    ]
