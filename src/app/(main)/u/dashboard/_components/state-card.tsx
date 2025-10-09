import { cn } from '@/lib/utils';
import CountUp from '@/components/count-up';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardState } from '@/types/dashboard-state-type';

const accentColors: Record<string, string> = {
  'Total Events': 'bg-blue-100 text-blue-600',
  Upcoming: 'bg-green-100 text-green-600',
  'My Articles': 'bg-purple-100 text-purple-600',
  'Past Events': 'bg-gray-100 text-gray-600',
};

export const StateCard = ({ state }: { state: DashboardState }) => {
  const { title, description, count } = state;

  return (
    <Card className="cursor-default transition-all hover:scale-[1.02] hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex w-full items-center justify-between gap-2">
          <div
            className={cn(
              'rounded-lg p-2',
              accentColors[title] || 'bg-accent text-accent-foreground',
            )}
          >
            <state.icon size={22} variant="Bulk" />
          </div>
          <CardTitle className="text-base font-semibold capitalize">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0 text-center">
        <CountUp
          from={0}
          to={count}
          separator=","
          direction="up"
          duration={0.8}
          className="text-foreground text-4xl font-extrabold tracking-tight"
        />
      </CardContent>

      <CardFooter className="justify-center">
        <CardDescription className="text-center">{description}</CardDescription>
      </CardFooter>
    </Card>
  );
};
