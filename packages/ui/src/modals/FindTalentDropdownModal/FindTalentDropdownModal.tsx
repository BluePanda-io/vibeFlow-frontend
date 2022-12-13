import {
  BatteryStepper,
  Button,
  Modal,
  SelectBox,
  TextBody,
  TextHeading3,
} from "@eden/package-ui";
import { forEach, isEmpty, map, omitBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Item = {
  subTitle: string;
  title: string;
  numMatches: string;
  content: string[];
};

type Data = {
  _id: string;
  title: string;
  battery?: boolean;
  subtitle?: string;
  hideSkip?: boolean;
  numMatches?: string;
  itemsTitle?: string;
  items: { [key: string]: Item };
};

export interface FindTalentDropdownModalProps {
  openModal?: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (data: { [key: string | number]: Item[] }) => void;
  mockData?: any;
}

export const FindTalentDropdownModal = ({
  onClose,
  openModal,
  onSubmit,
  mockData,
}: FindTalentDropdownModalProps) => {
  const section: Data = useMemo(
    () => ({
      _id: "main",
      title: mockData?.subCategories?.title
        ? mockData.subCategories.title
        : "Alright, tell me who should I find to help you with your project?",
      subtitle: mockData?.subCategories?.subTitle
        ? mockData.subCategories.subTitle
        : "Please pick only one role for now!",
      battery: true,
      itemsTitle: "Focus On:",
      items: omitBy(
        mockData,
        (_, key) => key === "subCategories" || key === "Focus On Page"
      ) as {
        [key: string]: Item;
      },
    }),
    [mockData]
  );

  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: Item[];
  }>({});
  const [numMatches, setNumMatches] = useState(137);

  const handleNext = () => {
    if (numMatches === 0) {
      toast.error("You should at least choose on of the items before proceed");
    } else {
      if (onSubmit) onSubmit!(selectedItems);
      else onClose!();
    }
  };

  useEffect(() => {
    // onSubmit && onSubmit(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  useEffect(() => {
    let _numMatches = numMatches;
    let batteryPercentage = 50;

    // eslint-disable-next-line no-unused-vars
    forEach(selectedItems, (el, key) => {
      if (!isEmpty(el)) {
        // numMatches += +get(section, `items.${key}.numMatches`, 1); //replace 1 with 0
        const newFakeNum = _numMatches - Math.round(Math.random() * 15);

        _numMatches = newFakeNum > 0 ? newFakeNum : _numMatches;

        batteryPercentage += 10;
      }
    });

    if (_numMatches) setNumMatches(_numMatches);
    setBatteryPercentage(batteryPercentage);
  }, [section, selectedItems]);

  // if (section.items) console.log("section.items", section.items);

  return (
    <Modal open={openModal} closeOnEsc={false}>
      {section && (
        <div>
          <div className={`mb-12 flex`}>
            <div>
              <div className="flex justify-between">
                <div className="flex-1">
                  <TextHeading3>{section?.title}</TextHeading3>
                  <TextBody className={`font-medium text-gray-500`}>
                    {section?.subtitle}
                  </TextBody>
                </div>
              </div>
              <section className="mt-4">
                <div>
                  <TextHeading3>{section?.itemsTitle}</TextHeading3>
                </div>
                <div className="my-8 ml-4 flex w-full flex-wrap justify-center gap-2">
                  {!isEmpty(section.items) &&
                    map(section.items, (item, key) => (
                      <SelectBox
                        multiple
                        key={key}
                        caption={key}
                        items={item.content}
                        onChange={(selectedItems) => {
                          setSelectedItems((prevState) => ({
                            ...prevState,
                            [key]: selectedItems,
                          }));
                        }}
                      />
                    ))}
                </div>
              </section>
            </div>
            <div>
              {section?.battery && (
                <BatteryStepper
                  numMatches={numMatches}
                  batteryPercentage={batteryPercentage}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <Button radius="rounded" variant={`secondary`} onClick={onClose}>
                Skip
              </Button>
            </div>
            <Button radius="rounded" variant={`secondary`} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
