# Generated by Django 5.0.3 on 2024-03-31 03:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_officehoursession'),
    ]

    operations = [
        migrations.AddField(
            model_name='officehoursession',
            name='questions',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='officehoursession',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]