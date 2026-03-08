import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
      <div className="aspect-[4/3] overflow-hidden">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-secondary to-accent/20">
            <span className="text-5xl">🍳</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        {course.category && (
          <Badge variant="secondary" className="w-fit text-xs font-medium">{course.category}</Badge>
        )}
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2">{course.title}</h3>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {course.duration && (
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
          )}
          <span className="flex items-center gap-1 font-bold text-primary">
            <DollarSign className="h-3.5 w-3.5" /> {course.price}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full group/btn" onClick={() => navigate(`/courses/${course.id}`)}>
          View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
