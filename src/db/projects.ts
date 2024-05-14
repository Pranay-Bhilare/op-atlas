"use server"

import { Prisma, Project } from "@prisma/client"

import { TeamRole } from "@/lib/types"

import { prisma } from "./client"

export async function getUserProjects({
  farcasterId,
}: {
  farcasterId: string
}) {
  return prisma.user.findUnique({
    where: {
      farcasterId,
    },
    select: {
      projects: {
        where: {
          project: {
            deletedAt: null,
          },
        },
        include: {
          project: true,
        },
      },
    },
  })
}

export async function getUserProjectsWithDetails({
  userId,
}: {
  userId: string
}) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      projects: {
        where: {
          project: {
            deletedAt: null,
          },
        },
        include: {
          project: {
            include: {
              team: { include: { user: true } },
              repos: true,
              contracts: true,
              funding: true,
              snapshots: true,
              applications: true,
            },
          },
        },
        orderBy: {
          project: {
            createdAt: "asc",
          },
        },
      },
    },
  })
}

export type CreateProjectParams = Partial<
  Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">
> & {
  name: string
  description: string
}

export async function createProject({
  userId,
  projectId,
  project,
}: {
  userId: string
  projectId: string
  project: CreateProjectParams
}) {
  return prisma.project.create({
    data: {
      id: projectId,
      ...project,
      team: {
        create: {
          role: "admin" satisfies TeamRole,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  })
}

export type UpdateProjectParams = Partial<
  Omit<Project, "id" | "createdAt" | "updatedAt" | "deletedAt">
>

export async function updateProject({
  id,
  project,
}: {
  id: string
  project: UpdateProjectParams
}) {
  return prisma.project.update({
    where: {
      id,
    },
    data: project,
  })
}

export async function deleteProject({ id }: { id: string }) {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

export async function getProject({ id }: { id: string }) {
  return prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      team: { include: { user: true } },
      repos: true,
      contracts: true,
      funding: true,
      snapshots: true,
      applications: true,
    },
  })
}

export async function getProjectTeam({ id }: { id: string }) {
  return prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      team: {
        include: {
          user: true,
        },
      },
    },
  })
}

export async function addTeamMember({
  projectId,
  userId,
  role = "member",
}: {
  projectId: string
  userId: string
  role?: TeamRole
}) {
  return prisma.userProjects.create({
    data: {
      role,
      user: {
        connect: {
          id: userId,
        },
      },
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  })
}

export async function addTeamMembers({
  projectId,
  userIds,
  role = "member",
}: {
  projectId: string
  userIds: string[]
  role?: TeamRole
}) {
  return prisma.userProjects.createMany({
    data: userIds.map((userId) => ({
      role,
      userId,
      projectId,
    })),
  })
}

export async function updateMemberRole({
  projectId,
  userId,
  role,
}: {
  projectId: string
  userId: string
  role: TeamRole
}) {
  return prisma.userProjects.update({
    where: {
      userId_projectId: {
        projectId,
        userId,
      },
    },
    data: {
      role,
    },
  })
}

export async function removeTeamMember({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  return prisma.userProjects.delete({
    where: {
      userId_projectId: {
        projectId,
        userId,
      },
    },
  })
}

export async function addProjectContract({
  projectId,
  contract,
}: {
  projectId: string
  contract: Omit<Prisma.ProjectContractCreateInput, "project">
}) {
  return prisma.projectContract.create({
    data: {
      ...contract,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  })
}

export async function removeProjectContract({
  projectId,
  address,
  chainId,
}: {
  projectId: string
  address: string
  chainId: number
}) {
  return prisma.projectContract.delete({
    where: {
      projectId,
      contractAddress_chainId: {
        contractAddress: address,
        chainId,
      },
    },
  })
}

export async function getProjectContracts({
  projectId,
  deployerAddress,
}: {
  projectId: string
  deployerAddress: string
}) {
  return prisma.projectContract.findMany({
    where: {
      projectId,
      deployerAddress,
    },
    include: {
      project: true,
    },
  })
}

export async function addProjectRepository({
  projectId,
  repo,
}: {
  projectId: string
  repo: Omit<Prisma.ProjectRepositoryCreateInput, "project">
}) {
  return prisma.projectRepository.create({
    data: {
      ...repo,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  })
}

export async function removeProjectRepository({
  projectId,
  repositoryUrl,
}: {
  projectId: string
  repositoryUrl: string
}) {
  return prisma.projectRepository.delete({
    where: {
      projectId: projectId,
      url: repositoryUrl,
    },
  })
}

export async function updateProjectRepository({
  projectId,
  url,
  updates,
}: {
  projectId: string
  url: string
  updates: Prisma.ProjectRepositoryUpdateInput
}) {
  return prisma.projectRepository.update({
    where: {
      projectId,
      url,
    },
    data: updates,
  })
}

export async function updateProjectRepositories({
  projectId,
  type,
  repositories,
}: {
  projectId: string
  type: string
  repositories: Prisma.ProjectRepositoryCreateManyInput[]
}) {
  // Delete the existing repositories and replace it
  const remove = prisma.projectRepository.deleteMany({
    where: {
      projectId,
      type,
    },
  })

  const create = prisma.projectRepository.createMany({
    data: repositories.map((r) => ({
      ...r,
      projectId,
    })),
  })

  return prisma.$transaction([remove, create])
}

export async function updateProjectFunding({
  projectId,
  funding,
}: {
  projectId: string
  funding: Prisma.ProjectFundingCreateManyInput[]
}) {
  // Delete the existing funding and replace it
  const remove = prisma.projectFunding.deleteMany({
    where: {
      projectId,
    },
  })

  const create = prisma.projectFunding.createMany({
    data: funding.map((f) => ({
      ...f,
      projectId,
    })),
  })

  // Mark that the project was funded
  const update = prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      addedFunding: true,
    },
  })

  return prisma.$transaction([remove, create, update])
}

export async function addProjectSnapshot({
  projectId,
  ipfsHash,
  attestationId,
}: {
  projectId: string
  ipfsHash: string
  attestationId: string
}) {
  return prisma.projectSnapshot.create({
    data: {
      ipfsHash,
      attestationId,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  })
}

export async function createApplication({
  projectId,
  attestationId,
  round,
}: {
  projectId: string
  attestationId: string
  round: number
}) {
  return prisma.application.create({
    data: {
      attestationId,
      project: {
        connect: {
          id: projectId,
        },
      },
      round: {
        connect: {
          id: round.toString(),
        },
      },
    },
  })
}

export async function getUserApplications({ userId }: { userId: string }) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      projects: {
        where: {
          project: {
            deletedAt: null,
          },
        },
        include: {
          project: {
            include: {
              applications: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      },
    },
  })
}
