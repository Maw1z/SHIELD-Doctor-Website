import { User } from "lucide-react";

export default function PatientDetails({ patient }: { patient: any }) {
  return (
    <>
      {" "}
      <div className="h-16 w-16 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-8 w-8 text-primary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 flex-1 w-full">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Full Name
          </p>
          <p className="text-xl font-bold">{patient.name}</p>
        </div>
        <div className="lg:border-l lg:pl-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Contact Number
          </p>
          <p className="text-lg font-medium">{patient.phone_number}</p>
        </div>
        <div className="lg:border-l lg:pl-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Email Address
          </p>
          <p className="text-lg font-medium">{patient.email}</p>
        </div>
      </div>
    </>
  );
}
