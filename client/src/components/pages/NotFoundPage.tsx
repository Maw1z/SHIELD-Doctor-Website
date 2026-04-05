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

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <GradientWrapper />
      <main className="w-full max-w-md">
        <Card
          className="text-center shadow-lg"
          role="alert"
          aria-labelledby="not-found-title"
          aria-describedby="not-found-description"
        >
          <CardHeader className="space-y-6 pt-10">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-4">
                <FileQuestion
                  className="h-16 w-16 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle
                id="not-found-title"
                className="text-4xl font-bold tracking-tight"
              >
                404 Not Found
              </CardTitle>
              <CardDescription
                id="not-found-description"
                className="text-lg px-4"
              >
                The page you are looking for does not exist or has been moved.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center pb-10 pt-4">
            <Button asChild size="lg" className="px-8">
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

export default NotFoundPage;
