// Icons are represented by string keys so the state is serializable from server to client
export type DashboardState = {
  title: string;
  description: string;
  // icon is a string key referencing an icon component on the client
  icon?: string;
  count: number;
  status: string;
};
