import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProject } from "@/lib/queries";
import { useGitConnections } from "@/lib/queries";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [repository, setRepository] = useState("");
  const [branch, setBranch] = useState("main");
  const [connectionId, setConnectionId] = useState<string>("");

  const { data: connections = [] } = useGitConnections();
  const createProject = useCreateProject();

  useEffect(() => {
    if (!open) {
      setName("");
      setRepository("");
      setBranch("main");
      setConnectionId("");
    }
  }, [open]);

  useEffect(() => {
    if (!connectionId && connections.length > 0) {
      setConnectionId(connections[0].id);
    }
  }, [connections, connectionId]);

  const submit = async () => {
    if (!name.trim() || !repository.trim() || !connectionId) {
      toast.error("Name, repository, and a Git connection are required.");
      return;
    }
    try {
      await createProject.mutateAsync({
        name: name.trim(),
        repository: repository.trim(),
        branch: branch.trim() || "main",
        connectionId,
      });
      toast.success("Project created");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Connect a repository to start scanning and deploying it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="np-name">Project name</Label>
            <Input
              id="np-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="edge-gateway"
            />
          </div>
          <div>
            <Label htmlFor="np-repo">Repository</Label>
            <Input
              id="np-repo"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              placeholder="https://github.com/org/repo"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="np-branch">Branch</Label>
              <Input id="np-branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
            </div>
            <div>
              <Label>Git connection</Label>
              <Select value={connectionId} onValueChange={setConnectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connection" />
                </SelectTrigger>
                <SelectContent>
                  {connections.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No connections — add one in Settings
                    </SelectItem>
                  )}
                  {connections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label} · {c.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={createProject.isPending}>
            {createProject.isPending ? "Creating…" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
