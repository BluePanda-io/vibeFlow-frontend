import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Mutation, Project } from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Favorite,
  // SkillMatchModal,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";

import { round } from "../../../../../utils";

const SET_FAVORITE = gql`
  mutation ($fields: addFavoriteProjectInput!) {
    addFavoriteProject(fields: $fields) {
      _id
    }
  }
`;

export interface ProjectCardProps {
  project?: Project;
  avatar?: string;
  percentage?: number;
  position?: string;
  applyButton?: boolean;
  statusButton?: boolean;
  inviteButton?: boolean;
  favButton?: boolean;
  focused?: boolean;
}

export const ProjectCard = ({
  project,
  avatar,
  percentage,
  applyButton = false,
  statusButton = false,
  inviteButton = false,
  favButton = false,
  focused,
}: ProjectCardProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  // const [showSkillMatchModel, setSkillMatchModel] = useState(false);
  const [addFavoriteProject, {}] = useMutation(SET_FAVORITE, {
    onCompleted({ addFavoriteProject }: Mutation) {
      if (!addFavoriteProject) console.log("addFavoriteProject is null");
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (currentUser?.projects && currentUser?.projects.length > 0 && project) {
      currentUser?.projects.forEach((element) => {
        if (project?._id === element?.info?._id) {
          updateFav(element?.favorite || false);
        }
      });
    }
  }, [currentUser?.projects, project]);
  // const onOpenModal = () => {
  //   setSkillMatchModel(!showSkillMatchModel);
  // };
  // const onCloseModal = () => {
  //   setSkillMatchModel(false);
  // };
  const [fav, updateFav] = useState(false);
  const onClickFav = () => {
    setSubmitting(true);
    addFavoriteProject({
      variables: {
        fields: {
          projectID: project?._id,
          memberID: currentUser?._id,
          favorite: !fav,
        },
      },
      context: { serviceName: "soilservice" },
    });
    updateFav(!fav);
  };

  if (!project) return null;

  return (
    <>
      {/* <SkillMatchModal
        onCloseModal={onCloseModal}
        isModalOpen={showSkillMatchModel}
        budget={24}
        avaiability={64}
        projectCost={"70 USDC"}
        yourCost={"140 USDC"}
        projectHr={25}
        yourHr={15}
        matchingPercentage={81}
        chartData={[
          {
            name: "Web Design",
            percentage: 60,
          },
          {
            name: "Blockchain",
            percentage: 95,
          },
          {
            name: "Agile Dev",
            percentage: 55,
          },
          {
            name: "Business",
            percentage: 70,
          },
          {
            name: "Marketing",
            percentage: 41,
          },
          {
            name: "Sales",
            percentage: 48,
          },
        ]}
      /> */}
      <Card border focused={focused} className="px-4 py-4">
        <div className="flex justify-between">
          <div>
            <Avatar
              src={avatar}
              size="md"
              isProject
              emoji={project?.emoji as string}
              backColorEmoji={project?.backColorEmoji as string}
            />
          </div>
          <div className={`w-full pl-4`}>
            <div className="flex h-full">
              <div className={`-mt-2 mr-auto`}>
                <div className={`text-xl`}>{project.title}</div>
                <div className={`text-sm text-zinc-400`}>
                  {project.description}
                </div>
                <div className={`mt-2 flex`}>
                  {project.role?.map((role, index) => (
                    <Badge
                      key={index}
                      className={`bg-soilPurple/20 py-px text-xs`}
                      text={role?.title || ""}
                      cutText={99}
                    ></Badge>
                  ))}
                </div>
              </div>
              {percentage && (
                <div
                  className={`flex h-full flex-col items-center border-l px-4 last:pr-0`}
                  // onClick={() => onOpenModal()}
                  // onMouseOver={() => onOpenModal()}
                >
                  <span>⚡ Match</span>
                  <span className={`text-soilPurple text-3xl font-semibold`}>
                    {round(Number(percentage), 1)}%
                  </span>
                </div>
              )}
              {favButton && (
                <div
                  className={`flex h-full items-center border-l px-4 last:pr-0`}
                >
                  <Favorite
                    disabled={submitting}
                    favorite={fav}
                    onFavorite={() => onClickFav()}
                  />
                </div>
              )}
              {applyButton && (
                <div
                  className={`flex h-full flex-col items-center border-l px-4 last:pr-0`}
                >
                  <div className={`my-auto`}>
                    <Button
                      variant={`primary`}
                      onClick={() => router.push(`/apply/${project._id}`)}
                    >
                      Apply
                      <span className={`my-auto pl-2`}>
                        <BsArrowRight />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
              {statusButton && (
                <div
                  className={`flex h-full flex-col items-center border-l px-4 last:pr-0`}
                >
                  <div className={`my-auto`}>
                    <Button
                      variant={`primary`}
                      onClick={() => router.push(`/my-projects/${project._id}`)}
                    >
                      View Project
                      <span className={`my-auto pl-2`}>
                        <BsArrowRight />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
              {inviteButton && (
                <div
                  className={`flex h-full flex-col items-center border-l px-4 last:pr-0`}
                >
                  <div className={`my-auto`}>
                    <Button
                      variant={`primary`}
                      onClick={() => router.push(`/invites/${project._id}`)}
                    >
                      View Project
                      <span className={`my-auto pl-2`}>
                        <BsArrowRight />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
