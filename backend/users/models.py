from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self,name,email,phone,password=None):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        email = email.lower()


        user = self.model(
            name = name,
            phone = phone,
            email=email,
            password = password

        )

        # if not password == confirm_password:
        #     raise ValueError("Both passwords must be same")
        
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, name,email,phone,password=None):
        
        user = self.create_user(
            name,
            email,
            phone,
            password,
        )
        user.is_admin = True
        user.is_instructor = True
        # user.is_staff  = True
        # user.is_superuser = True
        user.save(using=self._db)
        return user
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(verbose_name="Name",max_length=255,blank=False)
    email = models.EmailField(verbose_name="Email Address", max_length=255, unique=True,)
    phone = models.CharField(verbose_name="Phone",max_length=255,unique=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_instructor = models.BooleanField(default=False)

    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name","phone"]

    def __str__(self):
        return self.name
    
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
    
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, if user is an admin
        return self.is_admin

    def has_module_perms(self, app_label):
        """
        Does the user have permissions to view the app `app_label`?
        """
        return True
    
class ForgotPassword(models.Model):
    user = models.ForeignKey(CustomUser, on_delete= models.CASCADE)
    token = models.CharField(max_length=255,unique=True, null=True, blank=True)