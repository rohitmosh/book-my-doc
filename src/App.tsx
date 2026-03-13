import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import DoctorList from "@/pages/DoctorList";
import DoctorProfile from "@/pages/DoctorProfile";
import PatientDashboard from "@/pages/PatientDashboard";
import PatientProfileSettings from "@/pages/PatientProfileSettings";
import DoctorDashboard from "@/pages/DoctorDashboard";
import DoctorProfileSettings from "@/pages/DoctorProfileSettings";
import TrackAppointment from "@/pages/TrackAppointment";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/profile-settings" element={<PatientProfileSettings />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile-settings" element={<DoctorProfileSettings />} />
              <Route path="/track-appointment" element={<TrackAppointment />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
