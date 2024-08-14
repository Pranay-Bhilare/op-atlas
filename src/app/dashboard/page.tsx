import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { FeedbackButton } from "@/components/common/FeedbackButton"
import Dashboard from "@/components/dashboard"
import { getUserById } from "@/db/users"
import { getUserOrganizations } from "@/lib/actions/organizations"
import { getApplications, getProjects } from "@/lib/actions/projects"
import { ProjectWithDetails } from "@/lib/types"

export default async function Page() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const [user, projects, applications, organizations] = await Promise.all([
    getUserById(session.user.id),
    getProjects(session.user.id),
    getApplications(session.user.id),
    getUserOrganizations(session.user.id),
  ])

  if (!user) {
    redirect("/")
  }

  return (
    <main className="flex flex-col flex-1 h-full items-center bg-secondary pb-12">
      <Dashboard
        user={user}
        projects={projects as ProjectWithDetails[]}
        applications={applications}
        organizations={organizations}
        className="w-full max-w-4xl"
      />
      <div className="fixed bottom-4 left-4">
        <FeedbackButton />
      </div>
    </main>
  )
}
