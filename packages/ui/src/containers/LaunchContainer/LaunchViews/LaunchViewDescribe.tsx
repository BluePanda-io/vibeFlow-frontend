import { LaunchContext } from "@eden/package-context";
import { useContext } from "react";
import { TextArea } from "ui";

export const LaunchViewDescribe = () => {
  const { projectDescription, setProjectDescription } =
    useContext(LaunchContext);

  return (
    <div className={`p-6`}>
      <div
        className={`font-poppins text-darkGreen text-center text-2xl font-medium`}
      >
        DESCRIBE YOUR PROJECT
      </div>
      <TextArea
        placeholder={`Start typing here`}
        rows={8}
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />
    </div>
  );
};
