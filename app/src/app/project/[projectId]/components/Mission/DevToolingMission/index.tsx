"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import React from "react"

import ExtendedLink from "@/components/common/TrackedExtendedLink"
import TrackedLink from "@/components/common/TrackedLink"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatNumber,
  getEligibleRetrofundingMonths,
  truncateString,
} from "@/lib/utils"

import { MONTHS } from "../constants"
import MetricCard from "./MetricCard"

interface DevtoolingMissionProps {
  projectName: string
  data: {
    gasConsumed?: number
    onchainBuildersInAtlasCount?: number
    topProjects?: {
      id?: string
      name?: string
      website?: string[]
      thumbnailUrl?: string
    }[]
    opReward?: number | null
    isEligible?: boolean
    isMember: boolean
  }
  applicationDate: Date
}

export default function DevToolingMission({
  projectName,
  data,
  applicationDate,
}: DevtoolingMissionProps) {
  const params = useParams()
  const projectId = params.projectId as string

  const opReward = data.opReward ?? 0
  const isEligible = data.isEligible ?? false

  const eligibleMonths = getEligibleRetrofundingMonths(applicationDate)

  return (
    <div className="space-y-3">
      {opReward > 0 && (
        <div className="mt-6 relative w-full h-64 rounded-xl z-10 overflow-hidden">
          <div className="-top-[1024px] -left-[512px] rounded-full absolute w-[2048px] h-[2048px] bg-gradient-to-br from-[#FF744A78] from-50% to-[#FF5C6C] via-[#FF67B5] animate-slow-spin" />
          <Image
            className="absolute top-0 left-0 z-0 p-0.5 rounded-xl"
            src="/assets/images/rewards-dev-tooling-banner.png"
            objectFit="cover"
            objectPosition="center"
            layout="fill"
            alt="Rewards Banner"
          />
          <Image
            src="/assets/images/rewards-dev-tooling-element.png"
            width={256}
            height={256}
            alt="Dev Tooling"
            className="absolute bottom-0.5 right-0.5 rounded-br-[11px]"
          />

          <div className="absolute w-full h-full z-50">
            <div className="w-full h-full flex items-center justify-center flex-col space-y-6">
              <div className="text-center space-y-3 z-50">
                <span className="font-extrabold text-4xl">
                  {formatNumber(opReward, 0)} OP
                </span>
                <p className="text-secondary-foreground">
                  Rewards so far in Retro Funding: Dev Tooling
                </p>
              </div>
              {data.isMember && (
                <ExtendedLink
                  as="button"
                  variant="primary"
                  className="z-50"
                  href={`/projects/${projectId}/rewards`}
                  text="Claim your rewards"
                  eventName="Link Click"
                  eventData={{
                    projectId,
                    source: "project_page",
                    isContributor: data.isMember,
                    linkName: "View recipients",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Tabs defaultValue={MONTHS[0]} className="w-full mt-12">
        <TabsList className="bg-transparent space-x-2 flex items-center justify-between overflow-auto h-fit">
          {MONTHS.map((month, index) => {
            const isFutureMonth = month !== "February"
            return (
              <TabsTrigger
                disabled={isFutureMonth}
                key={index}
                value={month}
                className="rounded-lg py-2 px-4 bg-secondary text-secondary-foreground border border-tertiary min-w-36 w-full data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                {month}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {MONTHS.map((month) => {
          if (!eligibleMonths.includes(month)) {
            return (
              <TabsContent
                key={month}
                value={month}
                className="w-full data-[state=inactive]:hidden p-10 border borded-[#E0E2EB] rounded-xl mt-3"
              >
                <div className="w-full flex items-center justify-center">
                  <p className="text-foreground font-semibold text-base">
                    {projectName} was not enrolled in {month}
                  </p>
                </div>
              </TabsContent>
            )
          }

          if (!isEligible) {
            return (
              <TabsContent
                key={month}
                value={month}
                className="w-full data-[state=inactive]:hidden p-10 border borded-[#E0E2EB] rounded-xl mt-3"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value="retro-funding" className="w-full">
                    <div className="flex flex-col items-center w-full">
                      <p className="font-semibold text-base text-foreground">
                        Requirements to earn rewards in February were not met
                      </p>
                      <div className="flex items-center space-x-1">
                        <p className="text-secondary-foreground text-base font-normal">
                          Measured over the last 180 days
                        </p>
                      </div>
                    </div>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            )
          }

          return (
            <TabsContent
              key={month}
              value={month}
              className="w-full grid grid-cols-2 gap-4 data-[state=inactive]:hidden mt-3"
            >
              <MetricCard
                value={formatNumber(data.gasConsumed ?? 0)}
                title={`Gas consumed by builders using ${projectName}`}
                sign={{ value: " ETH", position: "right" }}
                index={0}
              />
              <MetricCard
                value={formatNumber(
                  data.onchainBuildersInAtlasCount ?? 0,
                  0,
                  "compact",
                )}
                title={`Trusted developers engaging with ${projectName}`}
                index={1}
              />
              <div className="w-full col-span-full border rounded-xl p-6 h-[166px]">
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col justify-between h-full w-full">
                    <div>
                      <p className="font-semibold text-base text-foreground">
                        Top projects
                      </p>
                      <p className="text-secondary-foreground font-normal text-base">
                        Top projects in Atlas using {projectName}
                      </p>
                    </div>
                    <p className="!text-secondary-foreground">
                      Projects enrolled in Retro Funding: Onchain Builders only
                    </p>
                  </div>
                  <ul className="w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {data.topProjects?.slice(0, 6).map((project, index) => {
                      return (
                        <li key={index} className="space-x-2 flex items-center">
                          {project.thumbnailUrl && (
                            <Image
                              src={project.thumbnailUrl}
                              alt={project.name ?? ""}
                              width={24}
                              height={24}
                            />
                          )}
                          <TrackedLink
                            href={`/project/${project.id}`}
                            eventName="Link Click"
                            target="_blank"
                            eventData={{
                              projectId: project.id,
                              source: "project_page",
                              linkName: "Top Projects",
                            }}
                          >
                            {project.name}
                          </TrackedLink>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
