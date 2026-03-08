import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: batches } = useQuery({
    queryKey: ["batches", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("course_id", id!)
        .eq("is_active", true)
        .order("start_date");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const bookMutation = useMutation({
    mutationFn: async (batchId: string) => {
      const { error } = await supabase.from("bookings").insert({
        user_id: user!.id,
        batch_id: batchId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Booked!", description: "Your booking is pending approval." });
      queryClient.invalidateQueries({ queryKey: ["batches", id] });
    },
    onError: (err: any) => {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Course info */}
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-xl bg-secondary">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="text-6xl">🍳</span>
                </div>
              )}
            </div>
            <div className="mt-6">
              {course.category && <Badge variant="secondary" className="mb-2">{course.category}</Badge>}
              <h1 className="font-display text-3xl font-bold">{course.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {course.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>}
                <span className="flex items-center gap-1 text-lg font-bold text-foreground"><DollarSign className="h-4 w-4" /> {course.price}</span>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">{course.description}</p>
            </div>
          </div>

          {/* Batches */}
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">Available Batches</h2>
            {batches?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No batches available right now.</p>
            ) : (
              <div className="space-y-4">
                {batches?.map((batch) => {
                  const spotsLeft = batch.capacity - batch.booked_seats;
                  return (
                    <Card key={batch.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">{batch.schedule}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(batch.start_date), "MMM d")} — {format(new Date(batch.end_date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3.5 w-3.5" /> {batch.instructor}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> {spotsLeft} spots left
                        </div>
                        <Button
                          className="mt-2 w-full"
                          size="sm"
                          disabled={spotsLeft <= 0 || bookMutation.isPending}
                          onClick={() => {
                            if (!user) { navigate("/login"); return; }
                            bookMutation.mutate(batch.id);
                          }}
                        >
                          {spotsLeft <= 0 ? "Full" : "Book Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
