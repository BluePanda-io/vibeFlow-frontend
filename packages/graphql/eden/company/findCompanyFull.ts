import { gql } from "@apollo/client";

// import { CompanyCandidatesFragment } from "../fragments/companyCandidatesFragment";

export const FIND_COMPANY_FULL = gql`
  query ($fields: findCompanyInput!) {
    findCompany(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        user {
          _id
          discordName
          discordAvatar
          memberRole {
            _id
            title
          }
          budget {
            perHour
          }
          nodes {
            nodeData {
              _id
              name
              node
            }
          }
          previousProjects {
            title
            positionName
          }
          experienceLevel {
            total
            years
          }
        }
        readyToDisplay
        summaryQuestions {
          questionID
          questionContent
          questionContentSmall
          answerContent
          answerContentSmall
          reason
          score
          bestAnswerCompany
          subConversationAnswer {
            role
            content
          }
        }
      }
      talentList {
        _id
        name
        talent {
          user {
            _id
            discordName
            discordAvatar
            memberRole {
              _id
              title
            }
            budget {
              perHour
            }
            experienceLevel {
              total
              years
            }
          }
        }
      }
      nodes {
        nodeData {
          _id
          name
        }
      }
      candidatesReadyToDisplay
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
    }
  }
`;
// ${CompanyCandidatesFragment}
