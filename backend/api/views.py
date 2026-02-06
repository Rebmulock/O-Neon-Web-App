from .serializers import *
from .permissions import IsInstructor
from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

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


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]


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


class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"detail": "User account deleted successfully."}, status=status.HTTP_200_OK)


class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsInstructor]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def get_serializer(self, *args, **kwargs):
        files_map = {
            key: file
            for key, file in self.request.FILES.items() if key.startswith("file_")
        }

        kwargs['context'] = self.get_serializer_context()
        kwargs['context']['files_map'] = files_map

        return self.serializer_class(*args, **kwargs)


class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and getattr(user, "role", "instructor"):
            return Course.objects.filter(instructor=user)

        return Course.objects.all()

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CourseDetailSerializer
        return CourseSerializer

    def get_serializer(self, *args, **kwargs):
        files_map = {
            key: file
            for key, file in self.request.FILES.items() if key.startswith("file_")
        }

        kwargs['context'] = self.get_serializer_context()
        kwargs['context']['files_map'] = files_map

        return super().get_serializer(*args, **kwargs)

    def perform_update(self, serializer):
        serializer.save(instructor=self.request.user)