# Generated by Django 4.2.4 on 2023-09-20 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('enrollments', '0005_enrollment_payment'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='pay_id_to_refund',
            field=models.CharField(default=0, max_length=255),
        ),
    ]
