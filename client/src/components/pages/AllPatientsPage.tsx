import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../Header";
import GradientWrapper from "@/components/GradientWrapper";
import { CustomPatientTable } from "@/components/patients/CustomPatientTable";
import { allColumns } from "@/components/patients/patientColumns";
import { usePatients } from "@/hooks/usePatients";

export default function AllPatientsPage() {
  const { data, isLoading, error } = usePatients();

  return (
    <>
      <GradientWrapper />
      <div className="h-screen flex flex-col p-8 overflow-hidden font-poppins">
        <div className="mx-auto w-full max-w-7xl flex flex-col h-full">
          <Header />
          <Card className="flex-1 min-h-0 flex flex-col">
            <CardHeader>
              <CardTitle className="text-3xl">All Patients</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden pb-2">
              <CustomPatientTable
                columns={allColumns}
                data={data}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
