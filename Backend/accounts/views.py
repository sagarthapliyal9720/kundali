from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': "User created successfully", 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):

            refresh = RefreshToken.for_user(user)

            return Response({
                'message': "User logged in successfully",
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'name': user.name,
                    'email': user.email,
                    'phone': user.phone
                }
            })

        return Response(
            {'message': "Invalid credentials!"},
            status=status.HTTP_401_UNAUTHORIZED
        )