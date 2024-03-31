from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
import random
import string


class User(AbstractUser):
    """
    Default custom user model for Ultimate campusq.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})
    
class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    office = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    office_hours = models.CharField(max_length=100)
    def __str__(self):
        return self.user.name
    
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    major = models.CharField(max_length=100)
    year = models.CharField(max_length=100)
    def __str__(self):
        return self.user.name

class OfficeHourSession(models.Model):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    questions = models.CharField(null=True, blank=True, max_length=1000)
    id = models.CharField(primary_key=True, max_length=4, unique=True)

    def generate_unique_code():
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        while OfficeHourSession.objects.filter(id=code).exists():
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return code

    def set_questions(self, data):
        self.questions = ','.join(data)
    def get_questions(self):
        return self.questions.split(',')
    
    def __str__(self):
        return f"{self.professor.user.username}'s Office Hours"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.id:
            self.id = self.generate_unique_code()
    
    def generate_unique_code(self):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        while OfficeHourSession.objects.filter(id=code).exists():
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return code
