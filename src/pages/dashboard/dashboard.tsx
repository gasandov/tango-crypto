import Skeleton from "components/atoms/skeleton";
import { Suspense, lazy } from "react";

const Calculator = lazy(() => import("components/organisms/calculator"));
const Chart = lazy(() => import("components/organisms/chart"));
const Tables = lazy(() => import("components/organisms/tables"));

const Dashboard = () => {
  return (
    <div className="">
      <div className="flex items-center justify-center px-4 gap-x-6 mb-6">
        <Suspense fallback={<Skeleton />}>
          <Chart />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <Calculator />
        </Suspense>
      </div>
      <Suspense fallback={<Skeleton />}>
        <Tables />
      </Suspense>
    </div>
  );
};

export default Dashboard;
