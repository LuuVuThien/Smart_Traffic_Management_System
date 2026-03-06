from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Thêm AreaViewSet vào dòng import dưới đây
from .views import AreaViewSet, CameraViewSet, ViolationViewSet, TrafficDataViewSet, IncidentViewSet, login_api
router = DefaultRouter()
# Đăng ký đường dẫn cho areas - Đây là dòng quan trọng nhất!
router.register(r'areas', AreaViewSet) 
router.register(r'cameras', CameraViewSet)
router.register(r'violations', ViolationViewSet)
router.register(r'traffic-data', TrafficDataViewSet)
router.register(r'incidents', IncidentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_api, name='login'),
]