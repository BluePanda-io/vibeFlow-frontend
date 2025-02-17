import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  EmployeeType,
  EmployeeTypeInput,
} from "@eden/package-graphql/generated";
import { Button, SaasUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import { toast } from "react-toastify";

import { NextPageWithLayout } from "../_app";

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        status
        user {
          _id
          discordName
        }
      }
    }
  }
`;

const ADD_EMPLOYEES_COMPANY = gql`
  mutation ($fields: addEmployeesCompanyInput!) {
    addEmployeesCompany(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        user {
          _id
          discordName
        }
      }
    }
  }
`;

const RequestAccess: NextPageWithLayout = () => {
  const router = useRouter();
  const companySlug = router.query.company;
  const { currentUser } = useContext(UserContext);

  const { data: findCompanyData } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: companySlug,
      },
    },
    onError() {
      toast.error("Server error");
    },
  });

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onError() {
      toast.error("Server error");
    },
  });

  const handleRequestAccessClick = () => {
    addEmployeesCompany({
      variables: {
        fields: {
          companyID: findCompanyData.findCompanyFromSlug._id,
          employees: [
            { typeT: "EMPLOYEE", status: "PENDING", userID: currentUser!._id },
          ] as EmployeeTypeInput[],
        },
      },
    });
  };

  const isEmployee = () => {
    if (!findCompanyData) return false;
    return findCompanyData?.findCompanyFromSlug?.employees.some(
      (employee: EmployeeType) => employee.user?._id === currentUser?._id
    );
  };

  return (
    <>
      <div className="mb-1 flex h-screen w-full flex-col items-center justify-center space-y-2">
        {isEmployee() ? (
          <p className="my-4 font-bold">
            You already requested access to this company
          </p>
        ) : (
          <>
            <Image
              className=" mt-16"
              alt="sleeping dashboard"
              src="/sleeping-dashboard.png"
              width={216}
              height={83}
            ></Image>

            <p className="my-4 font-bold">
              You do not have access to this page!
            </p>

            {findCompanyData && currentUser && (
              <Button
                variant="primary"
                className="font-Unica  mt-4 h-12  w-36  border-neutral-400 font-medium text-black "
                onClick={handleRequestAccessClick}
              >
                <p className="text-sm">Request Access</p>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

RequestAccess.getLayout = (page: any) => (
  <SaasUserLayout>{page}</SaasUserLayout>
);

export default RequestAccess;
