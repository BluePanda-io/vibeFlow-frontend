/* eslint-disable camelcase */
import { AvatarList, CardGrid, EndorsementCard } from "@eden/package-ui";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
};

export interface EndorsementListProps {
  endorsements: any[];
}
export const EndorsementList: React.FC<EndorsementListProps> = ({
  endorsements,
}) => {
  const isMounted = useIsMounted();

  if (!endorsements || !isMounted) return null;

  return (
    <div>
      <div className="mb-3">
        <span className="text-sm font-semibold tracking-widest subpixel-antialiased">
          🎙 Endorsed by + Stake{" "}
        </span>
        <span className="group relative inline-block">
          <QuestionMarkCircleIcon className="text-accentColor inline w-[26px] cursor-pointer" />
          <div className="pointer-events-none absolute -top-40 -ml-4 hidden w-80 rounded-xl border bg-white p-2 shadow-md group-hover:block">
            <p className="mb-2">
              <QuestionMarkCircleIcon className="text-accentColor inline w-[26px] " />{" "}
              Staking in Eden is a way to put ‘trust’ in someone’s potential &
              monetize the return!
            </p>

            <p className="mb-1 text-sm">
              <span className="bg-soilGreen-400 mr-1 whitespace-nowrap rounded-xl px-2 text-sm">
                Lifetime stake
              </span>
              Is the total amount person staked on other people
            </p>
            <p className="mb-1 text-sm">
              <span className="bg-soilPurple mr-1 whitespace-nowrap rounded-xl px-2 text-sm text-white">
                $TRST
              </span>
              Is the amount that other people staked on a person in the current
              period (1mo)
            </p>
          </div>
        </span>
      </div>
      <CardGrid>
        {endorsements.slice(0, 3).map((endorsement, index) => (
          <div key={index} className="col-span-1">
            <EndorsementCard
              member={endorsement?.member || endorsement?.endorser}
              text={endorsement?.text || endorsement?.endorsementMessage}
              level={endorsement?.level}
              arweaveTransactionID={endorsement?.arweaveTransactionID || ""}
            />
          </div>
        ))}
      </CardGrid>
      {endorsements.slice(3, 8).length > 0 && (
        <div className="mt-4 flex items-center">
          <AvatarList
            className="inline-block !w-auto !justify-start"
            avatars={endorsements.slice(3, 8).map((endorsement) => ({
              size: "sm",
              src:
                endorsement?.member?.discordAvatar ||
                endorsement?.endorser?.discordAvatar,
            }))}
          />
          {endorsements.slice(8).length > 0 && (
            <p className="text-soilGray ml-6 inline">
              +{endorsements.slice(8).length} more{" "}
              {endorsements.slice(8).length === 1
                ? "endorsement"
                : "endorsements"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
