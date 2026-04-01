import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import GradientWrapper from "../GradientWrapper";

const PatientNotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <GradientWrapper />
      <main>
        <Card
          className="w-full max-w-md text-center"
          role="alert"
          aria-labelledby="patient-not-found-title"
          aria-describedby="patient-not-found-description"
        >
          <CardHeader>
            <div className="flex justify-center pb-4">
              <FileQuestion
                className="h-12 w-12 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <CardTitle
              id="patient-not-found-title"
              className="text-4xl font-bold"
            >
              404 Not Found
            </CardTitle>
            <CardDescription
              id="patient-not-found-description"
              className="text-lg"
            >
              The page you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/home" aria-label="Return to the home page">
                Return Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default PatientNotFoundPage;
