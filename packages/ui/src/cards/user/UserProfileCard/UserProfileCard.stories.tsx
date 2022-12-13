import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserProfileCard } from "./UserProfileCard";

export default {
  title: "Cards/User/UserProfileCard",
  component: UserProfileCard,
  argTypes: {},
} as ComponentMeta<typeof UserProfileCard>;

const Template: ComponentStory<typeof UserProfileCard> = (args) => (
  <UserProfileCard {...args} />
);

export const Default = Template.bind({});
Default.args = {};
