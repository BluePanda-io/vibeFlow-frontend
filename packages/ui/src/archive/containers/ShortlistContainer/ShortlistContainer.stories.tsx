import { getMatchingMemberArray } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ShortlistContainer } from "./ShortlistContainer";

export default {
  title: "Archive/Containers/ShortlistContainer",
  component: ShortlistContainer,
  argTypes: {},
} as ComponentMeta<typeof ShortlistContainer>;

const Template: ComponentStory<typeof ShortlistContainer> = (args) => (
  <ShortlistContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  matchingMembers: getMatchingMemberArray(10),
};
