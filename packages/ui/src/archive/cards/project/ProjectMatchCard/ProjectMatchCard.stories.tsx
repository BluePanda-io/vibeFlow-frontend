/* eslint-disable camelcase */
import { getMatchSkillsToProjectsOutputMock } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ProjectMatchCard } from "./ProjectMatchCard";

export default {
  title: "Archive/Cards/Project/ProjectMatchCard",
  component: ProjectMatchCard,
  argTypes: {},
} as ComponentMeta<typeof ProjectMatchCard>;

const Template: ComponentStory<typeof ProjectMatchCard> = (args) => (
  <ProjectMatchCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  matchProject: getMatchSkillsToProjectsOutputMock(),
};
