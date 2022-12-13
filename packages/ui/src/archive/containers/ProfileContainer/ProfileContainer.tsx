/* eslint-disable camelcase */
import { UserContext } from "@eden/package-context";
import { Maybe, SkillType_Member } from "@eden/package-graphql/generated";
import {
  Button,
  Card,
  SearchSkill,
  SkillList,
  SocialMediaComp,
} from "@eden/package-ui";
import { useContext, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";

import { UserInformationCard } from "../../cards/user/UserInformationCard";
import { BioComponent } from "../../components/BioComponent/BioComponent";

const levels = [
  {
    title: "senior",
    level: "senior",
    colorRGB: "255, 208, 43",
  },
  {
    title: "junior",
    level: "junior",
    colorRGB: "255, 169, 241",
  },
  {
    title: "mid",
    level: "mid",
    colorRGB: "186, 230, 255",
  },
  {
    title: "learning",
    level: "learning",
    colorRGB: "255, 208, 43",
  },
];

export interface ProfileContainerProps {}

export const ProfileContainer = ({}: ProfileContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const skills = currentUser?.skills as Maybe<SkillType_Member>[];

  if (!currentUser) return <div>you are not logged in</div>;

  const handleSaveProfile = () => {
    console.log("save profile - NEED TO IMPLEMENT");
    setIsEditing(false);
  };

  const filterSkills = (
    skills: Maybe<Maybe<SkillType_Member>[]>,
    level: string
  ) => {
    if (skills) return skills.filter((skill) => skill?.level === level);
  };

  return (
    <Card shadow className={`h-8/10 scrollbar-hide overflow-y-scroll bg-white`}>
      <div className="">
        <div className={`my-4 flex justify-between p-4`}>
          <div className={`w-3/4 text-sm text-zinc-500 md:w-1/2`}>
            please note, you cannont change your pfp and user name as those are
            fetched from your discord profile.
          </div>
          <div className={``}>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <Button onClick={() => handleSaveProfile()}>
                <AiOutlineCheck className={`my-auto mr-2`} />
                Finish Editing
              </Button>
            )}
          </div>
        </div>
        <div
          className={`grid space-y-4 p-4 md:grid-cols-12 md:space-x-4 md:space-y-0`}
        >
          <div className={`col-span-8`}>
            <BioComponent
              title={`Short Bio`}
              description={currentUser?.bio || ""}
              isEditable={isEditing}
            />
            <div className={`my-4 grid grid-cols-12 space-x-4`}>
              <div className={`col-span-9 space-y-4`}>
                {currentUser.previusProjects?.map((project, index) => (
                  <div key={index} className={``}>
                    <UserInformationCard
                      previousProjects={project}
                      isEditable={isEditing}
                    />
                  </div>
                ))}
              </div>
              <div className={`col-span-3`}>
                <SocialMediaComp links={currentUser.links} />
              </div>
            </div>
            <div
              className={`my-4 grid grid-cols-6 space-y-4 md:grid-cols-12 md:space-x-4 md:space-y-0`}
            >
              <div className={`col-span-6`}>
                <BioComponent
                  title={`What project are you most proud of?`}
                  description={currentUser.content?.mostProud || ""}
                  isEditable={isEditing}
                />
              </div>
              <div className={`col-span-6`}>
                <BioComponent
                  title={`What piece of work really showcases your abilities?`}
                  description={currentUser.content?.showCaseAbility || ""}
                  isEditable={isEditing}
                />
              </div>
            </div>
          </div>
          <div className={`col-span-4 space-y-2`}>
            {isEditing && (
              <SearchSkill
                levels={levels}
                skills={currentUser?.skills}
                setSkills={(val: any) => console.log("set skills", val)}
              />
            )}
            {levels.map((level, index: number) => {
              return (
                <div key={index}>
                  <div className={`border-t text-center text-sm text-zinc-500`}>
                    {level.title}
                  </div>
                  <SkillList
                    colorRGB={level.colorRGB}
                    skills={
                      filterSkills(
                        skills as Maybe<SkillType_Member>[],
                        `${level.level}`
                      ) as Maybe<SkillType_Member>[]
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
