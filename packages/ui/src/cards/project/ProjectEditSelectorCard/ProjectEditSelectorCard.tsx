import { Maybe, Project, RoleType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Button,
  Card,
  EmojiSelector,
  ProgressBar,
  RoleSmallCard,
  ServerFilter,
} from "@eden/package-ui";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { differenceInBusinessDays, format } from "date-fns";
import { useEffect } from "react";
// import {sub} from "date-fns/sub"
export interface ProjectEditSelectorCardProps {
  project?: Project;
  selectedRole?: Maybe<RoleType> | null;
  onEdit?: () => void;
  onBack?: () => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectRole: (val: Maybe<RoleType>) => void;
}

export const ProjectEditSelectorCard = ({
  project,
  onBack,
  onEdit,
  selectedRole,
  handleSelectRole,
}: ProjectEditSelectorCardProps) => {
  useEffect(() => {
    if (project?.role?.length) {
      handleSelectRole(project?.role[0] || null);
    }
  }, [project?.role]);

  if (!project) return null;

  const ComplitionDate = new Date(Number(project?.dates?.complition));
  const KickOff = new Date(Number(project?.dates?.kickOff));
  const daysLeft = differenceInBusinessDays(KickOff, ComplitionDate);

  const onSelectRole = (data: any) => {
    if (handleSelectRole) handleSelectRole(data);
  };

  return (
    <Card shadow className={`m-2 w-full bg-white p-3`}>
      <div className="flex flex-row content-center items-center justify-between">
        <div
          className="text-soilGray cursor-pointer hover:text-zinc-600"
          onClick={onBack}
        >
          <ChevronLeftIcon className="mr-1 -mt-1 inline" width={20} />
          <span className="group-hover:underline">Go Back</span>
        </div>
        <div>
          <Button
            variant="default"
            radius="rounded"
            size="md"
            className="shadow hover:shadow-lg"
            onClick={onEdit}
          >
            🛠 Edit Project
          </Button>
        </div>
      </div>
      <div className="mt-2 flex w-full">
        <div>
          {project.emoji ? (
            <EmojiSelector
              isDisabled
              emoji={project.emoji}
              bgColor={String(project.backColorEmoji)}
            />
          ) : (
            <Avatar src={`${project.champion?.discordAvatar}`} size={`md`} />
          )}
        </div>
        <div className={`my-auto pl-4`}>
          <div className={`text-xl`}>{project.title}</div>
        </div>
      </div>
      <div className="mt-2">
        <div className={`text-lg text-zinc-400`}>{`Launched on ${format(
          KickOff,
          "MMM do"
        )}`}</div>
        <div className={`text-sm text-zinc-400`}>
          {daysLeft > 0
            ? `${daysLeft} days left till applications close`
            : "Application Closed"}
        </div>
        {daysLeft ? (
          <div className="mt-3 -mb-3">
            <ProgressBar
              totalDays={Number(project.dates?.kickOff)}
              currentDayCount={Number(project.dates?.complition)}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="grid grid-cols-2 overflow-hidden">
        {project.role?.map((data, index) => (
          <div key={index} className="col-span-1 m-1">
            <RoleSmallCard
              role={data}
              isSelected={selectedRole?._id === data?._id}
              onClick={() => {
                onSelectRole(data);
              }}
            />
          </div>
        ))}
      </div>
      <hr className="my-2 text-slate-300" />
      <ServerFilter />
      <hr className="my-2 text-slate-300" />
    </Card>
  );
};
