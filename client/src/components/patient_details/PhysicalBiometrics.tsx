export default function PhysicalBiometrics({ patient }: { patient: any }) {
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  return (
    <>
      <div className="flex items-center gap-3 md:border-r">
        <div>
          <p
            className="text-xs text-muted-foreground font-bold uppercase"
            id="age-label"
          >
            Age / DOB
          </p>
          <p
            className="text-sm font-bold text-slate-700"
            aria-labelledby="age-label"
          >
            {age} yrs (<time dateTime={patient.dob}>{patient.dob}</time>)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:border-r md:pl-4">
        <div>
          <p
            className="text-xs text-muted-foreground font-bold uppercase"
            id="gender-label"
          >
            Gender
          </p>
          <p
            className="text-sm font-bold text-slate-700"
            aria-labelledby="gender-label"
          >
            {patient.gender}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:border-r md:pl-4">
        <div>
          <p
            className="text-xs text-muted-foreground font-bold uppercase"
            id="height-label"
          >
            Height
          </p>
          <p
            className="text-sm font-bold text-slate-700"
            aria-labelledby="height-label"
          >
            {patient.height} cm
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:pl-4">
        <div>
          <p
            className="text-xs text-muted-foreground font-bold uppercase"
            id="weight-label"
          >
            Weight
          </p>
          <p
            className="text-sm font-bold text-slate-700"
            aria-labelledby="weight-label"
          >
            {patient.weight} kg
          </p>
        </div>
      </div>
    </>
  );
}
