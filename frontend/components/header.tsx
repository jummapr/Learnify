"use client";
import { cn } from "@/lib/utils";
import NavItem from "@/utils/nav-item";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggele";
import { AlignJustify, UserCircle } from "lucide-react";
import CustomModel from "@/utils/CustomModel";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Verification from "./auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "/public/assets/avatar.png";
import { useSession } from "next-auth/react";
import { useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

interface HeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

const Header: FC<HeaderProps> = ({
  activeItem,
  open,
  setOpen,
  route,
  setRoute,
}) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const {data} = useSession();
  const [socialAuth,{isSuccess,error}]= useSocialAuthMutation();
  

  useEffect(() => {
    if(!user) {
      if(data) {
        socialAuth({email: data?.user?.email, name: data?.user?.name, image: data?.user?.avatar})
      }
    }
    if (isSuccess) {
      toast.success("Login successFully")
      setOpen(false);
    }
    if(error) {
      if("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data.message)
      }
    }
  }, [data,user])

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  console.log(user);

  return (
    <div className="w-full relative">
      <div
        className={cn(
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z[80] dark:shadow"
        )}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                Learnify
              </Link>
            </div>
            <div className="flex items-center">
              <NavItem activeItem={activeItem} isMobile={false} />
              <ModeToggle />
              {/* Only for mobile */}
              <div className="800px:hidden">
                <AlignJustify
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {user ? (
                <Link href={"/profile"}>
                  <Image src={user?.avatar?.url ? user.avatar.url : avatar} alt="logo" width={40} height={40} className="rounded-full cursor-pointer" />
                </Link>
              ) : (
                <UserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItem activeItem={activeItem} isMobile={true} />

              <UserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright &copy; 2023 Learnify
              </p>
            </div>
          </div>
        )}
      </div>

      {route === "Login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}

      {route === "Sign-up" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
