import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChefHat, BookOpen, Users, Award, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";

const Index = () => {
  const navigate = useNavigate();

  const { data: featuredCourses } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const features = [
    { icon: BookOpen, title: "Expert-Led Courses", desc: "Learn from professional chefs with years of culinary experience across global cuisines." },
    { icon: Users, title: "Small Batches", desc: "Intimate class sizes ensure personalized attention and hands-on practice for every student." },
    { icon: Award, title: "Certificates", desc: "Earn recognized certificates upon completion to showcase your culinary achievements." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" /> Now Enrolling — Spring 2026 Batches
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Master the Art of <span className="text-primary">Cooking</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
              Transform your culinary passion into professional expertise with hands-on classes led by world-class chefs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="text-base shadow-lg" onClick={() => navigate("/courses")}>
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-base text-primary-foreground hover:bg-primary-foreground/20" onClick={() => navigate("/register")}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Why Kitchen Coach?</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to become a confident cook, all in one place.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border bg-background p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredCourses && featuredCourses.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">Popular Courses</h2>
                <p className="mt-2 text-muted-foreground">Start your culinary journey today</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" onClick={() => navigate("/courses")}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" onClick={() => navigate("/courses")}>View All Courses</Button>
            </div>
          </div>
        </section>
      )}

      <section className="border-t bg-gradient-to-br from-primary/5 via-secondary/50 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <ChefHat className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to Start Cooking?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join hundreds of students who have transformed their cooking skills. Sign up today and get access to world-class instruction.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/register")}>Create Free Account</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/courses")}>Explore Courses</Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold">Kitchen Coach</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Kitchen Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
