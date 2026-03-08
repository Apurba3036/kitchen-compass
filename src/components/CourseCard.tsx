import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-secondary">
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="font-display text-2xl text-muted-foreground">🍳</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        {course.category && (
          <Badge variant="secondary" className="w-fit text-xs">{course.category}</Badge>
        )}
        <h3 className="font-display text-lg font-semibold leading-tight">{course.title}</h3>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {course.duration && (
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
          )}
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <DollarSign className="h-3.5 w-3.5" /> {course.price}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
