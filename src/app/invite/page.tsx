"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useSearchParams } from "next/navigation";

export default function InvitePage() {
  const search = useSearchParams();
  return (
    <main className="flex my-20">
      <Card className="mx-auto">
        <CardHeader>
          <Image src="/logo.jpg" alt="logo" width={200} height={200} priority sizes="large" className="w-[200px] h-auto mx-auto"/>
          <CardTitle className="text-center text-2xl">Invitation to join a team</CardTitle>
          <CardDescription>
            You have been invited by{" "}
            <span className="font-bold">coach&apos;s name</span> to join his team
          </CardDescription>
        </CardHeader>
        <CardContent  className="flex justify-center">
          <Button>Accept invitation</Button>
        </CardContent>
      </Card>
    </main>
  );
}
