import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-primary">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Construction className="h-5 w-5 text-orange-500" />
            <span>Under Development</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is currently under development. Please check back later for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}