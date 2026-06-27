import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Plus, Timer, RotateCcw } from "lucide-react";
import AppShell from "@/components/AppShell";
import type { Roommate, ChoresTask } from "@/lib/data";

const frequencyTokens: Record<
  string,
  { light: string; dark: string }
> = {
  daily: {
    light: "bg-blue-100 text-blue-700",
    dark: "dark:bg-blue-900 dark:text-blue-300",
  },
  weekly: {
    light: "bg-purple-100 text-purple-700",
    dark: "dark:bg-purple-900 dark:text-purple-300",
  },
  biweekly: {
    light: "bg-amber-100 text-amber-700",
    dark: "dark:bg-amber-900 dark:text-amber-300",
  },
  monthly: {
    light: "bg-green-100 text-green-700",
    dark: "dark:bg-green-900 dark:text-green-300",
  },
};

async function fetchChoresData(): Promise<{ roommates: Roommate[]; chores: ChoresTask[] }> {
  const [roommatesRes, choresRes] = await Promise.all([
    fetch("/api/roommates", { cache: "no-store" }),
    fetch("/api/chores", { cache: "no-store" }),
  ]);

  const [roommates, chores] = await Promise.all([
    roommatesRes.json(),
    choresRes.json(),
  ]);

  return { roommates, chores };
}

export default async function ChoresPage() {
  const { roommates, chores } = await fetchChoresData();

  const completed = chores.filter((c) => c.completed).length;
  const total = chores.length;
  const pending = total - completed;

  const choresByStatus = {
    pending: chores.filter((c) => !c.completed),
    completed: chores.filter((c) => c.completed),
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto p-5 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chores</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage household chores.
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Chore
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">
                  {total > 0 ? Math.round((completed / total) * 100) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending chores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Pending Chores</span>
              <span className="text-sm font-normal text-muted-foreground">
                {choresByStatus.pending.length} remaining
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {choresByStatus.pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Circle className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm font-medium">All chores completed!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Great job, team!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {choresByStatus.pending.map((chore) => {
                  const roommate = roommates.find(
                    (r) => r.id === chore.assignedTo
                  );
                  return (
                    <div
                      key={chore.id}
                      className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent/30 transition-colors"
                    >
                      <div
                        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-border hover:border-primary hover:bg-accent transition-colors"
                        role="checkbox"
                        aria-checked="false"
                        tabIndex={0}
                      >
                        <Circle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{chore.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Assigned to {roommate?.name || "Unknown"} · assigned{" "}
                          {new Date(chore.assignedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`capitalize ${frequencyTokens[chore.frequency]?.light ?? ""} ${frequencyTokens[chore.frequency]?.dark ?? ""}`}
                      >
                        {chore.frequency}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed chores */}
        {choresByStatus.completed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {choresByStatus.completed.map((chore) => {
                  const roommate = roommates.find(
                    (r) => r.id === chore.assignedTo
                  );
                  return (
                    <div
                      key={chore.id}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm font-medium line-through">
                        {chore.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {roommate?.name || "Unknown"}
                      </span>
                      {chore.completedAt && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Done {new Date(chore.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chore rotation table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chore Overview by Roommate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roommates.map((roommate) => {
                const choresAssigned = chores.filter(
                  (c) => c.assignedTo === roommate.id
                );
                const choresDone = choresAssigned.filter((c) => c.completed).length;
                const pct =
                  choresAssigned.length > 0
                    ? Math.round((choresDone / choresAssigned.length) * 100)
                    : 0;
                return (
                  <div key={roommate.id} className="flex items-center gap-3 hover:bg-accent/30 rounded-lg p-2 -mx-2 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      {roommate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{roommate.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {choresDone}/{choresAssigned.length} ({pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
