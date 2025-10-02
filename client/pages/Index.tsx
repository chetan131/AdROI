import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, DollarSign, MousePointerClick } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Index() {
  const data = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        day: i + 1,
        roi: Number((1.4 + Math.sin(i / 5) * 0.2 + (i / 120)).toFixed(2)),
      })),
    [],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AdROI Dashboard</h1>
          <p className="text-muted-foreground">Analyze campaign ROI and act with confidence.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/insights">View Insights</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/actions">Recommended Actions</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/reports">Reports</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Overall ROI" value="1.8x" icon={<TrendingUp className="text-primary" />} />
        <MetricCard title="Spend (30d)" value="$124,300" icon={<DollarSign className="text-primary" />} />
        <MetricCard title="CTR" value="3.4%" icon={<MousePointerClick className="text-primary" />} />
        <MetricCard title="Conversions" value="8,245" icon={<Activity className="text-primary" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI Trend • Last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ roi: { label: "ROI", color: "hsl(var(--primary))" } }}
            className="aspect-[16/6]"
          >
            <LineChart data={data} margin={{ left: 8, right: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[1, 2.2]} tickLine={false} axisLine={false} tickMargin={8} />
              <Line type="monotone" dataKey="roi" stroke="var(--color-roi)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
