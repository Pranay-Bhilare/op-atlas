import Image from "next/image"

import TrackedExtendedLink from "@/components/common/TrackedExtendedLink"
import { ProjectWithDetailsLite } from "@/lib/types"

function ProjectWithLink({ project }: { project: ProjectWithDetailsLite }) {
  return (
    <div className="flex items-center space-x-2">
      {project.applications.length > 0 ? (
        <TrackedExtendedLink
          text={project.name}
          href={`/project/${project.id}`}
          eventName="Link Click"
          eventData={{
            projectId: project.id,
            source: "Profile",
            linkName: "Project",
          }}
          subtext={
            project.rewards.length
              ? `Rewarded in Retro Funding ${project.rewards
                  .map((reward) => reward.roundId)
                  .join(", ")}`
              : undefined
          }
          icon={
            project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl ?? ""}
                alt={project.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span>{project.name.charAt(0)}</span>
              </div>
            )
          }
        />
      ) : (
        <>
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl ?? ""}
              alt={project.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span>{project.name.charAt(0)}</span>
            </div>
          )}
          <span>
            {project.name.length > 20
              ? `${project.name.slice(0, 20)}...`
              : project.name}
          </span>
          <Image
            src="/assets/icons/arrow-up-right.svg"
            width={10}
            height={10}
            alt="External link"
            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </>
      )}
    </div>
  )
}

export default ProjectWithLink
