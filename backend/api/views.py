from rest_framework.response import Response

from .models import User
from .serializers import *
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.

ADMIN_TOKEN = 'admintoken123'

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class SuperUserCreateView(generics.CreateAPIView):
    serializer_class = SuperUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('admin_token')

        if token != ADMIN_TOKEN:
            return Response({'error': 'Invalid or missing admin token'}, status=status.HTTP_403_FORBIDDEN)

        return super().post(request, *args, **kwargs)

class UserReadView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)