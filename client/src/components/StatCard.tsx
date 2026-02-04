import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatCard({ title, value, className }: StatCardProps) {
  return (
    <Card className="border-none shadow-none bg-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`flex justify-end text-3xl sm:text-4xl lg:text-5xl font-bold ${className}`}
      >
        {value}
      </CardContent>
    </Card>
  );
}
