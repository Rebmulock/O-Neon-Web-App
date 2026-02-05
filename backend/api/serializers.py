from .models import User, Block, Slide, Course
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction

import re

def validate_username(username):
    username = username.strip()
    if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
        raise serializers.ValidationError({'username': 'Username contains invalid characters.'})

    return username

def create_slides_and_blocks(course=None, slides_data=None, files_map=None):
    for slide in slides_data:
        blocks = slide.pop("blocks", [])
        slide_instance = Slide.objects.create(course=course, **slide)

        for block in blocks:
            block_type = block.get("block_type")
            order = block.get("order")
            value = block.get("value")
            quiz_data = block.get("quiz_data")

            if block_type == "heading" or block_type == "description":
                if not value:
                    raise serializers.ValidationError(f"Field {block_type} cannot be empty!")

                Block.objects.create(
                    slide=slide_instance,
                    block_type=block_type,
                    order=order,
                    value=value,
                    )

            if block_type == "quiz-question":
                if not quiz_data:
                    raise serializers.ValidationError("Quiz cannot be empty!.")

                Block.objects.create(
                    slide=slide_instance,
                    block_type=block_type,
                    order=order,
                    quiz_data=quiz_data,
                )

            if block_type in ["file", "image"]:
                if value:
                    file_or_image = files_map.get(f"file_{value}")

                    if file_or_image is None or file_or_image == "":
                        raise serializers.ValidationError(f"Missing {block_type} for block with order {order}; "
                                                          f"Provided file: {file_or_image}; "
                                                          f"Files map: {files_map}; "
                                                          f"Value: {value}")

                    Block.objects.create(
                        slide=slide_instance,
                        block_type=block_type,
                        order=order,
                        file=file_or_image if block_type == "file" else None,
                        image=file_or_image if block_type == "image" else None,
                    )

                elif block.get("image"):
                    Block.objects.create(
                        slide=slide_instance,
                        block_type=block_type,
                        order=order,
                        image=block.get("image"),
                    )

                else:
                    raise serializers.ValidationError(f"Missing {block_type} ID in field 'value' for block with order {order}")


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    is_instructor = serializers.BooleanField(write_only=True, required=False, default=False)
    profile_pic = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'email', 'username', 'password',
                  'confirm_password','date_joined', 'role',
                  'is_instructor', 'profile_pic']
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
    profile_pic = serializers.ImageField(required=False, default=None)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password', 'profile_pic']
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
    file_id = serializers.CharField(required=False, allow_null=True)
    image_id = serializers.CharField(required=False, allow_null=True)
    file = serializers.FileField(required=False, allow_null=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Block
        fields = ['id', 'block_type', 'order', 'value', 'file_id', 'image_id', 'file', 'image', 'quiz_data']
        extra_kwargs = {
            'id': {'read_only': True},
            'file_id': {'write_only': True},
            'image_id': {'write_only': True},
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

        elif block_type == 'image' and not data.get('image_id'):
            raise serializers.ValidationError("image_id is required for image blocks.")

        elif block_type == 'file' and not data.get('file_id'):
            raise serializers.ValidationError("file_id is required for file blocks.")

        return data


class SlideSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, read_only=True)

    class Meta:
        model = Slide
        fields = ['id', 'page', 'type', 'title', 'blocks']
        extra_kwargs = {
            'id': {'read_only': True},
            'page': {'read_only': True},
            'type': {'read_only': True},
            'title': {'read_only': True},
        }


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
        files_map = self.context.get('files_map', {})

        with transaction.atomic():
            course = Course.objects.create(**validated_data)
            create_slides_and_blocks(course=course, slides_data=slides_data, files_map=files_map)

        return course

    def update(self, instance, validated_data):
        slides_data = validated_data.pop("slides", [])
        files_map = self.context.get('files_map', {})

        with transaction.atomic():
            instance.slides.all().delete()

            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            create_slides_and_blocks(course=instance, slides_data=slides_data, files_map=files_map)

        return instance


class CourseDetailSerializer(CourseSerializer):
    slides = SlideSerializer(many=True, read_only=True)