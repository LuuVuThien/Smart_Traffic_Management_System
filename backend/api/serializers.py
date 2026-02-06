# backend/api/serializers.py
from rest_framework import serializers
from .models import Users, Cameras, Violations, TrafficData, Incidents, Notifications

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