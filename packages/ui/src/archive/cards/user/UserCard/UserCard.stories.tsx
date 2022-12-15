import { getMember } from "@eden/package-mock";
import { faker } from "@faker-js/faker";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserCard } from "./UserCard";

export default {
  title: "Cards/User/UserCard",
  component: UserCard,
  argTypes: {},
} as ComponentMeta<typeof UserCard>;

const Template: ComponentStory<typeof UserCard> = (args) => (
  <UserCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  member: getMember(),
  percentage: Number(faker.random.numeric(2)),
  endorsements: Number(faker.random.numeric(2)),
  focused: false,
  engagedCard: false,
};
