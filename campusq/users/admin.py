from django.conf import settings
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext_lazy as _

from .forms import UserAdminChangeForm
from .forms import UserAdminCreationForm
from .models import User, Professor, Student, OfficeHourSession, Waitlist, SessionToken, SessionQuestion, SessionResponse

if settings.DJANGO_ADMIN_FORCE_ALLAUTH:
    # Force the `admin` sign in process to go through the `django-allauth` workflow:
    # https://docs.allauth.org/en/latest/common/admin.html#admin
    admin.site.login = login_required(admin.site.login)  # type: ignore[method-assign]


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    list_display = ["username", "name", "is_superuser"]
    search_fields = ["name"]

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ['user', 'department', 'title', 'office', 'phone', 'email', 'office_hours']
    search_fields = ['user__name', 'department', 'title', 'office', 'phone', 'email']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'major', 'year']
    search_fields = ['user__name', 'major', 'year']

@admin.register(OfficeHourSession)
class OfficeHourSessionAdmin(admin.ModelAdmin):
    list_display = ['professor', 'start_time', 'end_time', 'is_active']
    list_filter = ['is_active']
    search_fields = ['professor__user__name']
    readonly_fields = ['id']
    
@admin.register(Waitlist)
class WaitlistAdmin(admin.ModelAdmin):
    list_display = ['student', 'session', 'joined_at']
    search_fields = ['student__user__name', 'session__id']
    readonly_fields = ['joined_at']

@admin.register(SessionToken)
class SessionTokenAdmin(admin.ModelAdmin):
    list_display = ['access_token', 'session_token', 'user']
    search_fields = ['access_token', 'refresh_token']


@admin.register(SessionQuestion)
class SessionQuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'session']
    search_fields = ['session__id', 'question']
    
