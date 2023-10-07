import { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yop from "yup";
import { Eye, EyeOff, Github } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { styles } from "@/styles/style";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SignUpProps {
  setRoute: (route: string) => void;
}

const schema = Yop.object().shape({
  name: Yop.string().required("Name is required"),
  email: Yop.string().email("Invalid Email").required("Email is required"),
  password: Yop.string().min(6).required("Password is required"),
});

const SignUp: FC<SignUpProps> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formic = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      setRoute("Verification")
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formic;
  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to Learnify</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className={`${styles.label}`}>
            Enter your Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="johndoe"
            className={cn(
              errors.name && touched.name && "border-red-500",
              styles.input
            )}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>

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
          <input type="submit" value="Sign Up" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          or Join with
        </h5>

        <div className="flex items-center justify-center my-3">
          <Image
            src={"/assets/google.png"}
            alt={"google"}
            className="cursor-pointer mr-2"
            width={40}
            height={40}
          />
          <Image
            src={"/assets/social.png"}
            alt={"github"}
            className="cursor-pointer ml-2"
            width={40}
            height={40}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer "
            onClick={() => setRoute("Login")}
          >
            Sign In
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
