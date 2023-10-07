import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const Hero = () => {
  return (
    <div className="w-full  1000px:flex items-center ">
      <div className="grid grid-cols-1 1000px:grid-cols-2 w-full  ">
        <div className="p-10 hero_animation">
          {/* <Image
            src={require("/public/hero-image-2.png")}
            alt="Hero Image"
            width={500}
            height={500}
            className="mt-10"
          /> */}
        </div>

        <div className="mt-12">
          <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px]">
            Improve your Online Learning Experience Better Instantly
          </h2>
          <br />
          <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin ml-4 font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
            We have 40k+ online courses & 500K+ online registered student. Find
            your desired Course from them.
          </p>

          <br />
          <br />
          <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] ml-4 h-[50px] bg-transparent relative">
            <Input
              type="text"
              placeholder="Search Course.."
              className="bg-transparent border dark:border-none dark:bg-[#575757] w-full h-full dark:placeholder:text-[#ffffffdd] rounded-[5px] outline-none"
            />
            <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
              <Search className="text-white" size={30} />
            </div>
          </div>

          <br />
          <br />
          <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] ml-4 flex items-center">
            {/* <Image src={} alt='' className='rounded-full'/>
        <Image  className='rounded-full ml-[-20px]'/>
        <Image className='rounded-full ml-[-20px]'/> */}

            <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
              500K+ People already trusted us.
              <Link
                href={"/courses"}
                className="dark:text-[#46e256] text-[crimson] pl-5"
              >
                View Course
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
