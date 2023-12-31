import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { styles } from "@/styles/style";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";

interface VerificationProps {
  setRoute: (route: string) => void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
//   "4": string;
//   "5": string;
};

const Verification: FC<VerificationProps> = ({ setRoute }) => {
  const {token} = useSelector((state:any) => state.auth);
  const [activation, {isSuccess,error}] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if(isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login")
    }
    if(error) {
      if("data" in error) {
         const errorData = error as any;
         toast.error(errorData.data.message)
      } else {
        console.log("An error occured:  ", error)
      }
      setInvalidError(true)
    }
  },[isSuccess,error])

  const [verifyNumbers, setVerifyNumbers] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
    // 4: "",
    // 5: "",
  });
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    // useRef<HTMLInputElement>(null),
    // useRef<HTMLInputElement>(null),
  ];

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumbers).join("");
    console.log("Activation Data",token,verificationNumber)
    if(verificationNumber.length !== 4) {
      // setInvalidError(true)
    }
    await activation({
      activation_token:token ,
      activation_code: verificationNumber
    });
  };
  
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = {
      ...verifyNumbers,
      [index]: value,
    };
    setVerifyNumbers(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <ShieldCheck size={40} />
      </div>
      <br />
      <br />
      <div className=" m-auto flex items-center justify-center gap-x-2">
        {Object.keys(verifyNumbers).map((key, index) => (
          <>
            <input
              type="number"
              key={key}
              className={cn(
                "w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center",
                invalidError
                  ? "shake border-red-500"
                  : "dark:border-white border-[#0000004a] "
              )}
              placeholder=""
              maxLength={1}
              value={verifyNumbers[key as keyof VerifyNumber]}
              onChange={(e) => handleInputChange(index,e.target.value)}
            />
          </>
        ))}
      </div>
      <br />
      <br />
      <div className={"w-full flex justify-center"}>
            <button className={`${styles.button}`} onClick={verificationHandler}>
                Verify OTP
            </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go Back to Sign In? <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Login")}>Sign In</span>
      </h5>
    </div>
  );
};

export default Verification;
