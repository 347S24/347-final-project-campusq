# Generated by Django 4.2.11 on 2024-04-19 22:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_student_position'),
    ]

    operations = [
        migrations.AlterField(
            model_name='officehoursession',
            name='professor',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.professor'),
        ),
    ]