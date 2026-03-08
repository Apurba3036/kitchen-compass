import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const MyBookings = () => {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, batches(*, courses(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 font-display text-3xl font-bold">My Bookings</h1>
        <p className="mb-8 text-muted-foreground">Track your class enrollments</p>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : bookings?.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No bookings yet. Browse courses to get started!</div>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-display text-lg">
                      {booking.batches?.courses?.title ?? "Unknown Course"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={statusColors[booking.status] ?? ""}>{booking.status}</Badge>
                      <Badge variant={booking.payment_status === "paid" ? "default" : "outline"}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Schedule: {booking.batches?.schedule}</p>
                  <p>Instructor: {booking.batches?.instructor}</p>
                  <p>Booked on: {format(new Date(booking.booking_date), "PPP")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
