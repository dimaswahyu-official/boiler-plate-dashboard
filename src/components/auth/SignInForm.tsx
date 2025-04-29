import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import SignInInput from "../form/input/SignInInput";
import Button from "../ui/button/Button";
import { loginService } from "../../API/services/AuthService";
import CustomToast, {
  showErrorToast,
  showSuccessToast,
} from "../../components/toast";
import { useMenuStore } from "../../API/store/menuStore";

interface SignInFormValues {
  email: string;
  password: string;
  ip_address: string;
  device_info: string;
}

export default function SignInForm() {
  const navigate = useNavigate();
  const { fetchMenus } = useMenuStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP address:", err);
      }
    }
    fetchIP();
  }, []);

  const handleLogin = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);
    const deviceInfo = navigator.userAgent;

    try {
      const response = await loginService({
        ...data,
        ip_address: ipAddress,
        device_info: deviceInfo,
      });

      if (!response.data.accessToken) {
        showErrorToast("Login gagal!");
        return;
      } else {
        const userData = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user,
          menus: response.data.menus,
        };
        
        localStorage.setItem("user_login_data", JSON.stringify(userData));
        localStorage.setItem("token", response.data.accessToken);
        fetchMenus();
        showSuccessToast("Login berhasil!");
        setTimeout(() => {
          navigate("/master_menu");
        }, 2000);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Login gagal!");
      showErrorToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <CustomToast />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <SignInInput
                    placeholder="Enter your email"
                    register={register("email", {
                      required: "Email is required",
                    })}
                    error={!!errors.email}
                    hint={errors.email?.message}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <SignInInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      register={register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      error={!!errors.password}
                      hint={errors.password?.message}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
                <div>
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
