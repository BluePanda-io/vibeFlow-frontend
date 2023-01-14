// import { render } from "../../../utils/jest-apollo";
import { MockedProvider } from "@apollo/client/testing";
import { getMember } from "@eden/package-mock";
import { render } from "@testing-library/react";

import { EditProfileOnboardPartyCard } from ".";

describe("EditProfileOnboardPartyCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MockedProvider>
        <EditProfileOnboardPartyCard
          currentUser={getMember()}
          handleUpdateUser={function (): void {
            throw new Error("Function not implemented.");
          }}
          handleSetSkills={function (): void {
            throw new Error("Function not implemented.");
          }}
          handleDeleteSkill={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MockedProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
