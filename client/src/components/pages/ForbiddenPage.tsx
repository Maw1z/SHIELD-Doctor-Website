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
    <div className="flex h-screen items-center justify-center p-4">
      <GradientWrapper />
      <main>
        <Card
          className="w-full max-w-md border-destructive/50 text-center"
          role="alert"
          aria-labelledby="forbidden-title"
          aria-describedby="forbidden-description"
        >
          <CardHeader>
            <div className="flex justify-center pb-4">
              <ShieldAlert
                className="h-12 w-12 text-destructive"
                aria-hidden="true"
              />
            </div>
            <CardTitle
              id="forbidden-title"
              className="text-4xl font-bold text-destructive"
            >
              403 Forbidden
            </CardTitle>
            <CardDescription id="forbidden-description" className="text-lg">
              Access Denied. You do not have permission to view this resource.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
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
