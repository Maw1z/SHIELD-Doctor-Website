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
    <div className="flex h-screen items-center justify-center p-4">
      <GradientWrapper />
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center pb-4">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold">404 Not Found</CardTitle>
          <CardDescription className="text-lg">
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/home">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFoundPage;
