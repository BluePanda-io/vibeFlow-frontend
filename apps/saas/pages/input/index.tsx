import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { AppUserLayout, Button, SaasUserLayout } from "@eden/package-ui";
import { signIn } from "next-auth/react";
import React, { useContext, useState } from "react";

import type { NextPageWithLayout } from "../_app";

const SAVE_STATE_VALUE = gql`
  mutation ($fields: saveStateValueInput!) {
    saveStateValue(fields: $fields) {
      userID
      name
      type
      value
      timeStamp
    }
  }
`;

const ConnectTGPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);

  const [energy, setEnergy] = useState("5");
  const [stress, setStress] = useState("5");
  const [happiness, setHappiness] = useState("5");

  const [saveStateData, {}] = useMutation(SAVE_STATE_VALUE, {});

  const saveToBackend = async () => {
    // Save input1, input2, input3 to the backend
    console.log(energy, stress, happiness);

    await saveStateData({
      variables: {
        fields: {
          userID: currentUser?._id,
          type: "ENERGY",
          value: parseInt(energy),
        },
      },
    });

    await saveStateData({
      variables: {
        fields: {
          userID: currentUser?._id,
          type: "STRESS",
          value: parseInt(stress),
        },
      },
    });

    await saveStateData({
      variables: {
        fields: {
          userID: currentUser?._id,
          type: "HAPPINESS",
          value: parseInt(happiness),
        },
      },
    });
  };

  return (
    <>
      <AppUserLayout>
        {currentUser?._id === undefined ? (
          <div
            className="col-span-4 flex items-center justify-center"
            style={{ marginTop: "50px" }}
          >
            <Button
              onClick={() => {
                signIn("google", { callbackUrl: "/input" });
              }}
            >
              Log in with Google
            </Button>
          </div>
        ) : (
          <form>
            <div className="grid gap-6 mb-6 md:grid-cols-2 p-6">
              <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-black">
                Flow of the Day
              </label>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Energy Level: {energy} -
                </label>
                <div
                  style={{
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="range"
                    id="large-range"
                    className=" w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-300"
                    min="1"
                    max="10"
                    placeholder="5"
                    required
                    value={energy}
                    onChange={(e) => {
                      setEnergy(e.target.value);
                      navigator.vibrate(15); // Haptic feedback for mobile devices
                    }}
                  ></input>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Happiness Level {happiness}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  id="last_name"
                  className=" w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-300"
                  placeholder="5"
                  required
                  value={happiness}
                  onChange={(e) => setHappiness(e.target.value)}
                ></input>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Stress Level {stress}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  id="last_name"
                  className=" w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-300"
                  placeholder="5"
                  required
                  value={stress}
                  onChange={(e) => setStress(e.target.value)}
                ></input>
              </div>
              <div style={{ padding: "10px" }}></div>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                  saveToBackend();
                  alert("Done ✅");
                  setEnergy("");
                  setStress("");
                  setHappiness("");
                }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </AppUserLayout>
    </>
  );
};

ConnectTGPage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export default ConnectTGPage;
