from ninja import NinjaAPI
from .models import User, Professor, Student, OfficeHourSession


api = NinjaAPI()

@api.get("/hello")
def hello(request, name="world"):
    return f"Hello {name}"


@api.get("/user")
def get_user_by_name(request, name: str):
    try:
        user = User.objects.get(username=name)
        # If you have a serializer for the User model, you can use it here
        return user.name
    except User.DoesNotExist:
        return f"User with name '{name}' does not exist", 404
