# backend/api/views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate

from .models import Areas, Cameras, Violations, TrafficData, Incidents, Users
from .serializers import (
    AreaSerializer, 
    CamerasSerializer, 
    ViolationsSerializer, 
    TrafficDataSerializer, 
    IncidentsSerializer
)


# --- Bổ sung AreaViewSet để React có thể lấy danh sách Quận ---
class AreaViewSet(viewsets.ModelViewSet):
    queryset = Areas.objects.all()
    serializer_class = AreaSerializer

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


# --- API Xử lý Đăng nhập ---
@api_view(['POST'])
def login_api(request):
    # Lấy tài khoản mật khẩu từ React gửi lên
    username = request.data.get('username')
    password = request.data.get('password')
    
    # --- LỚP 1: Kiểm tra xem có phải là Admin/Cảnh sát hệ thống không ---
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({
            "status": "success",
            "message": "Đăng nhập hệ thống quản trị thành công!",
            "user": {
                "id": user.id,
                "username": user.username,
                "name": user.username.upper(), 
                "role": "Admin" if user.is_superuser else "Police"
            }
        })
    
    # --- LỚP 2: Kiểm tra người dùng bình thường trong bảng "Users" ---
    try:
        # Tìm trong database xem có ai có email và password khớp không
        custom_user = Users.objects.get(email=username, password=password)
        
        return Response({
            "status": "success",
            "message": "Đăng nhập thành công!",
            "user": {
                "id": custom_user.id,
                "username": custom_user.email,
                "name": custom_user.full_name, # Lấy tên thật từ database
                "role": "User" # Cấp quyền người dùng bình thường
            }
        })
    except Users.DoesNotExist:
        # Nếu tìm cả 2 bảng đều không thấy
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=400)