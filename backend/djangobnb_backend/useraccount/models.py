import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser,PermissionsMixin,UserManager
from django.db import models

# Create your models here.
class CustomUserManager(UserManager):
    def _create_user(self,name, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, username=None, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        if extra_fields.get('is_staff') is not False:
            raise ValueError('User must have is_staff=False.')
        if extra_fields.get('is_superuser') is not False:
            raise ValueError('User must have is_superuser=False.')

        if not username:
            username = email or ''
        if not name:
            name = username or email or ''
        extra_fields.setdefault('username', username)

        return self._create_user(name, email, password, **extra_fields)
    
    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        username = extra_fields.get('username') or email or ''
        if not name:
            name = username or email or ''
        extra_fields.setdefault('username', username)

        return self._create_user(name, email, password, **extra_fields)
    

class User(AbstractUser,PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='uploads/avatars/', blank=True, null=True)
     
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def avatar_url(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            if self.avatar.url.startswith('http'):
                return self.avatar.url
            url = self.avatar.url
            if not url.startswith('/'):
                url = '/' + url
            return f"{settings.WEBSITE_URL}{url}"
        return None

    def __str__(self):
        return self.email

