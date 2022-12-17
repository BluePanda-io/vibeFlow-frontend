/* eslint-disable camelcase */
import { ProjectMatchType } from "@eden/package-graphql/generated";

import { getRoleTypeMock } from "../typeMocks/RoleTypeMock";
import { getProject } from "./ProjectMock";

export const findProjects_RecommendedToUserMock: ProjectMatchType = {
  projectData: getProject(),
  role: getRoleTypeMock(),
  matchPercentage: 5.555555555555555,
};
