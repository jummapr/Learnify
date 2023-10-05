"use client"

import {useState,useEffect} from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"


export function ModeToggle() {
    const [mounted,setMounted] = useState(false);
  const { theme,setTheme } = useTheme();

  useEffect(() => setMounted(true),[]);

  if(!mounted) {
    return null;
  }

  return (
   <div className="flex items-center justify-center mx-4">
        {
            theme === "light" ? (
                <Moon 
                    className="cursor-pointer"
                    fill="black"
                    size={25}
                    onClick={() => setTheme("dark")}
                />
            ) : (
                <Sun 
                    size={25}
                    className="cursor-pointer"
                    fill="black"
                    onClick={() => setTheme("light")}
                />
            )
        }
   </div>
  )
}
