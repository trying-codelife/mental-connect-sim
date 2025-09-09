import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import Resources from "./pages/student/Resources";
import BookAppointment from "./pages/student/BookAppointment";
import Forum from "./pages/student/Forum";
import ChatbotIntegration from "./pages/student/ChatbotIntegration";
import CounselorDashboard from "./pages/counselor/Dashboard";
import Bookings from "./pages/counselor/Bookings";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageCounselors from "./pages/admin/ManageCounselors";
import ManageResources from "./pages/admin/ManageResources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/student" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/student/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/student/book" element={<Layout><BookAppointment /></Layout>} />
            <Route path="/student/forum" element={<Layout><Forum /></Layout>} />
            <Route path="/student/chatbot" element={<Layout><ChatbotIntegration /></Layout>} />
            <Route path="/counselor" element={<Layout><CounselorDashboard /></Layout>} />
            <Route path="/counselor/bookings" element={<Layout><Bookings /></Layout>} />
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/counselors" element={<Layout><ManageCounselors /></Layout>} />
            <Route path="/admin/resources" element={<Layout><ManageResources /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
