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

    redirect_url = "http://localhost:8000/student/code"
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

@api.get("/active_office_hour_session")
def active_office_hour_session(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        professor = Professor.objects.get(user=user)
        session = OfficeHourSession.objects.filter(professor=professor, is_active=True).first()
        if session:
            return JsonResponse({
                'session_id': session.id,
                'start_time': session.start_time.isoformat(),
                'end_time': session.end_time.isoformat() if session.end_time else None,
                'is_active': session.is_active,
                'questions': session.questions.split(',')
            })
    except Professor.DoesNotExist:
        return JsonResponse({'error': 'User is not a professor'}, status=403)


from .models import User, Professor, Student, OfficeHourSession, Waitlist

@api.post("/join_waitlist")
def join_waitlist(request, session_code: str):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)
    
    try:
        session = OfficeHourSession.objects.get(id=session_code.upper())
        # Check if the student is already on the waitlist
        if Waitlist.objects.filter(session=session, student=user.student).exists():
            return JsonResponse({'error': 'Already on the waitlist'}, status=400)

        Waitlist.objects.create(student=user.student, session=session)
        # Here you would also send a WebSocket message to update all clients
        return JsonResponse({'message': 'Added to waitlist', 'session_id': session.id}, status=200)
    except OfficeHourSession.DoesNotExist:
        return JsonResponse({'error': 'Invalid session code'}, status=404)
    
@api.post("/invite_student")
def invite_student(request):
    user = request.user
    if not user.is_authenticated or not hasattr(user, 'professor'):
        return JsonResponse({'error': 'Unauthorized access'}, status=403)

    try:
        session = OfficeHourSession.objects.filter(professor=user.professor, is_active=True).first()
        if not session:
            return JsonResponse({'error': 'No active session found'}, status=404)

        waitlist = Waitlist.objects.filter(session=session).order_by('joined_at')
        if waitlist.exists():
            first_student = waitlist.first()
            waitlist.delete()  # Remove the student from the waitlist
            # Logic to notify the student can be added here

            return JsonResponse({'message': f'Student {first_student.student.user.name} invited', 'student': first_student.student.user.name}, status=200)
        else:
            return JsonResponse({'error': 'Waitlist is empty'}, status=404)
    except Professor.DoesNotExist:
        return JsonResponse({'error': 'Professor not found'}, status=404)

