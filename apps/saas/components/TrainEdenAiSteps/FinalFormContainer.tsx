"use-client";

import { FillSocialLinks } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { Tab } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SlLocationPin } from "react-icons/sl";

interface IFinalFormContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (data: any) => void;
}

type FormData = {
  targetedStartDate: Date;
  visaRequirements: "yes" | "no";
  officePolicy:
    | "on-site"
    | "remote"
    | "hybrid-1-day-office"
    | "hybrid-2-day-office"
    | "hybrid-3-day-office"
    | "hybrid-4-day-office";
  officeLocation: string;
  contractType: "fulltime" | "parttime" | "freelance" | "intern";
  contractDuration: string; // You can specify more options if you have them
};

const defaultFormValues: FormData = {
  targetedStartDate: new Date(),
  visaRequirements: "yes",
  officePolicy: "on-site",
  officeLocation: "",
  contractType: "fulltime",
  contractDuration: "",
};

export const FinalFormContainer = ({ onChange }: IFinalFormContainerProps) => {
  const { getValues, register, watch } = useForm<FormData>({
    defaultValues: {
      ...defaultFormValues,
    },
  });

  useEffect(() => {
    onChange(
      getValues([
        "targetedStartDate",
        "visaRequirements",
        "officePolicy",
        "officeLocation",
        "contractType",
        "contractDuration",
      ])
    );
  }, [
    watch([
      "targetedStartDate",
      "visaRequirements",
      "officePolicy",
      "officeLocation",
      "contractType",
      "contractDuration",
    ]),
  ]);
  return (
    <>
      <form className="flex items-center justify-center">
        <div className="mt-6 h-96 w-[40rem]  rounded-lg  px-8 pb-8 pt-3">
          <Tab.Group>
            <Tab.List className="  border-edenGreen-300 flex  w-full justify-between border-b ">
              <div className="flex items-start gap-x-6">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  GENERAL
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  SOCIALS
                </Tab>
              </div>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="pt-8">
                <div className="flex  gap-x-6">
                  <div className="flex  flex-col items-start text-xs">
                    <label className="text-xs ">Start Date </label>
                    <input
                      type="date"
                      id="targetedStartDate"
                      className="  border-edenGray-100 mt-2 w-56  rounded-lg border py-[.45rem] pl-2 pr-2 outline-none "
                      required
                      {...register("targetedStartDate")}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Visa Required</label>
                    <div className="border-edenGray-100 mt-2 w-24 rounded-lg border bg-white p-2 text-xs ">
                      <select
                        id="visaRequirements"
                        className="w-full outline-none"
                        {...register("visaRequirements")}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex   w-full flex-col items-start pr-2">
                    <label className="text-xs ">Office Policy</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="officePolicy"
                        className="w-full outline-none"
                        {...register("officePolicy")}
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="on-site">On site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid-1-day-office">
                          Hybrid - 1 day office
                        </option>
                        <option value="hybrid-2-day-office">
                          Hybrid - 2 day office
                        </option>
                        <option value="hybrid-3-day-office">
                          Hybrid - 3 day office
                        </option>
                        <option value="hybrid-4-day-office">
                          Hybrid - 4 day office
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative mb-12 mt-6 flex flex-col items-start">
                    <label className="text-xs">Office Locations</label>
                    <div className="mt-2 w-full rounded-lg bg-white text-xs">
                      <SlLocationPin className="absolute bottom-2 left-2 h-5 w-5 " />
                      <input
                        id="officeLocation"
                        {...register("officeLocation")}
                        type="text"
                        className="  border-edenGray-100 w-full rounded-lg border py-[.45rem] pl-8   outline-none "
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-8 ">
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Contact Type</label>
                    <div className="border-edenGray-100   mt-2 w-64  rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="contractType"
                        {...register("contractType")}
                        className=" w-full outline-none"
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="fulltime">Full time</option>
                        <option value="parttime">Part time</option>
                        <option value="freelance">Freelance</option>
                        <option value="intern">Intern</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start">
                    <label className="text-xs">Contract Duration</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="contractDuration"
                        {...register("contractDuration")}
                        className="w-full outline-none "
                      >
                        <option value={""} disabled hidden>
                          Select duration of contract
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className=" gird grid-cols-2">
                  <FillSocialLinks />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </form>{" "}
    </>
  );
};