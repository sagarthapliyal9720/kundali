from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User=get_user_model()

class RegisterSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['username','email','password','phone']
        read_only_fields=['username']
    def create(self, validated_data):
        
        password=validated_data['password']
        email=validated_data['email']
        phone=validated_data['phone']
        user=User.objects.create_user(
            username=email,
            password=password,
            email=email,
            phone=phone
        )
        return user