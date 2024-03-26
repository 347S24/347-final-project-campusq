from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView
from django.views.generic import RedirectView
from django.views.generic import UpdateView

from campusq.users.models import User


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self):
        # for mypy to know that the user is authenticated
        assert self.request.user.is_authenticated
        return self.request.user.get_absolute_url()

    def get_object(self):
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import OfficeHourSession, Professor
from django.contrib import messages

@login_required
def start_office_hours(request):
    try:
        # Attempt to get the professor instance for the logged-in user
        professor = Professor.objects.get(user=request.user)
    except Professor.DoesNotExist:
        # If the user is not a professor, add a message and redirect
        messages.error(request, "You are not authorized to start office hours.")
        return redirect('home')

    # Check if there's an already active session for this professor
    active_session = OfficeHourSession.objects.filter(professor=professor, is_active=True).exists()
    if not active_session:
        # If no active session, create a new office hours session
        OfficeHourSession.objects.create(professor=professor)
        messages.success(request, "Office hours started successfully.")
        return redirect('waiting_list')
    else:
        # If an active session exists, inform the user
        messages.info(request, "You already have an active office hours session.")
        return redirect('home')