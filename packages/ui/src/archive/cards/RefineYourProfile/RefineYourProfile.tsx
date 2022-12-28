import { Button, Card, RangeChart, TextHeading2 } from "@eden/package-ui";

const rangeGenerator = (min: number, range: number, max: number) => {
  const rangeNumbers: number[] = [];

  for (let i = min; i < range; i++) {
    rangeNumbers.push(Math.floor(Math.random() * max) + 1);
  }
  return rangeNumbers;
};

export const RefineYourProfile = () => {
  return (
    <Card shadow className="mb-4 w-full bg-white p-4">
      <div>
        <TextHeading2>Refine your profile:</TextHeading2>
        <div className="mt-8 flex justify-center">
          <Button variant="primary" onClick={() => null}>
            Add more skills
          </Button>
        </div>
        <div className="mt-8">
          <p className="mb-4 text-xl font-medium">💸 Salary Expectations</p>
          <RangeChart
            leftCaption="Less $"
            rightCaption="More $$"
            minCaption="min salary"
            maxCaption="max salary"
            data={rangeGenerator(0, 1000, 100)}
          />
        </div>
        <div className="mt-8">
          <p className="mb-4 text-xl font-medium">⏱ Availability</p>
          <RangeChart
            leftCaption=">hours"
            rightCaption="<hours"
            minCaption="min hours"
            maxCaption="max hours"
            data={rangeGenerator(0, 500, 80)}
          />
        </div>
      </div>
    </Card>
  );
};
