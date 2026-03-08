import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen, Users, CalendarDays, DollarSign } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: batches } = useQuery({
    queryKey: ["admin-batches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("batches").select("*, courses(title)").order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, batches(schedule, courses(title)), profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = bookings?.filter((b) => b.payment_status === "paid").reduce((sum, b) => sum + (b.batches?.courses?.price ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-bold">Admin Dashboard</h1>

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Courses", value: courses?.length ?? 0, icon: BookOpen },
            { label: "Batches", value: batches?.length ?? 0, icon: CalendarDays },
            { label: "Bookings", value: bookings?.length ?? 0, icon: Users },
            { label: "Revenue", value: `$${totalRevenue}`, icon: DollarSign },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="batches">Batches</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-4">
            <div className="mb-4 flex justify-between">
              <h2 className="font-display text-xl font-semibold">Manage Courses</h2>
              <CreateCourseDialog />
            </div>
            <div className="space-y-3">
              {courses?.map((course) => (
                <Card key={course.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.category} · ${course.price} · {course.duration}</p>
                    </div>
                    <Badge variant={course.is_active ? "default" : "secondary"}>{course.is_active ? "Active" : "Inactive"}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="batches" className="mt-4">
            <div className="mb-4 flex justify-between">
              <h2 className="font-display text-xl font-semibold">Manage Batches</h2>
              <CreateBatchDialog courses={courses ?? []} />
            </div>
            <div className="space-y-3">
              {batches?.map((batch) => (
                <Card key={batch.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{batch.courses?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {batch.schedule} · {batch.instructor} · {batch.booked_seats}/{batch.capacity} seats
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(batch.start_date), "MMM d")} — {format(new Date(batch.end_date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant={batch.is_active ? "default" : "secondary"}>{batch.is_active ? "Active" : "Inactive"}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <h2 className="mb-4 font-display text-xl font-semibold">All Bookings</h2>
            <div className="space-y-3">
              {bookings?.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", duration: "", price: "", category: "", image_url: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").insert({
        title: form.title,
        description: form.description,
        duration: form.duration,
        price: parseFloat(form.price) || 0,
        category: form.category || null,
        image_url: form.image_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course created!" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      setOpen(false);
      setForm({ title: "", description: "", duration: "", price: "", category: "", image_url: "" });
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 weeks" /></div>
            <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Baking" /></div>
          <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
          <Button onClick={() => mutation.mutate()} disabled={!form.title || mutation.isPending} className="w-full">
            {mutation.isPending ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateBatchDialog({ courses }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ course_id: "", start_date: "", end_date: "", schedule: "", instructor: "", capacity: "15" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("batches").insert({
        course_id: form.course_id,
        start_date: form.start_date,
        end_date: form.end_date,
        schedule: form.schedule,
        instructor: form.instructor,
        capacity: parseInt(form.capacity) || 15,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Batch created!" });
      queryClient.invalidateQueries({ queryKey: ["admin-batches"] });
      setOpen(false);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Batch</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Batch</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Course</Label>
            <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
            <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
          </div>
          <div><Label>Schedule</Label><Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="e.g. Mon/Wed/Fri 6-8 PM" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Instructor</Label><Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} /></div>
            <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={!form.course_id || mutation.isPending} className="w-full">
            {mutation.isPending ? "Creating..." : "Create Batch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingRow({ booking }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (status) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", booking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Booking updated!" });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{booking.profiles?.full_name || booking.profiles?.email}</p>
          <p className="text-sm text-muted-foreground">{booking.batches?.courses?.title} · {booking.batches?.schedule}</p>
          <p className="text-xs text-muted-foreground">Booked: {format(new Date(booking.booking_date), "PPP")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[booking.status] ?? ""}>{booking.status}</Badge>
          {booking.status === "pending" && (
            <>
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate("approved")} disabled={updateStatus.isPending}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate("cancelled")} disabled={updateStatus.isPending}>Cancel</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminDashboard;
