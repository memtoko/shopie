# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shopie', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4, verbose_name='UUID')),
                ('slug', models.CharField(verbose_name='Slug', max_length=250)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, db_index=True)),
                ('name', models.CharField(verbose_name='Product Name', blank=True, max_length=255)),
                ('description', models.TextField(verbose_name='Descriptions', blank=True)),
                ('file', models.FileField(upload_to='', verbose_name='File', blank=True)),
                ('is_public', models.BooleanField(verbose_name='is public', default=False)),
                ('user', models.ForeignKey(blank=True, null=True, verbose_name='owner', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
