from .models import User, Block, Slide, Course
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

import re

def validate_username(username):
    username = username.strip()
    if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
        raise serializers.ValidationError({'username': 'Username contains invalid characters.'})

    return username

def create_slide_with_blocks(course=None, slide_data=None, slide_instance=None):
    blocks_data = slide_data.pop("blocks", [])

    slide_instance = None
    slide_id = slide_data.get("id")
    page = slide_data.get("page")

    if slide_id:
        slide_instance = Slide.objects.filter(id=slide_id).first()
    elif page is not None and course:
        slide_instance = Slide.objects.filter(course=course, page=page).first()

    if slide_instance:
        slide_instance.page = slide_data.get("page", slide_instance.page)
        slide_instance.type = slide_data.get("type", slide_instance.type)
        slide_instance.title = slide_data.get("title", slide_instance.title)
        slide_instance.save()

        slide_instance.blocks.all().delete()
    else:
        slide_instance = Slide.objects.create(course=course, **slide_data)

    for block_data in blocks_data:
        Block.objects.create(slide=slide_instance, **block_data)

    return slide_instance

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    is_instructor = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'email', 'username', 'password',
                  'confirm_password','date_joined', 'role',
                  'is_instructor']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'username': {'required': True},
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
            'role': {'read_only': True},
        }


    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})

        email = data['email']
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'This email is already taken.'})

        username = data['username']
        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'This username is already taken.'})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        if validated_data['is_instructor']:
            validated_data['role'] = 'instructor'
        else:
            validated_data['role'] = 'student'

        validated_data.pop('is_instructor', 0)
        validated_data['date_joined'] = datetime.now()
        validated_data['email'] = BaseUserManager.normalize_email(validated_data['email'])
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['username'] = validate_username(validated_data['username'])

        user = User.objects.create(**validated_data)

        return user


class SuperUserSerializer(UserSerializer):
    admin_token = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        validated_data.pop('admin_token')
        validated_data.pop("confirm_password")

        validated_data["role"] = "admin"
        validated_data["date_joined"] = datetime.now()
        validated_data["email"] = BaseUserManager.normalize_email(validated_data["email"])
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validate_username(validated_data["username"])

        user = User.objects.create(**validated_data)

        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password']
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, data):
        user = self.instance
        email = data.get('email')
        username = data.get('username')

        if data.get('password') and data.get('confirm_password'):
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError({'password': 'Passwords do not match.'})

        if email and User.objects.filter(email=email).exclude(pk=user.pk).exists():
            raise serializers.ValidationError({'email': 'This email is already taken.'})

        if username and User.objects.filter(username=username).exclude(pk=user.pk).exists():
            raise serializers.ValidationError({'username': 'This username is already taken.'})

        return data

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        validated_data.pop("confirm_password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.password = make_password(password)

        instance.save()
        return instance


class UserLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['role'] = self.user.role
        return data


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['id', 'block_type', 'order', 'value', 'file', 'image', 'quiz_data']
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def validate(self, data):
        block_type = data.get('block_type')

        if block_type == 'quiz-question':
            quiz_data = data.get('quiz_data')

            if not quiz_data:
                raise serializers.ValidationError("quiz_data is required for quiz-question blocks.")

            if not all(k in quiz_data for k in ['question', 'answers', 'correctIndex']):
                raise serializers.ValidationError("quiz_data must contain 'question', 'answers', and 'correctIndex'.")

            if not isinstance(quiz_data['answers'], list) or len(quiz_data['answers']) != 4:
                raise serializers.ValidationError("'answers' must be a list of 4 elements.")

            if not isinstance(quiz_data['correctIndex'], int) or not (0 <= quiz_data['correctIndex'] <= 3):
                raise serializers.ValidationError("'correctIndex' must be an integer between 0 and 3.")

        elif block_type in ['heading', 'description']:
            if not data.get('value'):
                raise serializers.ValidationError(f"value is required for {block_type} blocks.")

        elif block_type == 'image':
            if not data.get('image') and not data.get('file'):
                raise serializers.ValidationError("image or file is required for image blocks.")

        elif block_type == 'file':
            if not data.get('file'):
                raise serializers.ValidationError("file is required for file blocks.")

        return data


class SlideSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True)

    class Meta:
        model = Slide
        fields = ['id', 'page', 'type', 'title', 'blocks']
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def create(self, validated_data):
        return create_slide_with_blocks(slide_data=validated_data)

    def update(self, instance, validated_data):
        return create_slide_with_blocks(slide_instance=instance, slide_data=validated_data)


class CourseSerializer(serializers.ModelSerializer):
    slides = serializers.JSONField(write_only=True)
    demo_video = serializers.FileField(required=False, allow_null=True)
    demo_img1 = serializers.ImageField(required=False, allow_null=True)
    demo_img2 = serializers.ImageField(required=False, allow_null=True)
    demo_img3 = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'price',
                  'demo_video', 'demo_img1', 'demo_img2', 'demo_img3',
                  'slides', 'created_at', 'updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'instructor': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def create(self, validated_data):
        slides_data = validated_data.pop("slides", [])
        course = Course.objects.create(**validated_data)

        for slide_data in slides_data:
            create_slide_with_blocks(course=course, slide_data=slide_data)

        return course

    def update(self, instance, validated_data):
        slides_data = validated_data.pop("slides", [])

        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.price = validated_data.get("price", instance.price)
        instance.demo_video = validated_data.get("demo_video", instance.demo_video)
        instance.demo_img1 = validated_data.get("demo_img1", instance.demo_img1)
        instance.demo_img2 = validated_data.get("demo_img2", instance.demo_img2)
        instance.demo_img3 = validated_data.get("demo_img3", instance.demo_img3)
        instance.save()

        for slide_data in slides_data:
            create_slide_with_blocks(course=instance, slide_data=slide_data)

        return instance


class CourseDetailSerializer(CourseSerializer):
    slides = SlideSerializer(many=True, read_only=True)