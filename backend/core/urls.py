"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from api import views
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.UserLoginView.as_view(), name='user_login'),
    path('api/register/', views.UserCreateView.as_view(), name='user_register'),
    path('api/register/admin', views.SuperUserCreateView.as_view(), name='admin_register'),
    path('api/profile/', views.UserReadView.as_view(), name='user_read'),
    path("api/profile/edit/", views.UserUpdateView.as_view(), name="user_edit"),
    path("api/profile/delete/", views.UserDeleteView.as_view(), name="user_delete"),
    path('api/courses/', views.CourseListView.as_view(), name='course_list'),
    path('api/courses/create/', views.CourseCreateView.as_view(), name='course_create'),
    path('api/courses/<int:pk>/', views.CourseDetailView.as_view(), name='course_detail'),
    path('api/users/list/', views.UserListView.as_view(), name='users_list'),
    path('api/users/<int:id>/', views.SuperUserManageView.as_view(), name='admin_manage_users'),
    path('api/instructor-approvals/', views.PendingInstructorListView.as_view(), name='pending_instructors_list'),
    path('api/instructor-approvals/<int:id>/', views.InstructorApprovalView.as_view(), name='instructor_approval'),
    path('api/course-approvals/', views.PendingCourseListView.as_view(), name='pending_courses_list'),
    path('api/course-approvals/<int:id>/', views.CourseApprovalView.as_view(), name='course_approval'),
    path('api/courses/<int:course_id>/enroll/', views.StudentEnrollView.as_view(), name='student_enroll'),
    path('api/messages/<int:user_id>/', views.MessageView.as_view(), name='message_list'),
    path('api/active-conversations/', views.ActiveConversationsView.as_view(), name='active_conversations'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
