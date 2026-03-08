import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, BookOpen, Users, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: "Expert Courses", desc: "From Indian cuisine to French pastry — learn from the best chefs." },
    { icon: Users, title: "Small Batches", desc: "Intimate class sizes for personalized attention and hands-on learning." },
    { icon: Award, title: "Certificates", desc: "Earn certificates upon completing courses to showcase your skills." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/5" />
        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ChefHat className="h-4 w-4" /> Now Enrolling — Spring 2026 Batches
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Master the Art of <span className="text-primary">Cooking</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Join our kitchen coaching center and transform your culinary passion into professional expertise with hands-on classes led by expert chefs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="text-base" onClick={() => navigate("/courses")}>
                Browse Courses
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={() => navigate("/register")}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold">Why Kitchen Coach?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-background p-6 text-center transition-shadow hover:shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Kitchen Coach. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
