# Generated by Django 5.0.3 on 2024-04-01 17:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_officehoursession_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='session',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.officehoursession'),
        ),
    ]
