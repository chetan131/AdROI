import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActionItem {
  id: string;
  title: string;
  channel: string;
  roi: number;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  status: "Open" | "Done";
  description?: string;
  cta: string;
  due?: string;
}

export default function Actions() {
  const initialActions: ActionItem[] = useMemo(
    () => [
      {
        id: "a1",
        title: "Increase Budget on Google Ads",
        channel: "Google Ads",
        roi: 2.0,
        impact: "High",
        effort: "Medium",
        status: "Open",
        description: "Scale top campaigns by 20% to capture demand.",
        cta: "Apply Action",
        due: "2025-10-15",
      },
      {
        id: "a2",
        title: "Optimize Facebook Creatives",
        channel: "Facebook",
        roi: 1.2,
        impact: "Medium",
        effort: "Low",
        status: "Open",
        cta: "Start A/B Test",
        due: "2025-10-12",
      },
      {
        id: "a3",
        title: "Retarget Instagram Users",
        channel: "Instagram",
        roi: 1.1,
        impact: "Low",
        effort: "Medium",
        status: "Open",
        cta: "Plan Campaign",
        due: "2025-10-20",
      },
    ],
    [],
  );

  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const openCount = actions.filter((a) => a.status === "Open").length;
  const counts = {
    High: actions.filter((a) => a.impact === "High").length,
    Medium: actions.filter((a) => a.impact === "Medium").length,
    Low: actions.filter((a) => a.impact === "Low").length,
  };

  const quickWins = actions.filter(
    (a) => (a.impact === "High" && a.effort !== "High") || a.effort === "Low",
  );

  const markDone = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Done" } : a)),
    );
  };

  const exportPlan = () => {
    const blob = new Blob([JSON.stringify(actions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adroi-action-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const markFirstPlannedDone = () => {
    const first = actions.find((a) => a.status === "Open");
    if (first) markDone(first.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Recommended Actions
        </h1>
        <p className="text-muted-foreground">
          Based on recent campaign performance, these actions can improve ROI.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Open: {openCount}</Badge>
            <Badge variant="secondary">High: {counts.High}</Badge>
            <Badge variant="secondary">Medium: {counts.Medium}</Badge>
            <Badge variant="secondary">Low: {counts.Low}</Badge>
          </div>
          <div className="ml-auto text-sm text-primary">
            Implementing these could improve ROI by 15%.
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="channels">All Channels</TabsTrigger>
            <TabsTrigger value="quick">Quick Wins</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-4">
          <ActionList items={actions} onDone={markDone} />
        </TabsContent>
        <TabsContent value="channels" className="mt-4">
          <ActionList items={actions} onDone={markDone} />
        </TabsContent>
        <TabsContent value="quick" className="mt-4">
          <ActionList items={quickWins} onDone={markDone} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>ROI Uplift Projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>0.0x</span>
            <span className="text-primary font-medium">+15%</span>
          </div>
          <Progress value={15} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Effort</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{a.channel}</TableCell>
                  <TableCell>{a.impact}</TableCell>
                  <TableCell>{a.effort}</TableCell>
                  <TableCell>{a.due}</TableCell>
                  <TableCell>
                    <Badge
                      variant={a.status === "Open" ? "secondary" : "default"}
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => markDone(a.id)}
                      disabled={a.status === "Done"}
                    >
                      Mark Done
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={exportPlan}>Export Plan</Button>
        <Button variant="outline" onClick={markFirstPlannedDone}>
          Mark First Planned Done
        </Button>
      </div>
    </div>
  );
}

function ActionList({
  items,
  onDone,
}: {
  items: ActionItem[];
  onDone: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((a) => (
        <Card key={a.id} className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{a.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {a.description ? (
              <p className="text-sm text-muted-foreground">{a.description}</p>
            ) : null}
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge>ROI {a.roi.toFixed(1)}x</Badge>
              <Badge variant={a.impact === "High" ? "default" : "secondary"}>
                Impact: {a.impact}
              </Badge>
              <Badge variant={a.effort === "Low" ? "default" : "secondary"}>
                Effort: {a.effort}
              </Badge>
              <Badge variant={a.status === "Open" ? "secondary" : "default"}>
                {a.status}
              </Badge>
            </div>
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => onDone(a.id)}
                disabled={a.status === "Done"}
              >
                {a.cta}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
