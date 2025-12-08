from .models import User
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager
from rest_framework import serializers

import re

def validate_username(username):
    username = username.strip()
    if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
        raise serializers.ValidationError({'username': 'Username contains invalid characters.'})

    return username


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)


    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password','confirm_password','date_joined', 'role']
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

        validated_data['role'] = 'student'
        validated_data['date_joined'] = datetime.now()
        validated_data['email'] = BaseUserManager.normalize_email(validated_data['email'])
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['username'] = validate_username(validated_data['username'])

        user = User.objects.create(**validated_data)

        return user


class SuperUserSerializer(UserSerializer):
    def create(self, validated_data):
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