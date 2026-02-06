from django.db import models

class Users(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    sex = models.CharField(max_length=10, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    role = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    avatar = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'users'

class Areas(models.Model):
    area_code = models.CharField(unique=True, max_length=20)
    area_name = models.CharField(max_length=100)
    parent_area = models.ForeignKey('self', models.SET_NULL, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'areas'

class Cameras(models.Model):
    area = models.ForeignKey(Areas, models.SET_NULL, blank=True, null=True)
    location_name = models.CharField(max_length=200)
    ip_address = models.CharField(max_length=50)
    coordinates = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=20, default='ACTIVE')
    install_date = models.DateField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'cameras'

class TrafficData(models.Model):
    id = models.BigAutoField(primary_key=True)
    camera = models.ForeignKey(Cameras, models.CASCADE, blank=True, null=True)
    vehicle_count = models.IntegerField(blank=True, null=True)
    vehicle_by_type = models.JSONField(blank=True, null=True)
    avg_speed = models.FloatField(blank=True, null=True)
    queue_length = models.FloatField(blank=True, null=True)
    occupancy_rate = models.FloatField(blank=True, null=True)
    congestion = models.CharField(max_length=20, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'traffic_data'

class Violations(models.Model):
    id = models.BigAutoField(primary_key=True)
    camera = models.ForeignKey(Cameras, models.SET_NULL, blank=True, null=True)
    violation_type = models.CharField(max_length=50)
    license_plate = models.CharField(max_length=20, blank=True, null=True)
    evidence_url = models.TextField(blank=True, null=True)
    occurred_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'violations'

class Incidents(models.Model):
    camera = models.ForeignKey(Cameras, models.SET_NULL, blank=True, null=True)
    type = models.CharField(max_length=50)
    severity = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, default='NEW')
    description = models.TextField(blank=True, null=True)
    detected_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incidents'

class Notifications(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(Users, models.CASCADE, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField()
    priority = models.CharField(max_length=20, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'notifications'