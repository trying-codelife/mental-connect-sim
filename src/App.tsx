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
  {/* Pages without the layout go here */}
  <Route path="/login" element={<Login />} />
  <Route path="*" element={<NotFound />} />

  {/* This single Layout wraps all the pages below it */}
  <Route element={<Layout />}>
    <Route path="/" element={<StudentDashboard />} />
    <Route path="/student" element={<StudentDashboard />} />
    <Route path="/student/resources" element={<Resources />} />
    <Route path="/student/book" element={<BookAppointment />} />
    <Route path="/student/forum" element={<Forum />} />
    <Route path="/student/chatbot" element={<ChatbotIntegration />} />
    
    <Route path="/counselor" element={<CounselorDashboard />} />
    <Route path="/counselor/bookings" element={<Bookings />} />
    
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/counselors" element={<ManageCounselors />} />
    <Route path="/admin/resources" element={<ManageResources />} />
  </Route>
</Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
