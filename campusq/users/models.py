from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
import random
import string


def generate_unique_code(num_chars=4):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=num_chars))
        while OfficeHourSession.objects.filter(id=code).exists():
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return code


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
    canvas_id = models.CharField(max_length=100, null=True, blank=True)

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
    waitlist = models.ForeignKey('Waitlist', on_delete=models.CASCADE, null=True, blank=True)
    position = models.IntegerField(null=True, blank=True)
    joined_at = models.DateTimeField(null=True, blank=True)
    
    

    def __str__(self):
        return self.user.name


# work in progress below
class OfficeHourSession(models.Model):
    professor = models.OneToOneField(Professor, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    questions = models.CharField(null=True, blank=True, max_length=1000)
    id = models.CharField(primary_key=True, max_length=4, unique=True)

    def get_waitlist(self):
        return Waitlist.objects.filter(session=self).select_related('student')

    
    def update_waitlist_positions(self):
        waitlist_entries = Waitlist.objects.filter(session=self).order_by('joined_at')
        for index, entry in enumerate(waitlist_entries, start=1):
            entry.position = index
            entry.save()

    def set_questions(self, data):
        self.questions = ','.join(data)
    def get_questions(self):
        return self.questions.split(',')
    
    def __str__(self):
        return f"{self.professor.user.username}'s Office Hours"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.id:
            self.id = generate_unique_code()

class Waitlist(models.Model):
    
    session = models.ForeignKey('OfficeHourSession', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    professor = models.ForeignKey('Professor', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.session.professor.user.name}'s Office Hours session"


class SessionToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_token = models.CharField(primary_key=True, max_length=32, unique=True)
    access_token = models.CharField(max_length=100, null=True, blank=True, unique=True)
    refresh_token = models.CharField(max_length=100, null=True, blank=True, unique=True)
    


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.session_token:
            self.session_token = generate_unique_code(32)


class SessionQuestion(models.Model):
    session = models.ForeignKey('OfficeHourSession', on_delete=models.CASCADE)
    question = models.CharField(max_length=1000)
    professor = models.ForeignKey('Professor', on_delete=models.CASCADE, null=True, blank=True)
    waitlist = models.ForeignKey('Waitlist', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)  

    

    def __str__(self):
        return f"{self.question}"
    

class SessionResponse(models.Model):
    question = models.ForeignKey('SessionQuestion', on_delete=models.CASCADE)
    response = models.CharField(max_length=1000)
    answered_at = models.DateTimeField(auto_now_add=True)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True) 

    def __str__(self):
        return f"Response to {self.question} by {self.student.user.name}"