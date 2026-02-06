from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CameraViewSet, ViolationViewSet, TrafficDataViewSet, IncidentViewSet

router = DefaultRouter()
router.register(r'cameras', CameraViewSet)
router.register(r'violations', ViolationViewSet)
router.register(r'traffic-data', TrafficDataViewSet)
router.register(r'incidents', IncidentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]