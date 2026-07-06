from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("listings", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="listing",
            old_name="hatch_date",
            new_name="available_date",
        ),
        migrations.RenameField(
            model_name="listing",
            old_name="price_per_chick",
            new_name="price_per_unit",
        ),
        migrations.AlterField(
            model_name="listing",
            name="available_date",
            field=models.DateField(
                help_text="Hatch date for chicks, or pack/collection date for eggs."
            ),
        ),
        migrations.AlterField(
            model_name="listing",
            name="breed",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="listing",
            name="product_type",
            field=models.CharField(
                choices=[("chick", "Day-old chicks"), ("egg", "Table eggs")],
                default="chick",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="listing",
            name="egg_grade",
            field=models.CharField(
                blank=True,
                choices=[
                    ("small", "Small"),
                    ("medium", "Medium"),
                    ("large", "Large"),
                    ("extra_large", "Extra large"),
                ],
                max_length=15,
            ),
        ),
    ]
