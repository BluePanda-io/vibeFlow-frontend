/* eslint-disable camelcase */
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  ENTER_ROOM,
  FIND_ROOM,
  MATCH_NODES_MEMBERS,
  MEMBER_UPDATED_IN_ROOM_SUB,
  ROOM_UPDATED,
} from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  Maybe,
  Members,
} from "@eden/package-graphql/generated";
import {
  AppPublicLayout,
  Card,
  EditProfileOnboardPartyNodesCard,
  GridItemNine,
  GridItemThree,
  GridLayout,
  MatchAvatar,
  MemberModal,
  NodesOnboardPartyContainer,
  OnboardRoomCard,
  SEO,
  TextHeading3,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";

import type { NextPageWithLayout } from "../../_app";

const OnboardPartyPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { partyId } = router.query;

  const [members, setMembers] = useState<Members[]>([]);
  const [isRoomExist, setIsRoomExist] = useState(true);

  const { currentUser } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [serverID, setServerID] = useState<string | null>(
    "1048598413463257148"
  );

  const [selectedMember, setSelectedMember] = useState<Members | null>(null);
  const [selectedMemberPercentage, setSelectedMemberPercentage] =
    useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dataMembers, refetch: refetchMatchMembers } = useQuery(
    MATCH_NODES_MEMBERS,
    {
      variables: {
        fields: {
          nodesID: nodesID,
          // TODO: change to selectedServer
          serverID: serverID,
        },
      },
      skip: !nodesID || !serverID,
      context: { serviceName: "soilservice" },
    }
  );

  useEffect(() => {
    if (currentUser && currentUser.nodes) {
      const nodesID = currentUser?.nodes.map((node) => node?.nodeData?._id);

      setNodesID(nodesID as string[]);
    }
  }, [currentUser]);

  // if (dataMembers) console.log("dataMembers", dataMembers?.matchNodesToMembers);

  const { data: dataRoom } = useQuery(FIND_ROOM, {
    variables: {
      fields: {
        _id: partyId,
      },
    },
    skip: !partyId,
    context: { serviceName: "soilservice" },
  });

  const { data: dataRoomSubscription } = useSubscription(ROOM_UPDATED, {
    variables: {
      fields: { _id: partyId },
    },
    skip: !partyId,
    context: { serviceName: "soilservice" },
  });

  const membersIds: Array<string> = dataRoomSubscription
    ? dataRoomSubscription.roomUpdated.members.map(
        (member: Members) => member._id
      )
    : dataRoom?.findRoom?.members.map((member: Members) => member._id);

  useSubscription(MEMBER_UPDATED_IN_ROOM_SUB, {
    variables: {
      fields: { _id: partyId },
    },
    skip: !partyId,
    context: { serviceName: "soilservice" },
    onData: ({ data }) => {
      const newMemberData = data?.data?.memberUpdatedInRoom;

      setMembers(
        members.map((member: Members) => {
          if (member._id !== newMemberData?._id) return member;
          return newMemberData;
        })
      );
    },
  });

  const [enterRoom] = useMutation(ENTER_ROOM, {
    onCompleted: () => {
      console.log("enterRoom completed");
    },
    onError: (error) => {
      console.log("error", error);
      if (error) setIsRoomExist(false);
    },
  });

  useEffect(() => {
    // if user logged in and not in party, add currentUser to party
    if (!currentUser || !partyId) return;
    if (
      partyId &&
      !!membersIds?.length &&
      currentUser &&
      membersIds.some((id) => id === currentUser?._id)
    ) {
      return;
    }
    if (!isRoomExist) return;
    enterRoom({
      variables: {
        fields: {
          roomID: partyId,
          memberID: currentUser?._id,
        },
      },
      context: { serviceName: "soilservice" },
    });
  }, [currentUser, membersIds, partyId]);

  // Custom query with only members basic data and skills
  useQuery(
    gql`
      query ($fields: findMembersInput) {
        findMembers(fields: $fields) {
          _id
          discordAvatar
          discordName
          bio
          links {
            name
            url
          }
          memberRole {
            _id
            title
          }
          nodes {
            nodeData {
              _id
              name
              node
            }
          }
        }
      }
    `,
    {
      variables: {
        fields: {
          _id: membersIds,
        },
      },
      skip: !membersIds || members.length === membersIds.length,
      context: { serviceName: "soilservice" },
      onCompleted: (data) => {
        if (data) {
          setMembers(data.findMembers);
        }
      },
    }
  );

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemThree>
          <div className={`lg:h-85 mb-8 flex flex-col gap-4 lg:mb-0`}>
            <OnboardRoomCard />
            {!currentUser ? (
              <p>
                You must be logged in to edit your profile.
                <br />
                If you can&rsquo;t log in ask the onboarder for help
              </p>
            ) : (
              <EditProfileOnboardPartyNodesCard
                serverID={serverID as string}
                RoomID={partyId as string}
              />
            )}
          </div>
        </GridItemThree>
        <GridItemNine>
          <div className={`lg:h-85 flex flex-col gap-4`}>
            <Card shadow className={`bg-white p-4`}>
              <div className={``}>
                <TextHeading3>Best people for you to meet:</TextHeading3>

                <div className={`text-sm text-zinc-500`}>
                  Powered by Eden AI
                </div>
                <div className={`mt-2 flex flex-wrap`}>
                  {dataMembers?.matchNodesToMembers &&
                    dataMembers?.matchNodesToMembers.map(
                      (
                        member: Maybe<MatchMembersToSkillOutput>,
                        index: number
                      ) => {
                        return (
                          <div key={index} className={``}>
                            {currentUser?._id !== member?.member?._id &&
                              index < 7 && (
                                <div
                                  className={`mx-2 flex-col justify-center text-center`}
                                >
                                  <div className={`mx-4`}>
                                    <button
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setSelectedMember(
                                          member?.member as Members
                                        );
                                        setSelectedMemberPercentage(
                                          member?.matchPercentage
                                            ?.totalPercentage as number
                                        );
                                      }}
                                    >
                                      <MatchAvatar
                                        src={
                                          member?.member
                                            ?.discordAvatar as string
                                        }
                                        percentage={
                                          member?.matchPercentage
                                            ?.totalPercentage as number
                                        }
                                        size={`md`}
                                      />
                                    </button>
                                  </div>

                                  <div className={`font-medium text-zinc-500`}>
                                    @{member?.member?.discordName}
                                  </div>
                                  <div
                                    className={`text-xs font-medium text-zinc-600`}
                                  >
                                    {member?.member?.memberRole?.title}
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      }
                    )}
                  {currentUser?.nodes?.length === 0 && (
                    <TextHeading3 className={`text-blue-700`}>
                      Add Skills and Preferred Projects on Your Profile to find
                      best matches
                    </TextHeading3>
                  )}
                  {currentUser?.nodes?.length !== 0 && (
                    <button
                      onClick={() => refetchMatchMembers()}
                      className={`mx-4`}
                    >
                      <BiRefresh className="text-3xl text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
              <MemberModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                member={selectedMember}
                percentage={selectedMemberPercentage}
              />
            </Card>

            <NodesOnboardPartyContainer members={members} />
          </div>
        </GridItemNine>
      </GridLayout>
    </>
  );
};

OnboardPartyPage.getLayout = (page) => (
  <AppPublicLayout>{page}</AppPublicLayout>
);

export default OnboardPartyPage;
