import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";

export function AllocationOverviewCards() {
  const cards = [
    {
      title: "Total Trades Allocated",
      value: "1,247",
      change: "+18%",
      changeType: "increase" as const,
      icon: CheckCircle,
      description: "Successfully allocated today"
    },
    {
      title: "Pending Allocations",
      value: "23",
      change: "-12%",
      changeType: "decrease" as const,
      icon: RotateCcw,
      description: "Awaiting manual review"
    },
    {
      title: "Allocation Efficiency",
      value: "98.7%",
      change: "+2.3%",
      changeType: "increase" as const,
      icon: TrendingUp,
      description: "Average fill rate"
    },
    {
      title: "Failed Allocations",
      value: "5",
      change: "0%",
      changeType: "neutral" as const,
      icon: AlertCircle,
      description: "Requiring reprocessing"
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
            <card.icon className={`h-4 w-4 ${
              card.title.includes('Failed') ? 'text-red-500' : 
              card.title.includes('Pending') ? 'text-orange-500' : 
              'text-green-500'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                card.changeType === 'increase' ? 'text-green-600' : 
                card.changeType === 'decrease' ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-muted-foreground">vs yesterday</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}