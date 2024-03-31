from ninja import NinjaAPI
from django.http import HttpResponse, JsonResponse
from .models import User, Professor, Student, OfficeHourSession
import json


api = NinjaAPI()

@api.get("/hello")
def hello(request, name="world"):
    return f"Hello {name}"


@api.get("/user")
def get_user_by_name(request, name: str):
    try:
        user = User.objects.get(username=name)
        # If you have a serializer for the User model, you can use it here
        return HttpResponse(user.name, status=200)
    except User.DoesNotExist:
        return HttpResponse("User not found", status=404)
    

@api.post("/officehours")
def join_office_hours(request):
    try:
        code = request.GET.get('code', '')
        session = OfficeHourSession.objects.get(id=code.upper())
        response = JsonResponse({"questions": session.questions}, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Content-Type"] = "application/json"
        return response
    except OfficeHourSession.DoesNotExist:
        return JsonResponse({"error": "Invalid code"}, status=404)
    
