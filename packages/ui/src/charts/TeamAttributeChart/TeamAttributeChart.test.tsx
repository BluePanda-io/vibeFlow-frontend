import { render } from "@testing-library/react";

import { TeamAttributeChart } from ".";
import { mockTeamData } from "./mockData";

describe("TeamAttributeChart", () => {
  it("renders without throwing an error", () => {
    const { container } = render(<TeamAttributeChart members={mockTeamData} />);

    expect(container).toBeInTheDocument();
  });
});
