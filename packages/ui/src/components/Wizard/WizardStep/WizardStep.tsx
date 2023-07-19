export interface IWizardStepProps {
  label: string;
  children: React.ReactNode;
  nextDisabled?: boolean;
  navigationDisabled?: boolean;
}

// eslint-disable-next-line no-unused-vars
export const WizardStep = ({
  children,
  // eslint-disable-next-line no-unused-vars
  label,
  // eslint-disable-next-line no-unused-vars
  nextDisabled = false,
  // eslint-disable-next-line no-unused-vars
  navigationDisabled = false,
}: IWizardStepProps) => {
  return <section className="h-full overflow-y-scroll">{children}</section>;
};
