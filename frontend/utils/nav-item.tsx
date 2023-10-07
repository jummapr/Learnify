import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

export const navItemData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

interface NavItemProps {
  activeItem: number;
  isMobile: boolean;
}

const NavItem: FC<NavItemProps> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex ">
        {navItemData.map((item, index) => (
          <Link href={`${item.url}`} key={index} passHref>
            <span
              className={cn(
                activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black",
                "text-[18px] px-6 font-Poppins font-[400]"
              )}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                Learnify
              </Link>
            </div>
            {navItemData.map((item, index) => (
              <Link href={item.url} passHref>
                <span
                  className={cn(
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black",
                    "block py-5 text-[18px] px-6 font-Poppins font-[400]"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItem;
