import "./styles.css";

import clsx from "clsx";
import { useEffect, useState } from "react";

export interface IBatteryStepperProps {
  batteryPercentage: number;
  showPercentage?: boolean;
  numMatches?: number | string;
  text?: string;
  size?: "lg" | "sm";
}

export const BatteryStepper = ({
  numMatches,
  showPercentage = false,
  batteryPercentage,
  text = "Projects",
  size = "lg",
}: IBatteryStepperProps) => {
  const [batteryColor, setBatteryColor] = useState("#ff0000");
  const btrBodyCls = clsx(
    { "w-[70px] h-[110px] border-[6px] border-black": size === "sm" },
    { "w-[100px] h-[200px] border-[4px] border-black": size === "lg" }
  );
  const btrHeadCls = clsx(
    { "w-[17px] h-[1px] ": size === "sm" },
    { "w-[30px] h-[10px]": size === "lg" }
  );
  const mathcesTextCls = clsx(
    { "text-[12px]": size === "sm" },
    { "text-sm": size === "lg" }
  );
  const numMatchesTextCls = clsx(
    { "text-xl": size === "sm" },
    { "text-3xl": size === "lg" }
  );

  useEffect(() => {
    if (batteryPercentage <= 20) {
      setBatteryColor("#ff0000");
    } else if (20 < batteryPercentage && batteryPercentage <= 40) {
      setBatteryColor("#ff9100");
    } else if (40 < batteryPercentage && batteryPercentage <= 60) {
      setBatteryColor("#fff200");
    } else if (60 < batteryPercentage && batteryPercentage <= 80) {
      setBatteryColor("#d7fc03");
    } else if (80 < batteryPercentage && batteryPercentage <= 100) {
      setBatteryColor("#00ff00");
    }
  }, [batteryPercentage]);

  return (
    <div className="battery">
      <div className={`${btrHeadCls} battery-head`}></div>
      <div className={`${btrBodyCls} battery-body`}>
        <div
          className="charge -mb-px"
          style={{
            height: `${batteryPercentage}%`,
            background: `${batteryColor}`,
          }}
        />
        {!!numMatches && (
          <div className="font-poppins absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-center font-semibold">
            <p className={`${numMatchesTextCls}`}>{numMatches}</p>
            <p className={`${mathcesTextCls}`}>{text}</p>
          </div>
        )}
        {showPercentage && (
          <div className="font-poppins absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-center font-semibold">
            <p className="text-2xl">{batteryPercentage}%</p>
          </div>
        )}
      </div>
    </div>
  );
};
