export default function PhysicalBiometrics({ patient }: { patient: any }) {
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  return (
    <>
      <div className="flex items-center gap-3 md:border-r">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase">
            Age / DOB
          </p>
          <p className="text-sm font-bold text-slate-700">
            {age} yrs ({patient.dob})
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:border-r md:pl-4">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase">
            Gender
          </p>
          <p className="text-sm font-bold text-slate-700">{patient.gender}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:border-r md:pl-4">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase">
            Height
          </p>
          <p className="text-sm font-bold text-slate-700">
            {patient.height} cm
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:pl-4">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase">
            Weight
          </p>
          <p className="text-sm font-bold text-slate-700">
            {patient.weight} kg
          </p>
        </div>
      </div>
    </>
  );
}
