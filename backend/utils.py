from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
SECRET_KEY = os.getenv("SECRET_KEY")
from passlib.context import CryptContext

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def generate_confirmation_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_confirmation_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"] 
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Le lien de confirmation a expiré.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Le lien de confirmation est invalide.")