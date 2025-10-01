import { Suspense } from "react";

type Props = {
  params: Promise<{ jobListingId: string }>;
};
const JobListingId = ({ params }: Props) => {
  return (
    <Suspense>
      <SuspenseJobListing params={params} />
    </Suspense>
  );
};

export default JobListingId;

function SuspenseJobListing(params: Props) {
  return <></>;
}
