import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_PROJECT } from "@eden/package-graphql";
import {
  Maybe,
  Mutation,
  RoleTemplate,
  UpdateProjectInput,
} from "@eden/package-graphql/generated";
import {
  Button,
  Card,
  EmojiSelector,
  Loading,
  OpenPositionCard,
  TextArea,
  TextBody,
  TextField,
  TextHeading3,
} from "@eden/package-ui";
import { useContext, useState } from "react";

export const ADD_PROJECT_ROLE = gql`
  mutation ($fields: addProjectRoleInput!) {
    addProjectRole(fields: $fields) {
      _id
      title
      description
      serverID
      role {
        _id
        title
        nodes {
          nodeData {
            name
            _id
            node
          }
        }
      }
    }
  }
`;

export interface ICreateProjectTempContainerProps {
  roles?: Maybe<Array<Maybe<RoleTemplate>>>;
  projectData?: any;
  projectUIdata?: UpdateProjectInput;
  dataProject?: any;
  selectedRole?: any;
  // eslint-disable-next-line no-unused-vars
  setProjectUIdata: (val: any) => void;
  onFetchProject: () => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedRole: (val: any) => void;
}

export const CreateProjectTempContainer = ({
  projectUIdata,
  dataProject,
  selectedRole,
  setProjectUIdata,
  onFetchProject,
  setSelectedRole,
}: ICreateProjectTempContainerProps) => {
  const { selectedServerID } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  // const [projectID, setProjectID] = useState<string>("");

  const [newRoleTitle, setNewRoleTitle] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted({ updateProject }: Mutation) {
      if (!updateProject) console.log("updateProject is null");
      console.log("updateProject", updateProject);
      setSubmitting(false);
    },
  });

  const handleSave = () => {
    const field: UpdateProjectInput = {
      ...projectUIdata,
      serverID: selectedServerID,
    };

    // if (projectUIdata?._id) field._id = projectUIdata._id;
    // if (projectUIdata?.title) field.title = projectUIdata.title;
    // if (projectUIdata?.description)
    //   field.description = projectUIdata.description;

    console.log("field = ", field);

    // updateProject({
    //   variables: {
    //     fields: { ...field },
    //   },
    // });
  };

  const [addProjectRole] = useMutation(ADD_PROJECT_ROLE, {
    onCompleted({ addProjectRole }: Mutation) {
      if (!addProjectRole) console.log("addProjectRole is null");
      console.log("addProjectRole", addProjectRole);
      // setSubmitting(false);
      // refetchProject();
    },
  });

  if (submitting) return <Loading title="Saving..." />;

  return (
    <>
      <Card className="mb-8 bg-white p-6">
        <section className="mb-6 flex justify-between">
          <TextHeading3>Create New Project: 2</TextHeading3>
          <Button
            variant="primary"
            className={``}
            disabled={submitting}
            onClick={() => handleSave()}
          >
            Update Project
          </Button>
        </section>
        <section className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="col-span-1 space-y-4">
            <div className="flex justify-between p-3">
              <EmojiSelector
                size={80}
                emoji={projectUIdata?.emoji || "👋"}
                bgColor={projectUIdata?.backColorEmoji || "#ffffff"}
                onSelection={(value) =>
                  setProjectUIdata({
                    ...projectUIdata,
                    emoji: value,
                  })
                }
              />
              <div className="flex h-[80px] w-[80px] items-center overflow-hidden rounded-full border-2 border-zinc-400/50">
                <input
                  type="color"
                  className="-m-2 h-[100px] w-[100px] cursor-pointer"
                  value={projectUIdata?.backColorEmoji || "#ffffff"}
                  onChange={(e) =>
                    setProjectUIdata({
                      ...projectUIdata,
                      backColorEmoji: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <TextField
              name="textfield"
              label="Title:"
              type="text"
              value={projectUIdata?.title || ""}
              onChange={(e) =>
                setProjectUIdata({
                  ...projectUIdata,
                  title: e.target.value,
                })
              }
            />
            <TextField
              name="textfield"
              label="Project One-Liner:"
              type="text"
              value={projectUIdata?.descriptionOneLine || ""}
              onChange={(e) =>
                setProjectUIdata({
                  ...projectUIdata,
                  descriptionOneLine: e.target.value,
                })
              }
            />
            <TextArea
              label="Description :"
              value={projectUIdata?.description || ""}
              onChange={(e) =>
                setProjectUIdata({
                  ...projectUIdata,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="col-span-1">
            <div className="justify-around">
              <br />
              <TextBody>Project ID:</TextBody>
              <div className={`flex justify-center space-x-4`}>
                <TextField
                  name="textfield"
                  type="text"
                  value={projectUIdata?._id || ""}
                  onChange={(e) =>
                    setProjectUIdata({
                      ...projectUIdata,
                      _id: e.target.value,
                    })
                  }
                />
              </div>
              <br />

              <Button
                variant="primary"
                className={``}
                disabled={submitting}
                onClick={() => {
                  console.log("change = -------0-000");
                  onFetchProject();
                  console.log("dataProject = ", dataProject);
                }}
              >
                Find Project
              </Button>
            </div>
          </div>
        </section>

        <div className={`scrollbar-hide flex flex-grow overflow-y-scroll`}>
          <div
            className={`grid grow grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3`}
          >
            {dataProject?.findProject?.role ? (
              <>
                {dataProject?.findProject?.role?.map(
                  (role: any, index: any) => {
                    const roleSkills: any = {};

                    roleSkills.title = role.title;

                    if (selectedRole == index) {
                      roleSkills.skills = [
                        {
                          skillData: {
                            _id: "637ad5a6f0f9c427e03a03a8",
                            name: "Selected",
                          },
                        },
                      ];
                    }
                    // console.log("roleSkills = ", roleSkills);
                    return (
                      <OpenPositionCard
                        key={index}
                        role={roleSkills}
                        percentage={23}
                        onApply={() => {
                          console.log("apply = ");
                          setSelectedRole(index);
                        }}
                      />
                    );
                  }
                )}

                <Card shadow border>
                  <TextBody>New Role Title:</TextBody>
                  <div className={`flex justify-center space-x-4`}>
                    <TextField
                      name="textfield"
                      type="text"
                      value={newRoleTitle}
                      onChange={(e) => setNewRoleTitle(e.target.value)}
                    />
                  </div>
                  <br />

                  <Button
                    variant="tertiary"
                    className={``}
                    disabled={submitting}
                    onClick={() => {
                      // console.log("change = -------0-000");
                      // onFetchProject();
                      // console.log("dataProject = ", dataProject);

                      addProjectRole({
                        variables: {
                          fields: {
                            projectID: projectUIdata?._id,
                            title: newRoleTitle,
                          },
                        },
                      });
                    }}
                  >
                    Create New Role
                  </Button>
                </Card>
              </>
            ) : (
              true
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
