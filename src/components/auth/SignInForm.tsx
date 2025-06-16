import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import SignInInput from "../form/input/SignInInput";
import Button from "../ui/button/Button";
import CustomToast, { showSuccessToast } from "../../components/toast";
import { useMenuStore } from "../../API/store/MasterStore/masterMenuStore";
import { useAuthStore } from "../../API/store/AuthStore/authStore";

interface SignInFormValues {
  employee_id: string;
  password: string;
  ip_address: string;
  device_info: string;
  platform: string;
}

export default function SignInForm() {
  const navigate = useNavigate();
  const { authLogin } = useAuthStore();
  const { fetchMenus } = useMenuStore();

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP address:", err);
      }
    };
    fetchIP();
  }, []);

  const handleLogin = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // await authLogin({
      //   ...data,
      //   ip_address: ipAddress,
      //   device_info: navigator.userAgent,
      //   platform: "web",
      // });
      //
      // const { accessToken, refreshToken, user, menus, permissions } =
      //   useAuthStore.getState();
      //
      // if (!accessToken) {
      //   throw new Error("Login failed!");
      // }
      //
      // fetchMenus();
      // localStorage.setItem(
      //   "user_login_data",
      //   JSON.stringify({ accessToken, refreshToken, user, menus, permissions })
      // );
      // localStorage.setItem("token", accessToken);
      // localStorage.setItem("role_id", user?.role_id.toString() || "");
      //
      // showSuccessToast("Login successful!");
      //
      localStorage.setItem("token", "asdasdasd11");
      localStorage.setItem("role_id", "1");
      setTimeout(() => {
        navigate("/master_menu");
      }, 800);
    } catch (err:any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <CustomToast />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <header className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your employee id and password to sign in!
            </p>
          </header>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div>
              <Label>
                Employee Id <span className="text-error-500">*</span>
              </Label>
              <SignInInput
                placeholder="Employee id"
                register={register("employee_id", {
                  required: "Employee Id is required",
                })}
                error={!!errors.employee_id}
                hint={errors.employee_id?.message}
              />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>

              <SignInInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                hint={errors.password?.message}
                className="h-12"
                rightIcon={
                  <button type="button" onClick={toggleShowPassword}>
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                }
              />
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
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <Button className="w-full" size="sm" disabled={isLoading} type="submit">
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
          </form>
        </div>
      </div>
    </div>
  );
}
