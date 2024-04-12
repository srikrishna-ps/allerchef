import AuthModal from "./Auth";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const navigate = useNavigate();
    return <AuthModal open={true} onClose={() => navigate("/")} />;
};

export default AuthPage; 