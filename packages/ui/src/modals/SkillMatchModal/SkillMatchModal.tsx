/* eslint-disable camelcase */
import { Modal, Charts } from "@eden/package-ui";
import { useState } from "react";
import { Maybe, RoleType, TeamType } from "@eden/package-graphql/generated";

export interface SkillMatchModalProps {
  isModalOpen?: boolean;
  chartData?: Array<any>;
  budget?: number;
  avaiability?: number;
  projectCost?: string;
  yourCost?: string;
  projectHr?: number;
  yourHr?: number;
  matchingPercentage?: number;
}
export const SkillMatchModal: React.FC<SkillMatchModalProps> = ({
  isModalOpen,
  chartData,
  budget,
  avaiability,
  projectCost,
  yourCost,
  projectHr,
  yourHr,
  matchingPercentage,
}) => {
  const [unpaid, setUnpaid] = useState(false);
  return (
    <Modal open={isModalOpen}>
      <div>
        <Charts
          data={chartData!}
          color="#FF7E5C"
          title="Skill Match Percentage"
        />
      </div>
      <div className="p-4">
        <div className="items-between flex flex-row content-between justify-between">
          <div className="flex flex-row">
            <div className="flex flex-col content-between items-start justify-start">
              <div>
                <div className="text-3xl font-semibold text-amber-500">
                  {budget} %
                </div>
                <div className="text-base font-semibold text-amber-500">
                  Budget
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold text-amber-500">
                  {avaiability} %
                </div>
                <div className="text-base font-semibold text-amber-500">
                  Avaiability
                </div>
              </div>
              <div className="mt-2">
                <div className="text-3xl font-semibold text-amber-500">
                  {avaiability} %
                </div>
                <div className="text-base font-semibold text-amber-500">
                  Something
                </div>
              </div>
            </div>
            <div className="ml-3 flex flex-col content-start items-start justify-start">
              <div className="mt-2">
                <div>
                  <span className="text-base font-bold tracking-wide">
                    Project:
                  </span>
                  <span className="text-base font-medium tracking-wide">
                    {" "}
                    {projectCost}/hour
                  </span>
                </div>
                <div>
                  <span className="text-base font-bold tracking-wide">
                    You:
                  </span>
                  <span className="text-base font-medium tracking-wide">
                    {" "}
                    {yourCost}/hour
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <span className="text-base font-bold tracking-wide">
                    Project:
                  </span>
                  <span className="text-base font-medium tracking-wide">
                    {" "}
                    {projectHr}h a week
                  </span>
                </div>
                <div>
                  <span className="text-base font-bold tracking-wide">
                    You:
                  </span>
                  <span className="text-base font-medium tracking-wide">
                    {" "}
                    {yourHr}h a week
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col content-center items-center justify-center">
              <div className="border-soilPurple flex content-center items-center justify-center rounded-full border-4 px-8 py-11">
                <span className="text-soilPurple text-3xl font-semibold">
                  {matchingPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
