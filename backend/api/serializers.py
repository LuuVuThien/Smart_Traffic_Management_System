# backend/api/serializers.py
from rest_framework import serializers
from .models import Users, Areas, Cameras, Violations, TrafficData, Incidents, Notifications

# --- Thêm Serializer cho Areas (Quận) ---
class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Areas
        fields = '__all__'

# --- Các Serializer cũ của bạn giữ nguyên ---
class CamerasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cameras
        fields = '__all__'

class ViolationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Violations
        fields = '__all__'
        
class TrafficDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficData
        fields = '__all__'

class IncidentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidents
        fields = '__all__'