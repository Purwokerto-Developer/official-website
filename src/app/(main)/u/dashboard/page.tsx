import { isAuthenticated } from '@/lib/better-auth/get-session';
import DashboardContent from './_components/dashboard-content';

const UserDashboard = async () => {
  await isAuthenticated();

  return <DashboardContent />;
};

export default UserDashboard;
