import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, TrendingUp, Users, MapPin } from "lucide-react";

export function RiskOverviewCards() {
  const cards = [
    {
      title: "High Risk Clients",
      value: "247",
      change: "+12%",
      changeType: "increase" as const,
      icon: AlertTriangle,
      description: "Clients with risk score > 80"
    },
    {
      title: "Active Investigations",
      value: "18",
      change: "-3%",
      changeType: "decrease" as const,
      icon: TrendingUp,
      description: "Ongoing compliance reviews"
    },
    {
      title: "Total Clients",
      value: "12,847",
      change: "+5%",
      changeType: "increase" as const,
      icon: Users,
      description: "All monitored entities"
    },
    {
      title: "High Risk Jurisdictions",
      value: "23",
      change: "+2",
      changeType: "increase" as const,
      icon: MapPin,
      description: "Countries with elevated risk"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                card.changeType === 'increase' ? 'text-red-600' : 'text-green-600'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}