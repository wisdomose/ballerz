"use client";
import Image from "next/image";
import Login from "./_login";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Signup from "./_signup";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleIsLogin = () => setIsLogin((s) => !s);

  return (
    <div className="">
      <div className="bg-white grid md:grid-cols-2 w-screen h-screen">
        <div className="hidden md:block relative overflow-hidden">
          <Image
            fill
            alt=""
            src="/auth.jpg"
            className="object-cover object-center"
            priority
            sizes="large"
          />
        </div>

        <div className="flex flex-col gap-6 items-center justify-center md:overflow-auto py-10 ">
          <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Signup"}</h1>
          {isLogin ? <Login /> : <Signup />}
          <p className="text-center text-sm">
            {isLogin ? "Don't own an account? " : "Already own an account? "}
            <Button variant="link" className="px-0" onClick={toggleIsLogin}>
              {isLogin ? "sign up" : "Login"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="min-h-[100vh] min-w-[100%] flex flex-col gap-6 items-center justify-center">
  //     <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Signup"}</h1>

  //     <div className="shadow-lg bg-white grid grid-cols-2 max-w-xl w-full overflow-hidden">
  //       <div className="relative">
  //         <Image
  //           fill
  //           alt=""
  //           src="/auth.jpg"
  //           className="object-cover object-center"
  //           priority
  //           sizes="large"
  //         />
  //       </div>

  //       <div className="p-6 flex items-center justify-center min-h-[400px] max-h-[400px] overflow-auto">
  //         {isLogin ? <Login /> : <Signup />}
  //       </div>
  //     </div>

  //     <p className="text-center text-sm">
  //       {isLogin ? "Don't own an account? " : "Already own an account? "}
  //       <Button variant="link" className="px-0" onClick={toggleIsLogin}>
  //         {isLogin ? "sign up" : "Login"}
  //       </Button>
  //     </p>
  //   </div>
  // );
}
