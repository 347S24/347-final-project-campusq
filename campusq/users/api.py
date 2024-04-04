from ninja import NinjaAPI
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import User, Professor, Student, OfficeHourSession
import json
import requests


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
        response = JsonResponse({"questions": session.questions,
                                 "instructor": session.professor.user.name}, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Content-Type"] = "application/json"
        return response
    except OfficeHourSession.DoesNotExist:
        return JsonResponse({"error": "Invalid code"}, status=404)
    
@api.get("/accounts/canvas/login/callback/")
def canvas_login_callback(request):
    code = request.GET.get('code', None)


    absolute_uri = request.build_absolute_uri()
    get_token_url = "https://canvas.jmu.edu/login/oauth2/token?grant_type=authorization_code&client_id=190000000000938&client_secret=DUyraGNa3kmVHMK54NH1D4po5CF7XXSeyHeCE4ebaHTgeTCEnl0QTixPL569NUe9&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&code=" + code
    response = requests.post(get_token_url)
    data = response.json()
    access_token = data.get('access_token', None)

    redirect_url = "http://localhost:5173/student/code"
    redirect_response = HttpResponseRedirect(redirect_url)
    redirect_response.set_cookie('access_token', access_token)
    return redirect_response



    return HttpResponse(response.text, status=200)

# @api.get("/student/info")
# def get_student_info(request):
#     access_token = request.headers.get('access-token', None)
#     if access_token is None:
#         return JsonResponse({"error": "No access token provided"}, status=400)
    
    
#     print("Access token:", access_token)
#     headers = {
#     "Authorization": f"Bearer {access_token}",
#     "Content-Type": "plain/text",
#     "Access-Control-Allow-Origin": "*"
#     }
#     response = requests.get("https://canvas.jmu.edu/api/v1/users/self", headers=headers)
#     data = response.json()
#     print("data: " + data)
#     return JsonResponse(data, status=200)



@api.get("/student/info")
def get_student_info(request, access_token="error"):

    print("Access token:", access_token)
    

    if access_token == "error":
        return JsonResponse({"error": "No access token provided"}, status=400)
    
    
    
    headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "plain/text",
    "Access-Control-Allow-Origin": "*"
    }

    apiResponse = requests.get("https://canvas.jmu.edu/api/v1/users/self/profile", headers=headers)
    data = apiResponse.json()
    login_id = data.get('login_id', None)
    response = JsonResponse({'login_id': login_id}, status=200)
    response["Access-Control-Allow-Origin"] = "*"
    response["Content-Type"] = "application/json"
    print(data)
    

    
    return response

