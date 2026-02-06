from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    role = models.CharField(max_length=30)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    instructor_pending = models.BooleanField(default=False)

class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    price = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)

    demo_video = models.FileField(upload_to='course_demo_videos/', null=True, blank=True)
    demo_img1 = models.ImageField(upload_to='course_demo_images/', null=True, blank=True)
    demo_img2 = models.ImageField(upload_to='course_demo_images/', null=True, blank=True)
    demo_img3 = models.ImageField(upload_to='course_demo_images/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Slide(models.Model):
    SLIDE_TYPES = [
        ("theory", "Theory"),
        ("project", "Project"),
        ("quiz", "Quiz"),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='slides')
    page = models.PositiveIntegerField()
    type = models.CharField(max_length=30, choices=SLIDE_TYPES)
    title = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('course', 'page')
        ordering = ['page']

    def __str__(self):
        return f"{self.course.title} - {self.title} ({self.type})"


class Block(models.Model):
    BLOCK_TYPES = [
        ("heading", "Heading"),
        ("description", "Description"),
        ("image", "Image"),
        ("file", "File"),
        ("quiz-question", "Quiz Question"),
    ]

    slide = models.ForeignKey(Slide, on_delete=models.CASCADE, related_name='blocks')
    block_type = models.CharField(max_length=30, choices=BLOCK_TYPES)
    order = models.PositiveIntegerField(default=0)
    value = models.TextField(blank=True, null=True)

    file = models.FileField(upload_to='blocks/files/', null=True, blank=True)
    image = models.ImageField(upload_to='blocks/images/', null=True, blank=True)
    quiz_data = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.slide.title} - {self.block_type} (#{self.order})"