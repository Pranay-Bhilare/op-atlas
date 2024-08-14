"use client"

import { Project } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { clickSignInWithFarcasterButton } from "@/lib/utils"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

export const Sidebar = ({
  className,
  projects,
}: {
  className?: string
  projects: Project[]
}) => {
  const { status, data } = useSession()
  const router = useRouter()

  const onClickGetStarted = () => {
    if (status === "authenticated") {
      router.push("/dashboard")
    } else {
      clickSignInWithFarcasterButton()
    }
  }

  const classes: { [key: number]: string } = {
    0: "rounded-md absolute top-1/2 transform -translate-y-1/2 left-3 m-auto w-7 h-7 z-20",
    1: "rounded-md absolute inset-0 m-auto w-12 h-12 z-30 transform -translate-x-12",
    2: "absolute rounded-md top-0 bottom-0 left-0 right-0 m-auto z-40",
    3: "rounded-md absolute inset-0 m-auto w-12 h-12 z-30 transform translate-x-12",
    4: "rounded-md absolute right-3 top-1/2 transform -translate-y-1/2 m-auto w-7 h-7 z-20",
  }

  return (
    <div className={cn("flex flex-col gap-y-6", className)}>
      {/* Your project not received card */}
      {data?.user && (
        <div className="flex flex-col items-center gap-y-3 p-6 border border-[#E0E2EB] bg-[#FBFCFE] rounded-xl">
          <Image
            alt="empty profile"
            src="/assets/images/big-sunny.png"
            width={76}
            height={76}
          />

          <p className="text-sm font-medium text-foreground text-center">
            Your project did not receive rewards in Round 5
          </p>
          <Link href="/profile/details">
            <Button
              variant="outline"
              className="text-sm font-medium text-foreground justify-center  w-full"
            >
              View profile
            </Button>
          </Link>
        </div>
      )}

      {/* Welcome too retro funding app */}
      {!data?.user && (
        <div className="flex flex-col items-center gap-y-3 p-6 border border-[#D6E4FF] bg-[#F0F4FF] rounded-xl">
          <Image
            alt="empty profile"
            src="/assets/images/sunnies-group.png"
            width={207}
            height={84.2}
          />

          <p className="text-sm font-medium text-foreground text-center">
            Welcome to the new Retro Funding app
          </p>
          <p className="text-sm font-normal text-secondary-foreground text-center">
            Whether you’re a builder or a badgeholder, sign up.
          </p>

          <Button
            onClick={onClickGetStarted}
            variant="outline"
            className="text-sm font-medium text-foreground justify-center mt-1 w-full"
          >
            <Image
              src="/assets/icons/farcaster-icon.svg"
              height={12.23}
              width={13.33}
              alt="farcaster"
              className="mr-[10px]"
            />
            Sign up
          </Button>
        </div>
      )}

      {/* Explore projects */}
      <div className="flex flex-col items-center justify-center gap-y-3 p-6 border border-secondary bg-secondary rounded-xl">
        <div className="relative flex justify-center items-center py-4 w-full h-20">
          {projects?.map((item, index) => (
            <Image
              key={item.id}
              alt={item.name}
              src={item.thumbnailUrl || ""}
              width={28 + index * 20} // Adjusting size based on index
              height={28 + index * 20} // Adjusting size based on index
              className={classes[index]}
            />
          ))}
        </div>

        <p className="text-sm font-medium text-foreground text-center">
          Explore projects
        </p>
        <p className="text-sm font-normal text-secondary-foreground text-center">
          Explore the projects that have received Retro Funding.
        </p>
        <Link className="w-full" href="/dashboard">
          <Button
            variant="outline"
            className="text-sm font-medium text-foreground justify-center mt-1 w-full"
          >
            View projects
          </Button>
        </Link>
      </div>

      {/* Retro funding rewarded to optimism coolective */}
      <div className="flex flex-col items-center gap-y-3 p-6 border border-secondary bg-secondary rounded-xl">
        <p className="text-sm font-medium text-text-default text-center">
          60,815,042 OP
        </p>
        <p className="text-sm font-normal text-secondary-foreground text-center">
          Retro Funding rewarded to Optimism Collective contributors since 2022
        </p>
      </div>
    </div>
  )
}
