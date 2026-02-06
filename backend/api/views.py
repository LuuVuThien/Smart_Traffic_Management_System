# backend/api/views.py
from rest_framework import viewsets
from .models import Cameras, Violations, TrafficData, Incidents
from .serializers import CamerasSerializer, ViolationsSerializer, TrafficDataSerializer, IncidentsSerializer

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Cameras.objects.all()
    serializer_class = CamerasSerializer

class ViolationViewSet(viewsets.ModelViewSet):
    queryset = Violations.objects.all().order_by('-occurred_at')
    serializer_class = ViolationsSerializer

class TrafficDataViewSet(viewsets.ModelViewSet):
    queryset = TrafficData.objects.all().order_by('-recorded_at')
    serializer_class = TrafficDataSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incidents.objects.all().order_by('-detected_at')
    serializer_class = IncidentsSerializer