import { Maybe, Project, RoleType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Card,
  RoleList,
  TextBody,
  TextHeading3,
} from "@eden/package-ui";

export interface ProjectLayoutCardProps {
  project?: Project;
  emoji?: string;
  bgColor?: string;
  showRoles?: boolean;
  selectedRole?: Maybe<RoleType> | null;
  onClick?: () => void;
  handleAddRole?: () => void;
  // eslint-disable-next-line no-unused-vars
  handleEditRole?: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleSelectRole?: (role: Maybe<RoleType>) => void;
}

export const ProjectLayoutCard = ({
  project,
  emoji,
  bgColor = "#e8e8e8",
  showRoles = false,
  selectedRole,
  handleAddRole,
  handleEditRole,
  handleSelectRole,
}: ProjectLayoutCardProps) => {
  return (
    <Card className="mb-3 bg-white p-4" border={!showRoles}>
      <TextBody className="mb-2">Your Project</TextBody>
      <div className="mb-4 flex items-center">
        <div className="mr-4">
          <Avatar isProject emoji={emoji} backColorEmoji={bgColor} />
        </div>
        <TextHeading3>{project?.title}</TextHeading3>
      </div>
      {showRoles && (
        <RoleList
          handleAddRole={handleAddRole}
          handleEditRole={handleEditRole}
          handleSelectRole={handleSelectRole}
          roles={project?.role ? project.role : []}
          selectedRole={selectedRole}
          members={project?.team?.filter((member) => !member?.phase)}
        />
      )}
    </Card>
  );
};
