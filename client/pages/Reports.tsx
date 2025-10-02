import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function Reports() {
  const [range, setRange] = useState<"7d" | "30d" | "custom">("30d");

  const roiTrend = useMemo(() => {
    const points = range === "7d" ? 7 : 30;
    return Array.from({ length: points }).map((_, i) => ({
      day: i + 1,
      roi: Number((1.3 + Math.sin(i / 4) * 0.2 + i / (points * 4)).toFixed(2)),
    }));
  }, [range]);

  const channelComparison = useMemo(
    () => [
      { channel: "Google Ads", roi: 2.0, spend: 72000 },
      { channel: "Facebook", roi: 1.2, spend: 22000 },
      { channel: "Instagram", roi: 1.1, spend: 15000 },
      { channel: "LinkedIn", roi: 1.4, spend: 15300 },
    ],
    [],
  );

  const campaigns = [
    {
      name: "Q4 Search - US",
      channel: "Google Ads",
      spend: 42000,
      conv: 3100,
      roi: 2.3,
      cpa: 13.5,
    },
    {
      name: "Holiday Promo - FB",
      channel: "Facebook",
      spend: 12000,
      conv: 650,
      roi: 1.2,
      cpa: 18.4,
    },
    {
      name: "IG Retargeting",
      channel: "Instagram",
      spend: 9000,
      conv: 380,
      roi: 1.1,
      cpa: 23.7,
    },
    {
      name: "B2B Lead Gen Q4",
      channel: "LinkedIn",
      spend: 10200,
      conv: 560,
      roi: 1.4,
      cpa: 18.2,
    },
  ];

  const exportCSV = () => {
    const head = ["Campaign", "Channel", "Spend", "Conversions", "ROI", "CPA"];
    const rows = campaigns.map((c) => [
      c.name,
      c.channel,
      c.spend,
      c.conv,
      c.roi,
      c.cpa,
    ]);
    const csv = [head, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adroi-campaign-performance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  const shareReport = async () => {
    const shareData = {
      title: "AdROI Report",
      text: "Check out this AdROI report",
      url: window.location.href,
    };
    try {
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Download and share detailed performance reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportPDF}>Export as PDF</Button>
          <Button variant="outline" onClick={shareReport}>
            Share Report
          </Button>
        </div>
      </div>

      <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value={range} className="mt-4" />
      </Tabs>

      <div className="grid gap-4 md:grid-cols-5">
        <KPI title="ROI" value={range === "7d" ? "1.9x" : "2.0x"} />
        <KPI title="CTR" value="3.4%" />
        <KPI title="Conversions" value="8,245" />
        <KPI title="Spend" value="$124,300" />
        <KPI title="CPA" value="$17.45" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ROI Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ roi: { label: "ROI", color: "hsl(var(--primary))" } }}
              className="aspect-[16/8]"
            >
              <LineChart
                data={roiTrend}
                margin={{ left: 8, right: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={[1, 2.4]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="var(--color-roi)"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                spend: { label: "Spend", color: "hsl(var(--accent))" },
                roi: { label: "ROI", color: "hsl(var(--primary))" },
              }}
              className="aspect-[16/8]"
            >
              <BarChart
                data={channelComparison}
                margin={{ left: 8, right: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="channel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Bar
                  dataKey="spend"
                  fill="var(--color-spend)"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="var(--color-roi)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1">
          <CardTitle>Campaign Performance</CardTitle>
          <div>
            <Button size="sm" onClick={exportCSV}>
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>CPA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.channel}</TableCell>
                  <TableCell>${c.spend.toLocaleString()}</TableCell>
                  <TableCell>{c.conv.toLocaleString()}</TableCell>
                  <TableCell>{c.roi.toFixed(1)}x</TableCell>
                  <TableCell>${c.cpa.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-secondary/50">
        <CardContent className="p-4 text-sm">
          ROI 2.0x achieved this week due to Google Ads scale-up.
        </CardContent>
      </Card>
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
