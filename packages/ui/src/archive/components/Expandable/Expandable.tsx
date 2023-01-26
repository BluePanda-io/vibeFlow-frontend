/* eslint-disable camelcase */
import { useQuery } from "@apollo/client";
import { FIND_SKILL_BY_CATEGORIES } from "@eden/package-graphql";
import {
  Maybe,
  Skills,
  SkillType_Member,
} from "@eden/package-graphql/generated";
import { Button } from "@eden/package-ui";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";

type LevelProp = {
  title: string;
  level: string;
};

type ExpandableProps = {
  category: string;
  skills?: Maybe<SkillType_Member>[];
  allSkills?: Skills[];
  isOpen?: boolean;
  selected: string | null;
  setSkills?: any;
  setIsOpen?: any;
  setSelected?: any;
  id: string;
  query: string;
  // setExpanding?: any;
  levels?: LevelProp[];
  isExpandingOpenByDefault?: boolean;
};

export const Expandable = ({
  category,
  skills,
  isOpen,
  selected,
  allSkills,
  setSkills,
  setIsOpen,
  setSelected,
  id,
  query,
  // setExpanding,
  levels,
  isExpandingOpenByDefault = false,
}: ExpandableProps) => {
  const [isExandingOpen, setIsExpandingOpen] = useState<boolean>(
    isExpandingOpenByDefault
  );
  const [idSelected, setIdSelected] = useState<string | null>(null);

  const useGetSkills = (id: string) => {
    const { data: allSkillsByCategory } = useQuery(FIND_SKILL_BY_CATEGORIES, {
      variables: {
        fields: { _id: id },
      },
      skip: !id,
    });

    return allSkillsByCategory
      ? allSkillsByCategory.findSkillSubCategory?.skills
      : [];
  };

  const fetchedSkills = useGetSkills(idSelected!);

  return (
    <div className="w-full">
      <div
        onClick={() => {
          setIsExpandingOpen(!isExandingOpen);
          if (query === "") {
            setIdSelected(id);
          }
        }}
        className="flex w-full cursor-pointer items-center justify-between bg-[#EDF2F7] px-3 py-2 text-sm"
      >
        {category}
        <p className="text-xs font-medium underline">
          {isExandingOpen ? "HIDE" : "SHOW"}
        </p>
      </div>
      {isExandingOpen &&
        (query === ""
          ? fetchedSkills
          : allSkills?.filter(
              (s: any) => s.subCategorySkill[0].name === category
            )
        )?.map((item: any) => (
          <div
            onClick={() => {
              if (
                skills!.filter((s) => s?.skillInfo?._id === item._id).length > 0
              ) {
                return;
              } else {
                setSelected(item._id);
                setIsOpen(true);
                if (selected) {
                  setSelected(null);
                  //   // setIsOpen(false);
                }
              }
            }}
            className="p-2"
            key={item._id}
          >
            <div
              className={`flex ${
                selected === item._id ? "-mx-2 bg-[#EDF2F7] px-2" : "bg-white"
              } group cursor-pointer items-center justify-between`}
            >
              <span className="w-3/4 px-2 text-sm text-slate-700 group-hover:text-slate-500">
                {item.name}
              </span>
              {skills!.filter((s) => s?.skillInfo?._id === item._id).length >
                0 && <CheckCircleIcon color="rgb(116, 250, 109)" width={24} />}
            </div>

            {isOpen && selected === item._id && (
              <div className="-mx-2 bg-[#EDF2F7] px-4 pt-1 pb-2">
                <p className="mb-1 text-xs font-medium text-slate-500">
                  SKILL LEVEL
                </p>
                <div className="-ml-1 flex gap-2">
                  {levels!.map((level, index) => (
                    <Button
                      key={index}
                      // className="h-6 py-1 px-2 text-xs"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setSkills([
                          ...skills!,
                          {
                            skillInfo: {
                              _id: item._id,
                              name: item.name,
                              categorySkills: item.categorySkills,
                            },
                            level: level.level,
                          },
                        ]);
                        // setIsOpen(false);
                        setSelected(null);
                      }}
                      variant="secondary"
                    >
                      {level.title.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
