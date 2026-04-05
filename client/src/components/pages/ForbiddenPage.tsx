import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import GradientWrapper from "../GradientWrapper";

const ForbiddenPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <GradientWrapper />
      <main className="w-full max-w-md">
        <Card
          className="border-destructive/20 text-center shadow-lg"
          role="alert"
          aria-labelledby="forbidden-title"
          aria-describedby="forbidden-description"
        >
          <CardHeader className="space-y-6 pt-10">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <ShieldAlert
                  className="h-16 w-16 text-destructive"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle
                id="forbidden-title"
                className="text-4xl font-bold tracking-tight text-destructive"
              >
                403 Forbidden
              </CardTitle>
              <CardDescription
                id="forbidden-description"
                className="text-lg px-4"
              >
                Access Denied. You do not have permission to view this resource.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center pb-10 pt-4">
            <Button variant="default" asChild size="lg" className="px-8">
              <Link to="/home" aria-label="Go back to the home page">
                Go Back Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default ForbiddenPage;
