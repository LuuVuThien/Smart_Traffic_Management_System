from django.contrib import admin
from .models import Users, Areas, Cameras, TrafficData, Violations, Incidents, Notifications

# Đăng ký các bảng để hiển thị trên trang Admin
admin.site.register(Users)
admin.site.register(Areas)
admin.site.register(Cameras)
admin.site.register(TrafficData)
admin.site.register(Violations)
admin.site.register(Incidents)
admin.site.register(Notifications)