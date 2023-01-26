/* eslint-disable camelcase */
import {
  Maybe,
  RoleType,
  SkillRoleType,
} from "@eden/package-graphql/generated";
import {
  AvatarList,
  AvatarProps,
  Badge,
  Card,
  TextHeading3,
} from "@eden/package-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

import { trimParentheses } from "../../../utils/trim-parentheses";

export interface RoleSmallCardProps {
  role: Maybe<RoleType>;
  skills?: Maybe<SkillRoleType>[];
  avatars?: AvatarProps[];
  isSelected: boolean;
  onClick?: () => void;
  handleEdit?: (() => void) | undefined;
}

interface SkillListForRoleProps {
  skills: Maybe<SkillRoleType>[] | undefined;
  colorRGB?: string;
  closeButton?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOnClick?: () => void;
}
const SkillListForRole: React.FC<SkillListForRoleProps> = ({
  skills,
  colorRGB,
  // closeButton = false,
  // handleOnClick,
}) => {
  const [seeMore, setSeeMore] = useState(false);

  const badges = skills?.map(
    (skill: Maybe<SkillRoleType> | undefined, index: number) => (
      <Badge
        key={index}
        text={trimParentheses(skill?.skillData?.name || "")}
        colorRGB={colorRGB}
        className={`font-Inter text-sm`}
        cutText={16}
      />
    )
  );

  return (
    <div>
      <div>
        {badges?.slice(0, 3)}
        {seeMore ? badges?.slice(3) : null}
      </div>
      {badges && badges.length > 3 && (
        <p
          className="cursor-pointer text-center text-sm"
          onClick={() => setSeeMore(!seeMore)}
        >
          {`see ${seeMore ? "less" : "more"} skills`}
          <span>
            {seeMore ? (
              <ChevronUpIcon width={16} className="ml-2 inline" />
            ) : (
              <ChevronDownIcon width={16} className="ml-2 inline" />
            )}
          </span>
        </p>
      )}
    </div>
  );
};

export const RoleSmallCard = ({
  role,
  skills,
  avatars,
  isSelected,
  handleEdit,
  onClick,
}: RoleSmallCardProps) => {
  return (
    <button className="flex h-full w-full items-center" onClick={onClick}>
      <Card
        border
        focused={isSelected}
        shadow
        className="h-full w-full overflow-hidden bg-white p-0"
      >
        <div className="flex cursor-pointer flex-col items-start justify-start px-3 py-2">
          {handleEdit && (
            <PencilIcon
              width={20}
              className="text-soilGray absolute right-1 top-2 cursor-pointer hover:text-slate-400"
              onClick={(e) => {
                e.preventDefault();
                handleEdit!();
              }}
            />
          )}
          <TextHeading3 className="font-poppins text-sm font-semibold">
            {role?.title}
          </TextHeading3>
          {skills && (
            <div>
              <SkillListForRole skills={skills} colorRGB="255, 255, 210" />
            </div>
          )}
        </div>
        {avatars && (
          <div className="scrollbar-hide overflow-x-scroll px-2">
            <AvatarList avatars={avatars} />
          </div>
        )}
      </Card>
    </button>
  );
};
