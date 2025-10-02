import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export default function Insights() {
  const roiTrend = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        day: i + 1,
        roi: Number((1.3 + Math.sin(i / 5) * 0.2 + (i / 120)).toFixed(2)),
      })),
    [],
  );

  const spendVsRoi = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        period: `W${i + 1}`,
        spend: Math.round(6000 + Math.sin(i / 2) * 1200 + i * 300),
        roi: Number((1.2 + Math.cos(i / 3) * 0.25).toFixed(2)),
      })),
    [],
  );

  const channels = [
    { name: "Google Ads", roi: 2.0, spend: 72000, ctr: 3.8, cr: 4.2 },
    { name: "Facebook", roi: 1.2, spend: 22000, ctr: 2.6, cr: 2.1 },
    { name: "Instagram", roi: 1.1, spend: 15000, ctr: 2.2, cr: 1.9 },
    { name: "LinkedIn", roi: 1.4, spend: 15300, ctr: 2.9, cr: 3.0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">View Insights</h1>
          <p className="text-muted-foreground">Data-driven insights across channels and campaigns.</p>
        </div>
        <Button asChild>
          <a href="/reports">View Detailed Report</a>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>ROI Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Metric label="Overall ROI" value="1.8x" />
              <Metric label="Top Channel" value="Google Ads" />
              <Metric label="Top Campaign" value="Q4 Search - US" className="col-span-2" />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">ROI Trend (30d)</p>
              <ChartContainer
                config={{ roi: { label: "ROI", color: "hsl(var(--primary))" } }}
                className="aspect-[16/9]"
              >
                <LineChart data={roiTrend} margin={{ left: 8, right: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[1, 2.2]} tickLine={false} axisLine={false} tickMargin={8} />
                  <Line type="monotone" dataKey="roi" stroke="var(--color-roi)" strokeWidth={2} dot={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Channel-wise Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {channels.map((c) => (
                <div key={c.name} className="rounded-lg border p-4 shadow-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-medium">{c.name}</p>
                    <Badge variant={c.roi >= 1.5 ? "default" : "secondary"}>{c.roi.toFixed(1)}x</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Spend</div>
                    <div className="text-right font-medium text-foreground">${c.spend.toLocaleString()}</div>
                    <div>CTR</div>
                    <div className="text-right font-medium text-foreground">{c.ctr}%</div>
                    <div>Conv. Rate</div>
                    <div className="text-right font-medium text-foreground">{c.cr}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Performance • Spend vs ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              spend: { label: "Spend", color: "hsl(var(--accent))" },
              roi: { label: "ROI", color: "hsl(var(--primary))" },
            }}
            className="aspect-[16/6]"
          >
            <BarChart data={spendVsRoi} margin={{ left: 8, right: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0.6, 2.2]} tickLine={false} axisLine={false} />
              <Bar dataKey="spend" yAxisId="left" fill="var(--color-spend)" radius={[6,6,0,0]} />
              <Line type="monotone" yAxisId="right" dataKey="roi" stroke="var(--color-roi)" strokeWidth={2} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
