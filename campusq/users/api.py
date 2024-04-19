from ninja import NinjaAPI, Cookie
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import User, Professor, Student, OfficeHourSession, SessionToken, Waitlist, SessionQuestion, SessionResponse
import json
import requests
from collections import OrderedDict

##IMPORTANT: these routes have no prefix in the main urls file, so if you want 
##your route at /api/myroute, you have to declare it as such,
##not just as /myroute

##this is to account for the /account/canvas/login/callback route
##that we are forced to use


api = NinjaAPI()

@api.get("/hello")
def hello(request, name="world"):
    return f"Hello {name}"


@api.get("/user")
def get_user_by_name(request, name: str):
    try:
        user = User.objects.get(username=name)
        return HttpResponse(user.name, status=200)
    except User.DoesNotExist:
        return HttpResponse("User not found", status=404)
    

@api.post("/api/leave_waitlist")
def leave_waitlist(request):
    canvas_id = request.COOKIES.get('canvas_id', None)
    student = Student.objects.get(user=User.objects.get(canvas_id=canvas_id))
    print("stydent:", student)
    print("stydent waitlist before:", student.waitlist)

    student.waitlist = None
    
    student.save()
    print("student:", student.waitlist)
    
    return JsonResponse({"message": "Left waitlist"}, headers={"Access-Control-Allow-Origin": "http://localhost:8500"}, status=200)
    
@api.get("/api/officehoursession")
def get_office_hour_session(request, code="none"):
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:8500",
    }
    print("tttttt")
    code = request.GET.get('code', '')
    print("code:", code)
    try:
        session = OfficeHourSession.objects.get(id=code.upper())
        waitlist = Waitlist.objects.get(session=session)
        
        questions = SessionQuestion.objects.filter(session=session).order_by('created_at')
        students = Student.objects.filter(waitlist=waitlist).order_by('position')
        studentsDict = OrderedDict()
        for student in students:
            responses = SessionResponse.objects.filter(student=student)
            answer = []
            for response in responses:
                answer.append(response.response)
            studentsDict[student.user.name] = answer
            
        serlializedStudents = students_list = [{"student_name": student_name, "responses": responses} for student_name, responses in studentsDict.items()]
        response = JsonResponse({
            "questions": [q.question for q in questions],
            "answers": studentsDict
            }, status=200, headers=headers)
        return response
    except OfficeHourSession.DoesNotExist:
        return JsonResponse({"error": "Invalid code"}, status=404, headers=headers)
    

@api.get("/api/officehoursquestions")
def join_office_hours(request):
    try:
        code = request.GET.get('code', '')
        session = OfficeHourSession.objects.get(id=code.upper())
        
        questions = SessionQuestion.objects.filter(session=session).order_by('created_at')
        response = JsonResponse({"questions": [q.question for q in questions]}, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Content-Type"] = "application/json"
        return response
    except OfficeHourSession.DoesNotExist:
        return JsonResponse({"error": "Invalid code"}, status=404)
    

@api.post("/api/officehoursquestions/submit")
def submit_question(request):
    canvas_id = request.COOKIES.get('canvas_id', None)
    data = json.loads(request.body.decode('utf-8'))

    responseHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:8500",
    }
    

    
    answers = data.get('answers')
    code = data.get('code')
    officehours = OfficeHourSession.objects.get(id=code.upper())
    officeHourQuestions = SessionQuestion.objects.filter(session=officehours)
    student = Student.objects.get(user=User.objects.get(canvas_id=canvas_id))
    waitlist = Waitlist.objects.get(session=officehours)
    print("waitlist:", waitlist)
    if student.waitlist != waitlist:
        if SessionResponse.objects.filter(student=student).exists():
            SessionResponse.objects.filter(student=student).delete()
        for i in range(len(officeHourQuestions)):
            SessionResponse.objects.create(question=officeHourQuestions[i], response=answers[i], student=Student.objects.get(user=User.objects.get(canvas_id=canvas_id)))
        student.waitlist = waitlist
        numStudentsInWaitlist = len(Student.objects.filter(waitlist=waitlist))
        student.position = numStudentsInWaitlist+1

        

        
        student.save()
        print("office hour questions:", officeHourQuestions)
        reponse = JsonResponse({"message": "Question submitted",
                                "position": f"{student.position}",
                                "totalInQ": f"{numStudentsInWaitlist+1}"}, status=200, headers=responseHeaders)
    else:
        print("studentttttt:", student.waitlist)
        print(student.user.username)
        reponse = JsonResponse({"message": "student already in waitlist"}, status=400, headers=responseHeaders)
    print("responselul:", reponse)
    return reponse



    
@api.get("/accounts/canvas/login/callback/")
def canvas_login_callback(request):
    code = request.GET.get('code', None)
    print("cookies???:", request.COOKIES)
    print("request url:", request.build_absolute_uri())


    absolute_uri = request.build_absolute_uri()
    get_token_url = "https://canvas.jmu.edu/login/oauth2/token?grant_type=authorization_code&client_id=190000000000938&client_secret=DUyraGNa3kmVHMK54NH1D4po5CF7XXSeyHeCE4ebaHTgeTCEnl0QTixPL569NUe9&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&code=" + code
    response = requests.post(get_token_url)
    data = response.json()
    print("data:", data)
    access_token = data.get('access_token', None)
    refresh_token = data.get('refresh_token', None)
    canvas_id = data['user']['id']
    user = None
    userNameResponse= None
    
    if(User.objects.filter(canvas_id=canvas_id).exists()):
        print("logged in returning user")
        user = User.objects.get(canvas_id=canvas_id)
        usernameResponse = User.username
    else:
        headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "plain/text",
        "Access-Control-Allow-Origin": "*"
        }   
        newUserResponse = requests.get("https://canvas.jmu.edu/api/v1/users/self/profile", headers=headers)
        newUserData = newUserResponse.json()
        print("new user thing data:", newUserData)
        login_id = newUserData.get('login_id', None)
        print("login id::::", login_id)

        print("created and logged in new user")
        
        

        
        user = User.objects.create(canvas_id=canvas_id, name=newUserData.get('name', None), username=login_id)
        
        Student.objects.create(user=user)


        
    print("Canvas ID:", canvas_id)
    print("Access token:", access_token)
    print("Refresh token:", refresh_token)
    session_token = data.get('session_token', None)
    
    if session_token == None:
        print("created new session token")
        session_token_object = SessionToken.objects.create(user=user, access_token=access_token, refresh_token=refresh_token)
        session_token = session_token_object.session_token


    

    redirect_url = f"http://localhost:8500/student/code"
    redirect_response = HttpResponseRedirect(redirect_url)
    
    redirect_response.set_cookie('session_token', session_token, samesite="Lax", domain="localhost", path="/")
    redirect_response.set_cookie('canvas_id', canvas_id, samesite="Lax", domain="localhost", path="/")

    print("Response Headers:")
    for h, value in redirect_response.items():
        print(f"{h}: {value}")
    
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



@api.get("/api/student/info")
def get_student_info(request):
    print("request:", request)
    print("cookies lol:", request.COOKIES)

    session_token = request.COOKIES.get('session_token', None)
    
    
    

    if session_token == None:
        print("No cookies")
        return JsonResponse({"error": "No access token provided"}, status=400)
    
    session_token_object = SessionToken.objects.get(session_token=session_token)
    access_token = session_token_object.access_token
    
    headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "plain/text",
    "Access-Control-Allow-Origin": "*"
    }

    apiResponse = requests.get("https://canvas.jmu.edu/api/v1/users/self/profile", headers=headers)
    # refresh token flow details: https://canvas.instructure.com/doc/api/file.oauth.html#using-refresh-tokens
    if apiResponse.status_code != 200:
        refreshResponse = requests.post("https://canvas.jmu.edu/login/oauth2/token?grant_type=refresh_token&client_id=190000000000938&client_secret=DUyraGNa3kmVHMK54NH1D4po5CF7XXSeyHeCE4ebaHTgeTCEnl0QTixPL569NUe9&refresh_token=" + session_token_object.refresh_token)
        
        data = refreshResponse.json()
        access_token = data.get('access_token', None)
        session_token_object.access_token = access_token
        session_token_object.save()
        headers["Authorization"] = f"Bearer {access_token}"
        print("refreshed token")
        apiResponse = requests.get("https://canvas.jmu.edu/api/v1/users/self/profile", headers=headers)


        
    
    
    data = apiResponse.json()
    login_id = data.get('login_id', None)

    response = JsonResponse({'login_id': login_id}, status=200)
    response["Content-Type"] = "application/json"
    response["Access-Control-Allow-Origin"] = "http://localhost:8500"
    
    

    
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


@api.get("/waitcode")
def show_waitlist(request, waitcode="none"):
    members = OfficeHourSession.objects.get(id=waitcode.upper()).get_waitlist()
    

    return JsonResponse({"message": "Waitlist page"})

