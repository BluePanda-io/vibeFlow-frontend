// import { useQuery } from "@apollo/client";
// import { UserContext } from "@eden/package-context";
// import {
//   FIND_PROJECTS,
//   FIND_PROJECTS_RECOMMENDED,
// } from "@eden/package-graphql";
import {
  AppUserSubmenuLayout,
  Card,
  // GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
} from "@eden/package-ui";

// import { useContext } from "react";
import type { NextPageWithLayout } from "../_app";

const ProjectsPage: NextPageWithLayout = () => {
  //   const { currentUser } = useContext(UserContext);

  // if (currentUser) console.log("currentUser", currentUser);

  //   const { data: dataProjectsAll } = useQuery(FIND_PROJECTS, {
  //     variables: {
  //       fields: {},
  //     },
  //     context: { serviceName: "soilservice" },
  //   });

  // if (dataProjectsAll) console.log("dataProjectsAll", dataProjectsAll);

  //   const { data: dataProjectsRecommended } = useQuery(
  //     FIND_PROJECTS_RECOMMENDED,
  //     {
  //       variables: {
  //         fields: {
  //           memberID: currentUser?._id,
  //         },
  //       },
  //       skip: !currentUser,
  //       context: { serviceName: "soilservice" },
  //     }
  //   );

  return (
    <GridLayout>
      <GridItemThree>
        <div className={`h-85 flex flex-col gap-4`}>
          <Card className="flex flex-grow bg-blue-300 p-6"></Card>
          <Card className="flex h-44 flex-grow bg-white p-6"></Card>
        </div>
      </GridItemThree>
      <GridItemSix>
        <Card className="h-85 bg-white p-6"></Card>
      </GridItemSix>
      <GridItemThree>
        <Card className="bg-white p-6"></Card>
      </GridItemThree>

      {/* <GridItemNine>
        <Card className="bg-white p-6"></Card>
      </GridItemNine>
      <GridItemThree>
        <Card className="bg-white p-6"></Card>
      </GridItemThree> */}
    </GridLayout>
  );
};

ProjectsPage.getLayout = (page) => (
  <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
);

export default ProjectsPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
