import { FC, useState,useEffect } from "react";
import { useFormik } from "formik";
import * as Yop from "yup";
import { Eye, EyeOff, Github } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { styles } from "@/styles/style";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface LoginProps {
  setRoute: (route: string) => void;
  setOpen: (open:boolean) =>  void;
}

const schema = Yop.object().shape({
  email: Yop.string().email("Invalid Email").required("Email is required"),
  password: Yop.string().min(6).required("Password is required"),
});

const Login: FC<LoginProps> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, {isLoading,data,isSuccess,error}] = useLoginMutation()

  const formic = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({email,password})
    },
  });

  useEffect(() => {
    if(isSuccess) {
      toast.success("Login successFully")
      setOpen(false);

    }
   if(error) {
    if("data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data.message)
    }
   }
  }, [isSuccess,error])
  

  const { errors, touched, values, handleChange, handleSubmit } = formic;
  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login With Learnify</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Email" className={`${styles.label}`}>
          Enter your Email
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          id="Email"
          placeholder="example@gmail.com"
          className={cn(
            errors.email && touched.email && "border-red-500",
            styles.input
          )}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}

        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="Password" className={`${styles.label}`}>
            Enter your Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="Password"
            placeholder="password@i88"
            className={cn(
              errors.password && touched.password && "border-red-500",
              styles.input
            )}
          />
          {!show ? (
            <Eye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <EyeOff
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}

          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>
        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">or Join with</h5>

        <div className="flex items-center justify-center my-3">
            <Image src={"/assets/google.png"} alt={"google"} className="cursor-pointer mr-2" width={40} height={40} onClick={() => signIn("google")}/>
            <Image src={"/assets/social.png"} alt={"github"} className="cursor-pointer ml-2" width={40} height={40} onClick={() => signIn("github")}/>
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
            Not have any account?{" "}
            <span className="text-[#2190ff] pl-1 cursor-pointer " onClick={() => setRoute("Sign-up")}>Sign Up</span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;
