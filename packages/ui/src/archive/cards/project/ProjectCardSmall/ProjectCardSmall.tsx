import { Project } from "@eden/package-graphql/generated";
import { Avatar, Card, ProgressBar } from "@eden/package-ui";

export interface ProjectCardSmallProps {
  project?: Project;
  avatar?: string;
  focused?: boolean;
  totalDays?: number;
  currentDayCount?: number;
}

export const ProjectCardSmall = ({
  project,
  avatar,
  focused = false,
  totalDays = 100,
  currentDayCount = 50,
}: ProjectCardSmallProps) => {
  if (!project) return null;
  const daysLeft = totalDays - currentDayCount;

  // console.log(project);

  const engagedProjects = project?.team?.filter(
    (project: any) => project.phase === "engaged"
  );

  return (
    <Card shadow focused={focused} className={`w-full bg-white p-3`}>
      <div className="flex w-full">
        <div>
          <Avatar
            src={avatar}
            size={`sm`}
            isProject
            emoji={project?.emoji as string}
            backColorEmoji={project?.backColorEmoji as string}
          />
        </div>
        <div className={`my-auto pl-4`}>
          <div className={`text-xl`}>{project.title}</div>
          <div className={`text-base `}>
            Engaged talent: {engagedProjects?.length}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className={`pl-16 text-sm text-zinc-400`}>
          {daysLeft > 0
            ? `${daysLeft} days left till applications close`
            : "Application Closed"}
        </div>
        <div className="mt-3 -mb-3">
          <ProgressBar
            totalDays={totalDays}
            currentDayCount={currentDayCount}
          />
        </div>
      </div>
    </Card>
  );
};
