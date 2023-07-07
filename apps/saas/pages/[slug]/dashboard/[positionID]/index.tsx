import { gql, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_NEW_TALENT_LIST,
  FIND_POSITION_LIGHT,
  MATCH_NODES_MEMBERS_AI4,
  UPDATE_TALENT_LIST_WITH_TALENT,
} from "@eden/package-graphql";
import { CandidateType, TalentListType } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Button,
  CandidateInfo,
  CandidatesTableList,
  ListModeEnum,
  Loading,
  Modal,
  SelectList,
  TextField,
  TrainQuestionsEdenAI,
} from "@eden/package-ui";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HiOutlineLink } from "react-icons/hi";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { MdCompare, MdIosShare } from "react-icons/md";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";

import { NextPageWithLayout } from "../../../_app";

const CREATE_FAKE_USER_CV = gql`
  mutation CreateFakeUserCVnew($fields: createFakeUserCVnewInput) {
    createFakeUserCVnew(fields: $fields) {
      _id
      discordName
      discordAvatar
    }
  }
`;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

type Grade = {
  letter: string;
  color: string;
};

interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
  skillScore: number;
  letterAndColor?: {
    totalMatchPerc?: Grade;
    culture?: Grade;
    skill?: Grade;
    requirements?: Grade;
  };
}

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

const PositionCRM: NextPageWithLayout = () => {
  const router = useRouter();
  const { positionID, slug } = router.query;

  const [approvedTalentListID, setApprovedTalentListID] = useState<string>("");
  const [rejectedTalentListID, setRejectedTalentListID] = useState<string>("");

  const [
    approvedTalentListCandidatesList,
    setApprovedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [
    rejectedTalentListCandidatesList,
    setRejectedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [quickActionButtonUsed, setQuickActionButtonUsed] =
    useState<boolean>(false);

  const [candidatesOriginalList, setCandidatesOriginalList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [candidatesUnqualifiedList, setCandidatesUnqualifiedList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [nodeIDsPosition, setNodeIDsPosition] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] =
    useState<number | null>(null);
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [talentListsAvailables, setTalentListsAvailables] = useState<
    TalentListType[]
  >([]);

  const [talentListSelected, setTalentListSelected] =
    useState<TalentListType>();

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [addToListOpen, setAddToListOpen] = useState<boolean>(false);

  const [newTalentListCandidatesIds, setNewTalentListCandidatesIds] = useState<
    string[]
  >([]);

  const [talentListToShow, setTalentListToShow] = useState<TalentListType>();

  const [newTalentListNameInputOpen, setNewTalentListNameInputOpen] =
    useState<boolean>(false);

  const [newTalentListName, setNewTalentListName] = useState<string>("");

  const {
    data: findPositionData,
    loading: findPositionIsLoading,
    // error: findPositionError,
  } = useQuery(FIND_POSITION_LIGHT, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !Boolean(positionID),
    ssr: false,
    onCompleted: (data: any) => {
      const talentListsNames: TalentListType[] =
        data.findPosition.talentList.map((list: TalentListType) => list);

      setTalentListsAvailables(talentListsNames);

      if (
        data.findPosition.candidates.length > 0 &&
        (data.findPosition.candidates[0]?.totalMatchPerc === undefined ||
          (data.findPosition.candidates[0]?.flagSkill !== true &&
            data.findPosition.candidates[0]?.skillMatch !== undefined))
      ) {
        // calculate the average score of the percentages for each candidatesList and save it on setCandidatesList
        const candidatesListWithSkillMatch = data.findPosition.candidates.map(
          (candidate: any) => {
            let totalMatchPerc = 0;
            let totalMatchPercCount = 0;

            let letterAndColor = {};

            let flagSkill = false;

            if (
              candidate?.skillMatch != undefined &&
              candidate?.skillMatch > 0
            ) {
              totalMatchPerc += candidate.skillMatch;
              totalMatchPercCount++;
              flagSkill = true;

              letterAndColor = {
                ...letterAndColor,
                skill: getGrade(candidate.skillMatch, false),
              };
            }

            if (candidate?.overallScore) {
              totalMatchPerc += candidate.overallScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                culture: getGrade(candidate.overallScore, false),
              };
            }

            if (candidate?.skillScore) {
              totalMatchPerc += candidate.skillScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                skill: getGrade(candidate.skillScore, false),
              };

              // candidate.skillMatch = candidate.skillScore;
            }

            if (
              candidate?.compareCandidatePosition
                ?.CV_ConvoToPositionAverageScore
            ) {
              totalMatchPerc +=
                candidate?.compareCandidatePosition
                  ?.CV_ConvoToPositionAverageScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                requirements: getGrade(
                  candidate?.compareCandidatePosition
                    ?.CV_ConvoToPositionAverageScore,
                  false
                ),
              };
            }

            totalMatchPerc = totalMatchPerc / totalMatchPercCount;

            totalMatchPerc = parseInt(totalMatchPerc.toFixed(1));

            letterAndColor = {
              ...letterAndColor,
              totalMatchPerc: getGrade(totalMatchPerc, true),
            };

            return {
              ...candidate,
              totalMatchPerc,
              flagSkill: flagSkill,
              letterAndColor,
            };
          }
        );

        // sort the candidatesList by the totalMatchPerc
        const sortedCandidatesList = candidatesListWithSkillMatch.sort(
          (a: any, b: any) => {
            if (a.totalMatchPerc > b.totalMatchPerc) {
              return -1;
            }
            if (a.totalMatchPerc < b.totalMatchPerc) {
              return 1;
            }
            return 0;
          }
        );

        // setCandidatesList(sortedCandidatesList);

        setCandidatesOriginalList(sortedCandidatesList);

        setCandidatesFromTalentList(sortedCandidatesList);

        const rejectedCandidatesIDs = data.findPosition.talentList.find(
          (list: TalentListType) => list.name === "Rejected"
        )?.talent.length
          ? data.findPosition.talentList
              .find((list: TalentListType) => list.name === "Rejected")
              ?.talent.map((candidate: any) => candidate?.user?._id)
          : [];

        const approvedCandidatesIDs = data.findPosition.talentList.find(
          (list: TalentListType) => list.name === "Accepted"
        )?.talent.length
          ? data.findPosition.talentList
              .find((list: TalentListType) => list.name === "Accepted")
              ?.talent.map((candidate: any) => candidate?.user?._id)
          : [];

        setCandidatesUnqualifiedList(
          sortedCandidatesList
            .filter(
              (candidate: any) =>
                !rejectedCandidatesIDs.includes(candidate.user._id)
            )
            .filter(
              (candidate: any) =>
                !approvedCandidatesIDs.includes(candidate.user._id)
            )
        );

        if (findPositionData?.findPosition?.talentList) {
          setApprovedTalentListID(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Accepted"
            )?._id
          );

          setApprovedTalentListCandidatesList(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Accepted"
            )?.talent
          );

          setRejectedTalentListID(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Rejected"
            )?._id
          );

          setRejectedTalentListCandidatesList(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Rejected"
            )?.talent
          );
        }
      }

      const questionPrep: Question[] = [];

      data.findPosition.questionsToAsk.map((question: any) => {
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });

      const nodesID = data.findPosition?.nodes?.map((node: any) => {
        return node?.nodeData?._id;
      });

      setNodeIDsPosition(nodesID);

      setQuestions(questionPrep);
    },
  });

  useEffect(() => {
    if (talentListToShow && talentListsAvailables.length) {
      setTalentListSelected(talentListToShow);
      // setNewTalentListName(talentListToShow?.name!);
    }
  }, [talentListToShow, talentListsAvailables]);

  const handleRowClick = (user: CandidateTypeSkillMatch) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.overallScore) setSelectedUserScore(user.overallScore);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);
  };

  const [updateSkillScore, setUpdateSkillScore] = useState<boolean>(false);

  // eslint-disable-next-line no-unused-vars
  const getGrade = (percentage: number, mainColumn: boolean): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 85) {
      grade = { letter: "A", color: "text-green-600" };
    } else if (percentage >= 70) {
      grade = { letter: "B", color: "text-green-300" };
    } else if (percentage >= 50) {
      grade = { letter: "C", color: "text-orange-300" };
      // if (mainColumn) grade = { letter: "C", color: "text-orange-300" };
      // else grade = { letter: "C", color: "text-black" };
    } else {
      grade = { letter: "D", color: "text-red-300" };
      // if (mainColumn) grade = { letter: "D", color: "text-red-300" };
      // else grade = { letter: "D", color: "text-black" };
    }

    return grade;
  };

  const [mostRelevantMemberNode, setMostRelevantMemberNode] =
    useState<relevantNodeObj>({});

  const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
    variables: {
      fields: {
        nodesID: nodeIDsPosition,
        positionID: positionID,
        membersIDallow: candidatesFromTalentList?.map((userData: any) => {
          return userData?.user?._id;
        }),
        weightModules: [
          { type: "node_Skill", weight: 70 },
          { type: "node_Category", weight: 20 },
          { type: "node_Group", weight: 5 },
          { type: "node_total", weight: 50 },
          { type: "budget_total", weight: 80 },
          { type: "availability_total", weight: 85 },
          { type: "experience_total", weight: 85 },
          { type: "everythingElse_total", weight: 50 },
        ],
      },
    },
    skip:
      // !findPositionData?.findPosition ||
      // candidatesFromTalentList.length == 0 ||
      // nodeIDsPosition.length == 0,
      updateSkillScore == false,

    onCompleted: (data) => {
      // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

      setUpdateSkillScore(false);

      // -------------- Get the Candidates of the page ------------
      const memberScoreObj: { [key: string]: number } = {};

      data.matchNodesToMembers_AI4.forEach((memberT: any) => {
        const keyN = memberT?.member?._id;

        if (memberScoreObj[keyN] == undefined) {
          memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
        }
      });

      const candidatesNew: CandidateTypeSkillMatch[] = [];

      for (let i = 0; i < candidatesFromTalentList.length; i++) {
        const userID = candidatesFromTalentList[i]?.user?._id;

        if (userID && memberScoreObj[userID]) {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
            skillMatch: memberScoreObj[userID],
          });
        } else {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
          });
        }
      }

      const _candidatesNew = candidatesNew.map((candidate: any) => {
        const _candidateWithSkillLetter = {
          ...candidate,
          letterAndColor: {
            ...candidate.letterAndColor,
            skill: getGrade(candidate.skillMatch, false),
          },
        };

        return _candidateWithSkillLetter;
      });

      const rejectedCandidatesIDs = rejectedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      const approvedCandidatesIDs = approvedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      setCandidatesUnqualifiedList(
        _candidatesNew
          .filter(
            (candidate: any) =>
              !rejectedCandidatesIDs.includes(candidate.user._id)
          )
          .filter(
            (candidate: any) =>
              !approvedCandidatesIDs.includes(candidate.user._id)
          )
      );

      // setCandidates(_candidatesNew);
      setCandidatesFromTalentList(_candidatesNew);

      // -------------- Get the Candidates of the page ------------

      // --------------- Find the related nodes Score and color -----------

      const mostRelevantMemberNodeT: relevantNodeObj = {};

      for (let i = 0; i < data?.matchNodesToMembers_AI4?.length; i++) {
        const infoN = data.matchNodesToMembers_AI4[i];

        const userID: string = infoN?.member?._id;

        if (userID && !mostRelevantMemberNodeT[userID]) {
          mostRelevantMemberNodeT[userID] = {
            nodes: [],
          };
        }

        const nodesPercentageT = infoN?.nodesPercentage;

        const nodesNew: NodeDisplay[] = [];

        interface RelevantMemberObj {
          [key: string]: boolean;
        }
        const mostRelevantMemberObj: RelevantMemberObj = {};

        const mostRelevantMemberNodes = [];

        for (let j = 0; j < nodesPercentageT?.length; j++) {
          const node = nodesPercentageT[j];

          // Take only the first mostRelevantMemberNodes, which has the heighers probability, later I can be more creative
          let mostRelevantMemberNode = null;

          if (
            node?.mostRelevantMemberNodes != undefined &&
            node?.mostRelevantMemberNodes?.length > 0
          ) {
            let i = 0;
            let relNode;

            while (
              mostRelevantMemberNode == null &&
              i < node?.mostRelevantMemberNodes.length
            ) {
              relNode = node?.mostRelevantMemberNodes[i];

              if (
                relNode?.node?._id != undefined &&
                !mostRelevantMemberObj[relNode?.node?._id]
              ) {
                mostRelevantMemberNode = relNode;
                mostRelevantMemberObj[relNode?.node?._id] = true;
              } else {
                i++;
              }
            }

            if (mostRelevantMemberNode == null) continue;
          }

          let colorT = "bg-purple-100";

          if (
            mostRelevantMemberNode?.score != null &&
            mostRelevantMemberNode?.score != undefined
          ) {
            if (mostRelevantMemberNode?.score > 60) {
              colorT = "bg-purple-500";
            } else if (mostRelevantMemberNode?.score > 30) {
              colorT = "bg-purple-400";
            } else if (mostRelevantMemberNode?.score > 13) {
              colorT = "bg-purple-300";
            } else if (mostRelevantMemberNode?.score > 5) {
              colorT = "bg-purple-200";
            }
          }

          mostRelevantMemberNodes.push({
            searchNode: node?.node,
            MemberRelevantnode: mostRelevantMemberNode?.node,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });

          nodesNew.push({
            nameOriginalNode: nodesPercentageT[j]?.node?.name,
            nameRelevantNode: mostRelevantMemberNode?.node?.name,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });
        }

        nodesNew.sort((a, b) => b.score - a.score); // sort based on score

        mostRelevantMemberNodeT[userID].nodes = nodesNew;
      }

      setMostRelevantMemberNode(mostRelevantMemberNodeT);

      // --------------- Find the related nodes Score and color -----------
    },
  });

  const [
    createTalentListPosition,
    { loading: createTalentListPositionLoading },
  ] = useMutation(CREATE_NEW_TALENT_LIST);

  const [
    updateUsersTalentListPosition,
    { loading: updateUsersTalentListPositionLoading },
  ] = useMutation(UPDATE_TALENT_LIST_WITH_TALENT, {
    onCompleted: (data, clientOptions) => {
      if (!quickActionButtonUsed) {
        const workingTalentListID =
          clientOptions?.variables?.fields.talentListID ===
            approvedTalentListID ||
          clientOptions?.variables?.fields.talentListID === rejectedTalentListID
            ? "000" // this is not the actual "working talent list" per se, but is the one to be redirected to
            : clientOptions?.variables?.fields.talentListID;

        if (workingTalentListID === "000") {
          if (
            clientOptions?.variables?.fields.talentListID ===
              approvedTalentListID ||
            clientOptions?.variables?.fields.talentListID ===
              rejectedTalentListID
          ) {
            const rejectedCandidatesIDs =
              data.updateUsersTalentListPosition.talentList
                .find((list: TalentListType) => list.name === "Rejected")
                ?.talent.map((candidate: any) => candidate?.user?._id);

            const approvedCandidatesIDs =
              data.updateUsersTalentListPosition.talentList
                .find((list: TalentListType) => list.name === "Accepted")
                ?.talent.map((candidate: any) => candidate?.user?._id);

            setCandidatesUnqualifiedList(
              candidatesOriginalList
                .filter(
                  (candidate: any) =>
                    !rejectedCandidatesIDs.includes(candidate.user._id)
                )
                .filter(
                  (candidate: any) =>
                    !approvedCandidatesIDs.includes(candidate.user._id)
                )
            );
            setCandidatesFromTalentList(
              candidatesOriginalList
                .filter(
                  (candidate: any) =>
                    !rejectedCandidatesIDs.includes(candidate.user._id)
                )
                .filter(
                  (candidate: any) =>
                    !approvedCandidatesIDs.includes(candidate.user._id)
                )
            );
            setTalentListSelected({ _id: "000", name: "All candidates" });
          } else {
            setCandidatesFromTalentList(candidatesUnqualifiedList);
          }
        } else {
          const editedTalentListIndex =
            data?.updateUsersTalentListPosition.talentList.findIndex(
              (talentList: TalentListType) =>
                talentList._id === workingTalentListID
            );

          const editedTalentList =
            data?.updateUsersTalentListPosition.talentList[
              editedTalentListIndex
            ];

          const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] = [];

          for (let i = 0; i < candidatesOriginalList.length; i++) {
            for (let j = 0; j < editedTalentList?.talent?.length!; j++) {
              if (
                candidatesOriginalList[i].user?._id ===
                editedTalentList?.talent![j]!.user!._id
              ) {
                candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
              }
            }
          }

          setCandidatesFromTalentList(candidatesOnTalentListSelected);
          setTalentListSelected(editedTalentList);
          setNewTalentListCandidatesIds([]);
        }
      } else {
        const rejectedCandidatesIDs =
          data.updateUsersTalentListPosition.talentList
            .find((list: TalentListType) => list.name === "Rejected")
            ?.talent.map((candidate: any) => candidate?.user?._id);

        const approvedCandidatesIDs =
          data.updateUsersTalentListPosition.talentList
            .find((list: TalentListType) => list.name === "Accepted")
            ?.talent.map((candidate: any) => candidate?.user?._id);

        setCandidatesUnqualifiedList(
          candidatesOriginalList
            .filter(
              (candidate: any) =>
                !rejectedCandidatesIDs.includes(candidate.user._id)
            )
            .filter(
              (candidate: any) =>
                !approvedCandidatesIDs.includes(candidate.user._id)
            )
        );

        setCandidatesFromTalentList(
          candidatesOriginalList
            .filter(
              (candidate: any) =>
                !rejectedCandidatesIDs.includes(candidate.user._id)
            )
            .filter(
              (candidate: any) =>
                !approvedCandidatesIDs.includes(candidate.user._id)
            )
        );

        setTalentListSelected({ _id: "000", name: "All candidates" });
      }
      setQuickActionButtonUsed(false);
    },
  });

  const handleTrainButtonClick = () => {
    // setTrainModalOpen(true);
    router.push(`/${slug}/dashboard/${positionID}/train-eden-ai`);
  };

  const [createFakeUserCV] = useMutation(CREATE_FAKE_USER_CV);

  const handleFindBestTalentClick = () => {
    // setTrainModalOpen(true);

    createFakeUserCV({
      variables: {
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  const handleCloseTrainModal = () => {
    setTrainModalOpen(false);
  };

  const handleCalculateSkillScore = () => {
    console.log("change = 232322");

    setUpdateSkillScore(true);
  };

  const handleSelectedTalentList = (list: TalentListType) => {
    const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] = [];

    if (talentListToShow) {
      for (let i = 0; i < candidatesOriginalList.length; i++) {
        for (let j = 0; j < talentListToShow.talent!.length; j++) {
          if (
            candidatesOriginalList[i].user?._id ===
            talentListToShow.talent![j]!.user!._id
          ) {
            candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
          }
        }
      }
      setTalentListSelected(talentListToShow);
      setTalentListToShow(undefined);
    } else if (list._id !== "000") {
      for (let i = 0; i < candidatesOriginalList.length; i++) {
        for (let j = 0; j < list.talent!.length; j++) {
          if (
            candidatesOriginalList[i].user?._id === list.talent![j]!.user!._id
          ) {
            candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
          }
        }
      }
      setTalentListSelected(list);
    } else {
      candidatesOnTalentListSelected.push(...candidatesUnqualifiedList);
      setTalentListSelected({ _id: "000", name: "All candidates" });
    }

    setNewTalentListCandidatesIds([]);

    setCandidatesFromTalentList(candidatesOnTalentListSelected);
  };

  const handleCreateNewList = () => {
    setNewTalentListNameInputOpen(true);

    setAddToListOpen(false);

    // setNewTalentListCandidatesIds(
    //   candidatesOriginalList.map((c) => c.user?._id!)
    // );

    // handleSaveNewTalentList();
  };

  const handleAddCandidatesToList = async (listID: string) => {
    setAddToListOpen(false);

    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === listID)
      .talent.map((t: any) => t.user._id);

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: listID,
          usersTalentList: [
            ..._prevTalent,
            ...newTalentListCandidatesIds.filter(
              (t: any) => !_prevTalent.includes(t)
            ),
          ],
        },
      },
    });

    toast.success("Candidate added to list!");
  };

  const handleRemoveCandidatesFromList = async (listID: string) => {
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === listID)
      .talent.map((t: any) => t.user._id);

    const _filteredTalent = _prevTalent.filter(
      (t: any) => !newTalentListCandidatesIds.includes(t)
    );

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: listID,
          usersTalentList: _filteredTalent,
        },
      },
    });

    toast.success("Candidates removed from list");
  };

  const handleCopyLink = () => {
    // const url = window.location.href;
    const url = window.location.origin + "/interview/" + positionID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

  const handleCandidateCheckboxSelection = (candidate: CandidateType) => {
    setNewTalentListCandidatesIds((prev) => {
      const newCandidatesIds = [...prev];

      if (newCandidatesIds.includes(candidate.user?._id!)) {
        const index = newCandidatesIds.indexOf(candidate.user?._id!);

        newCandidatesIds.splice(index, 1);
      } else {
        newCandidatesIds.push(candidate.user?._id!);
      }

      return newCandidatesIds.filter((id) => id !== undefined || id !== null);
    });
  };

  const handleSaveNewTalentList = async () => {
    const result = await createTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          name: newTalentListName,
        },
      },
    });

    setNewTalentListNameInputOpen(false);
    setNewTalentListName("");
    const lastTalentListIndex =
      result.data?.createTalentListPosition.talentList.length - 1;

    const newTalentListID =
      result.data?.createTalentListPosition.talentList[lastTalentListIndex]._id;

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: newTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("New talent list created!");
  };

  const handleShareTalentListButton = async () => {
    const url =
      window.location.origin + "/talentlist/" + talentListSelected?._id!;

    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleRejectCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === rejectedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: rejectedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Rejected Candidates list!");
  };

  const handleApproveCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === approvedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: approvedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Approved Candidates list!");
  };

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3442218,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
      </Head>
      <Modal
        open={newTalentListNameInputOpen}
        onClose={() => setNewTalentListNameInputOpen(false)}
        title="Set your new talent list name"
        closeOnEsc
      >
        <div className="relative flex flex-col items-center space-y-6">
          <TextField
            name="newtalentlistnameinput"
            onChange={(event) => setNewTalentListName(event.target.value)}
            placeholder="Type the new talent list name"
            type="text"
          />

          <Button
            disabled={!newTalentListName.length}
            onClick={() => {
              setNewTalentListNameInputOpen(false);
              handleSaveNewTalentList();
            }}
            variant="secondary"
          >
            Save
          </Button>
        </div>
      </Modal>
      <div className="bg-background container mx-auto max-w-screen-2xl flex-grow px-2 py-4 sm:px-5">
        <div
          className={classNames(
            `z-20 transition-all duration-200 ease-in-out`,
            selectedUserId ? "w-[calc(50%-1rem)]" : "w-full"
          )}
        >
          <div className="mb-4 flex h-10 items-center">
            <h1 className="mr-6 text-2xl font-medium">
              {findPositionData && findPositionData.findPosition.name
                ? findPositionData.findPosition.name.charAt(0).toUpperCase() +
                  findPositionData.findPosition.name.slice(1)
                : ""}{" "}
              Dashboard
            </h1>
            <Button
              size="sm"
              className="bg-soilBlue border-soilBlue mr-2 flex items-center !px-1 !py-0 !text-sm text-white hover:border-[#7A98E5] hover:bg-[#7A98E5]"
              variant="default"
              onClick={handleCopyLink}
            >
              <HiOutlineLink className="mr-1" />
              interview link
            </Button>
            <Button
              size="sm"
              className="bg-soilBlue border-soilBlue mr-2 flex items-center !px-1 !py-0 !text-sm text-white hover:border-[#7A98E5] hover:bg-[#7A98E5]"
              variant="default"
              onClick={handleCalculateSkillScore}
              style={{ opacity: 0.2 }}
            >
              Calculate Skill Score
            </Button>
            {notificationOpen && (
              <span className="text-sm text-gray-400">Link copied!</span>
            )}
            <Button
              className="transition-bg relative ml-auto h-[36px] whitespace-nowrap !border-[#ff5656] pl-[16px] pr-[40px] font-bold !text-[#ff5656] duration-200 ease-in-out hover:!bg-[#ff5656] hover:!text-white hover:shadow-md hover:shadow-red-200"
              radius="pill"
              variant="secondary"
              onClick={handleTrainButtonClick}
            >
              Align with Eden
              <div className="absolute -right-[2px] -top-[2px] flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full border-2 border-[#ff5656]">
                <div className="h-[40px] w-[40px] min-w-[40px]">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
              </div>
            </Button>
            <Button
              className="transition-bg relative ml-auto h-[36px] whitespace-nowrap !border-[#007bff] pl-[16px] pr-[40px] font-bold !text-[#007bff] duration-200 ease-in-out hover:!bg-[#007bff] hover:!text-white hover:shadow-md hover:shadow-red-200"
              radius="pill"
              variant="secondary"
              onClick={handleFindBestTalentClick}
            >
              Recruit Similar Candidates
              <div className="absolute -right-[2px] -top-[2px] flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full border-2 border-[#007bff]">
                <div className="h-[40px] w-[40px] min-w-[40px]">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
              </div>
            </Button>

            {/* <Button
            variant="secondary"
            onClick={() => {
              router.push(`/train-ai/${positionID}`);
            }}
            >
            Train AI
          </Button> */}
          </div>
          <div className="">
            <div className="mb-4 flex items-center">
              <div className="mr-4 max-w-[200px]">
                {/* {!newTalentListCreationMode ? ( */}
                <SelectList
                  items={[
                    { _id: "000", name: "All candidates" },
                    ...talentListsAvailables,
                  ]}
                  onChange={handleSelectedTalentList}
                  newValue={talentListSelected ? talentListSelected : undefined}
                  // isDisabled={editTalentListMode}
                />
                {/* ) : (
                <TextField
                  onChange={handleNewTalentListNameChange}
                  placeholder="Name your custom list"
                  radius="pill-shadow"
                  required={true}
                  className="mt-0 h-[30px] !px-2 !py-1"
                />
              )} */}
              </div>
              {/* <>
              {talentListSelected?._id === "000" ? (
                !newTalentListCreationMode ? (
                  <Button
                    className=""
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNewListButton}
                  >
                    Create New List
                  </Button>
                ) : (
                  <>
                    <Button
                      className="mr-2 px-4"
                      size="sm"
                      variant="primary"
                      onClick={handleSaveNewTalentListButton}
                      disabled={
                        newTalentListName === "" ||
                        newTalentListCandidatesIds.length === 0
                      }
                    >
                      Save
                    </Button>

                    <FaTimes
                      size={26}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setNewTalentListName("");
                        setNewTalentListCandidatesIds([]);
                        setNewTalentListCreationMode(false);
                      }}
                    />
                  </>
                )
              ) : !editTalentListMode ? (
                <div className="flex"> */}
              <MdIosShare
                size={24}
                className="mr-4 cursor-pointer text-gray-900 hover:text-gray-500"
                onClick={handleShareTalentListButton}
              />
              {/* <Button
                    className="mr-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleEditTalentListButton}
                  >
                    Edit
                  </Button>
                  <Button
                    className="mr-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNewListButton}
                  >
                    Create New List
                  </Button>
                </div>
              ) : (
                <Button
                  className="mb-4 ml-auto"
                  variant="secondary"
                  onClick={handleSaveNewTalentListButton}
                  disabled={
                    newTalentListName === "" ||
                    newTalentListCandidatesIds.length === 0
                  }
                >
                  Save
                </Button>
              )}
            </> */}
              {/* <select
              name="add-to-list"
              id="add-to-list"
              className="ml-auto cursor-pointer text-xs text-gray-600 underline hover:text-gray-500"
              value=""
              onSelect={() => {
                console.log("new list");
              }}
            >
              <option value="" disabled hidden>
                Add to list
              </option>
              <option value="asd">New list</option>
            </select> */}
              {newTalentListCandidatesIds.length > 0 && (
                <>
                  {createTalentListPositionLoading ||
                  updateUsersTalentListPositionLoading ? (
                    <Loading title="" />
                  ) : (
                    <div className="relative ml-10 mr-3">
                      <span
                        onClick={() => {
                          setAddToListOpen(true);
                        }}
                        className="cursor-pointer text-xs text-gray-600 hover:text-gray-400"
                      >
                        <IoMdAddCircle size={16} className="mb-1 mr-1 inline" />
                        Add to list
                      </span>
                      {addToListOpen && (
                        <div
                          className="fixed left-0 top-0 z-30 h-full w-full"
                          onClick={() => {
                            setAddToListOpen(false);
                          }}
                        ></div>
                      )}
                      {addToListOpen && (
                        <div
                          className={classNames(
                            "scrollbar-hide absolute left-0 top-6 z-40 max-h-[120px] w-[140px] overflow-y-scroll rounded-md border border-gray-200 bg-white hover:text-gray-600",
                            addToListOpen ? "" : "h-0"
                          )}
                        >
                          <div
                            className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                            onClick={handleCreateNewList}
                          >
                            <p className="">
                              <HiOutlineDocumentPlus
                                size={16}
                                className="mb-1 mr-1 inline"
                              />
                              New list
                            </p>
                          </div>
                          {talentListsAvailables.map((list, index) => (
                            <div
                              key={index}
                              className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                              onClick={() =>
                                handleAddCandidatesToList(list._id!)
                              }
                            >
                              <p className="">{list.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {newTalentListCandidatesIds.length > 0 &&
                talentListSelected?._id !== "000" && (
                  <div className="relative">
                    <span
                      className="ml-4 cursor-pointer text-xs text-gray-600 hover:text-gray-400"
                      onClick={() => {
                        handleRemoveCandidatesFromList(
                          talentListSelected?._id!
                        );
                      }}
                    >
                      <IoMdRemoveCircle
                        size={16}
                        className="mb-1 mr-1 inline"
                      />
                      Remove from list
                    </span>
                  </div>
                )}
              {newTalentListCandidatesIds.length > 0 && (
                <div className="relative">
                  <span
                    data-tip="Select only 2 candidates to compare"
                    data-for={`badgeTip-compare`}
                    className={classNames(
                      "ml-8 mr-4 text-xs text-gray-600 hover:text-gray-400",
                      newTalentListCandidatesIds.length !== 2
                        ? "cursor-default hover:line-through"
                        : "cursor-pointer"
                    )}
                    onClick={() => {
                      if (newTalentListCandidatesIds.length !== 2) return;

                      router.push(
                        {
                          pathname: "/dashboard/" + positionID,
                          query: {
                            candidate1: newTalentListCandidatesIds[0],
                            candidate2: newTalentListCandidatesIds[1],
                          },
                        },
                        undefined,
                        { shallow: true }
                      );
                    }}
                  >
                    <MdCompare size={16} className="mb-1 mr-1 inline" />
                    Compare
                  </span>
                  {newTalentListCandidatesIds.length !== 2 && (
                    <ReactTooltip
                      id="badgeTip-compare"
                      place="top"
                      effect="solid"
                      backgroundColor="#f87171"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-flow-row">
            <CandidatesTableList
              candidateIDRowSelected={selectedUserId || null}
              candidatesList={
                talentListSelected?._id === "000"
                  ? candidatesUnqualifiedList
                  : candidatesFromTalentList
              }
              fetchIsLoading={findPositionIsLoading}
              setRowObjectData={handleRowClick}
              listMode={ListModeEnum.selectable}
              selectedIds={newTalentListCandidatesIds}
              handleChkSelection={handleCandidateCheckboxSelection}
            />
            {trainModalOpen ? (
              <div className="fixed inset-0 z-30 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={handleCloseTrainModal}
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-xl">
                    <TrainQuestionsEdenAI
                      questions={questions}
                      positionID={positionID!}
                      setQuestions={setQuestions}
                      setTrainModalOpen={setTrainModalOpen}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={classNames(
            "absolute right-0 top-0 z-20 transform overflow-y-scroll border-l-2 border-gray-300 transition-all duration-200 ease-in-out",
            selectedUserId ? "w-[50vw]" : "w-0"
          )}
        >
          <div className="scrollbar-hide h-[calc(100vh-4rem)] overflow-y-scroll bg-white shadow-md">
            {/* {selectedUserId ? ( */}

            <CandidateInfo
              key={selectedUserId || ""}
              memberID={selectedUserId || ""}
              // percentage={selectedUserScore}
              summaryQuestions={selectedUserSummaryQuestions}
              mostRelevantMemberNode={mostRelevantMemberNode}
              candidate={candidatesOriginalList?.find(
                (candidate) =>
                  candidate?.user?._id?.toString() == selectedUserId?.toString()
              )}
              onClose={() => {
                setSelectedUserId(null);
              }}
              rejectCandidateFn={handleRejectCandidate}
              approveCandidateFn={handleApproveCandidate}
              qualified={
                Boolean(
                  approvedTalentListCandidatesList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      selectedUserId?.toString()
                  )
                ) ||
                Boolean(
                  rejectedTalentListCandidatesList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      selectedUserId?.toString()
                  )
                )
              }
            />
            {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
          </div>
        </div>
        <div
          className={classNames(
            "absolute right-0 top-0 z-20 transform overflow-y-scroll transition-all duration-200 ease-in-out",
            router.query.candidate1 && router.query.candidate2
              ? "w-[100vw]"
              : "w-0"
          )}
        >
          {router.query.candidate1 && router.query.candidate2 && (
            <>
              <div className="scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll border-r border-gray-300 bg-white">
                {/* {router.query.candidate1 ? ( */}
                <CandidateInfo
                  key={(router.query.candidate1 as string) || ""}
                  memberID={(router.query.candidate1 as string) || ""}
                  percentage={selectedUserScore}
                  summaryQuestions={selectedUserSummaryQuestions}
                  mostRelevantMemberNode={mostRelevantMemberNode}
                  candidate={candidatesOriginalList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      router.query.candidate1?.toString()
                  )}
                  onClose={() => {
                    router.push(
                      {
                        pathname: "/dashboard/" + positionID,
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                />
                {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
              </div>
              <div className="scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll bg-white">
                {/* {router.query.candidate2 ? ( */}
                <CandidateInfo
                  key={(router.query.candidate2 as string) || ""}
                  memberID={(router.query.candidate2 as string) || ""}
                  percentage={selectedUserScore}
                  summaryQuestions={selectedUserSummaryQuestions}
                  mostRelevantMemberNode={mostRelevantMemberNode}
                  candidate={candidatesOriginalList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      router.query.candidate2?.toString()
                  )}
                  onClose={() => {
                    router.push(
                      {
                        pathname: "/dashboard/" + positionID,
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                />
                {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

PositionCRM.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default PositionCRM;

import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import { getSession, signIn } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  // const url = ctx.req.url?.replace("/", "");

  if (!session) {
    // return {
    //   redirect: {
    //     destination: `/login?redirect=${url}`,
    //     permanent: false,
    //   },
    // };
    signIn("google");
  }

  return {
    props: {},
  };
}