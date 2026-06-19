import { Location } from "@agentx-cli/core/location"
import { Project } from "@agentx-cli/core/project"
import { AbsolutePath } from "@agentx-cli/core/schema"

export function location(ref: Location.Ref, input: { projectDirectory?: AbsolutePath; vcs?: Project.Vcs } = {}) {
  return {
    directory: ref.directory,
    workspaceID: ref.workspaceID,
    project: { id: Project.ID.global, directory: input.projectDirectory ?? ref.directory },
    vcs: input.vcs,
  } satisfies Location.Interface
}
