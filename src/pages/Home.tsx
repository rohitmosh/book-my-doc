import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, Shield, Clock, Users, ArrowRight, CalendarCheck, Ambulance, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { specialties } from "@/data/mockData";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "500+", label: "Verified Doctors" },
  { icon: Heart, value: "50k+", label: "Patients Served" },
  { icon: Shield, value: "100%", label: "Secure & Private" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const services = [
  {
    icon: CalendarCheck,
    title: "Appointment",
    description: "Book appointments with verified specialists. 24 Hours Service available for your convenience.",
    cta: "Book Now",
    link: "/doctors",
  },
  {
    icon: Ambulance,
    title: "Emergency Cases",
    description: "Immediate medical attention for critical cases. Contact our emergency line for urgent care needs.",
    cta: "Contact Us",
    link: "/doctors",
  },
  {
    icon: Timer,
    title: "Working Hours",
    description: "Our doctors are available from 8:00 AM to 8:00 PM. Check individual doctor schedules for exact timings.",
    cta: "View Schedule",
    link: "/doctors",
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/doctors?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary/5 border-b">
        <div className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
              Total Health Care Solution
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Your Most Trusted{" "}
              <span className="text-primary">Health Partner</span>
            </h1>
            <p className="mt-4 text-lg font-body text-muted-foreground max-w-2xl mx-auto">
              Search from hundreds of verified specialists. Book appointments in seconds and track your health journey seamlessly.
            </p>

            <div className="mt-8 flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by specialty, doctor name..."
                  className="pl-10 h-12"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button size="lg" className="h-12 px-6" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/doctors")} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/track-appointment")}>
                Track Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us + Service Cards */}
      <section className="bg-background border-b">
        <div className="container py-12">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Why Choose Us Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-primary p-6 text-primary-foreground flex flex-col justify-center"
            >
              <h2 className="text-2xl font-bold mb-3">Why Choose Us?</h2>
              <p className="text-sm opacity-90 font-body leading-relaxed">
                We provide comprehensive healthcare solutions with verified doctors, seamless booking, and real-time appointment tracking. Your health is our priority.
              </p>
            </motion.div>

            {/* Service Cards */}
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1), duration: 0.4 }}
                className="rounded-xl border bg-card p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary mb-4">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground font-body mb-4 flex-1">{service.description}</p>
                <Button variant="outline" size="sm" onClick={() => navigate(service.link)}>
                  {service.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container grid grid-cols-2 gap-4 py-10 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-background border-b">
        <div className="container py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Specialty</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {specialties.map((spec) => (
              <Button
                key={spec}
                variant="outline"
                className="h-auto py-4 flex-col gap-1 justify-center"
                onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(spec)}`)}
              >
                <span className="font-medium text-foreground">{spec}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card">
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Are You a Doctor?</h2>
          <p className="text-muted-foreground mb-6 font-body">Join our platform and manage your practice digitally.</p>
          <Button size="lg" onClick={() => navigate("/doctor/dashboard")} className="gap-2">
            Go to Doctor Portal <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
