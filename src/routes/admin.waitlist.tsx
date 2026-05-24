import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/waitlist")({
  component: WaitlistAdmin,
});

type Lead = {
  id: string;
  email: string;
  source: string | null;
  user_agent: string | null;
  created_at: string;
};

function WaitlistAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist_leads")
        .select("id,email,source,user_agent,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const sources = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((l) => set.add(l.source ?? "unknown"));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const rows = data ?? [];
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (sourceFilter !== "all" && (r.source ?? "unknown") !== sourceFilter)
        return false;
      if (q && !r.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, search, sourceFilter]);

  const exportCsv = () => {
    const header = "email,source,created_at\n";
    const body = filtered
      .map(
        (r) =>
          `${r.email},${(r.source ?? "").replace(/,/g, " ")},${r.created_at}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeLead = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("waitlist_leads").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error("Could not remove subscriber");
      return;
    }
    toast.success("Subscriber removed");
    queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "leads", "all"] });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Waitlist subscribers</h1>
          <p className="text-sm text-muted-foreground">
            {data?.length ?? 0} total signups
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email"
            className="pl-9"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">Failed to load subscribers</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No subscribers match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Signed up</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-card/40">
                    <td className="px-4 py-3 font-medium">{r.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.source ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLead(r.id)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}