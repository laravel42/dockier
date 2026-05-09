import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Rocket, CircleCheck, Plus, Trash2 } from "lucide-react";
import {
  useProjects,
  useDeployProviders,
  useGitConnections,
  useCreateDeployment,
} from "@/lib/queries";
import { parseOwnerRepo } from "@/lib/repo";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Pre-selected project — if provided, the project step is skipped. */
  initialProjectId?: string;
}

type Step = "project" | "provider" | "build" | "confirm";

const buildMethods = [
  { id: "dockerfile", label: "Dockerfile" },
  { id: "railpack", label: "Railpack" },
  { id: "nixpacks", label: "Nixpacks" },
  { id: "codebuild", label: "CodeBuild" },
] as const;

const strategies = [
  { id: "vps", label: "VPS / EC2" },
  { id: "managed", label: "Managed (ECS / Cloud Run)" },
  { id: "static", label: "Static site" },
] as const;

export function DeployWizard({ open, onOpenChange, initialProjectId }: Props) {
  const { data: projects = [] } = useProjects();
  const { data: providers = [] } = useDeployProviders();
  const { data: connections = [] } = useGitConnections();
  const createDeploy = useCreateDeployment();

  const [step, setStep] = useState<Step>(initialProjectId ? "provider" : "project");
  const [projectId, setProjectId] = useState<string>(initialProjectId ?? "");
  const [providerId, setProviderId] = useState<string>("");
  const [strategy, setStrategy] = useState<(typeof strategies)[number]["id"]>("vps");
  const [buildMethod, setBuildMethod] = useState<(typeof buildMethods)[number]["id"]>("dockerfile");
  const [skipPipeline, setSkipPipeline] = useState(false);
  const [envVars, setEnvVars] = useState<Array<{ name: string; value: string }>>([]);

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  // Choose the git connection associated with the project (fall back to first).
  const gitConnectionId = useMemo(() => {
    if (project?.connectionId) return project.connectionId;
    return connections[0]?.id ?? "";
  }, [project, connections]);

  useEffect(() => {
    if (!open) {
      setStep(initialProjectId ? "provider" : "project");
      setProjectId(initialProjectId ?? "");
      setProviderId("");
      setStrategy("vps");
      setBuildMethod("dockerfile");
      setSkipPipeline(false);
      setEnvVars([]);
    }
  }, [open, initialProjectId]);

  const next = () => {
    if (step === "project" && projectId) setStep("provider");
    else if (step === "provider" && providerId) setStep("build");
    else if (step === "build") setStep("confirm");
  };

  const back = () => {
    if (step === "confirm") setStep("build");
    else if (step === "build") setStep("provider");
    else if (step === "provider" && !initialProjectId) setStep("project");
  };

  const submit = async () => {
    if (!project) {
      toast.error("Select a project first");
      return;
    }
    if (!providerId) {
      toast.error("Select a deploy provider");
      return;
    }
    if (!gitConnectionId) {
      toast.error("No Git connection associated with the project");
      return;
    }

    const owner = parseOwnerRepo(project.repository);

    try {
      await createDeploy.mutateAsync({
        providerId,
        gitConnectionId,
        projectId: project.id,
        repo: owner ? `${owner.owner}/${owner.repo}` : project.repository,
        branch: project.branch,
        deployStrategy: strategy,
        buildMethod,
        skipPipeline,
        envVars: envVars.filter((v) => v.name.trim()),
      });
      toast.success("Deployment queued");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start deployment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" /> New deployment
          </DialogTitle>
          <DialogDescription>
            Queue a new deployment for one of your projects. Status updates land on the Deployments
            page.
          </DialogDescription>
        </DialogHeader>

        <Stepper active={step} hasInitial={!!initialProjectId} />

        <div className="space-y-4 pt-2">
          {step === "project" && (
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No projects — create one first
                    </SelectItem>
                  )}
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} · {p.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === "provider" && (
            <div className="space-y-2">
              <Label>Cloud provider</Label>
              <Select value={providerId} onValueChange={setProviderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No providers — add one in Settings → Cloud
                    </SelectItem>
                  )}
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} · {p.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {project && (
                <p className="text-xs text-muted-foreground">
                  Deploying <strong>{project.name}</strong> from branch{" "}
                  <code className="font-mono">{project.branch}</code>.
                </p>
              )}
            </div>
          )}

          {step === "build" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Strategy</Label>
                  <Select
                    value={strategy}
                    onValueChange={(v) => setStrategy(v as (typeof strategies)[number]["id"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Build method</Label>
                  <Select
                    value={buildMethod}
                    onValueChange={(v) => setBuildMethod(v as (typeof buildMethods)[number]["id"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {buildMethods.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
                <div>
                  <Label className="text-xs">Skip pipeline</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Use the cached image and skip rebuild.
                  </p>
                </div>
                <Switch checked={skipPipeline} onCheckedChange={setSkipPipeline} />
              </div>

              <div className="space-y-2">
                <Label>Environment variables</Label>
                {envVars.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="NAME"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...envVars];
                        copy[i] = { ...copy[i], name: e.target.value };
                        setEnvVars(copy);
                      }}
                      className="font-mono"
                    />
                    <Input
                      placeholder="value"
                      value={v.value}
                      onChange={(e) => {
                        const copy = [...envVars];
                        copy[i] = { ...copy[i], value: e.target.value };
                        setEnvVars(copy);
                      }}
                      className="font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setEnvVars([...envVars, { name: "", value: "" }])}
                >
                  <Plus className="h-3.5 w-3.5" /> Add variable
                </Button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-2 rounded-md border border-border/50 bg-muted/20 p-4 text-sm">
              <Row label="Project" value={project?.name ?? "—"} />
              <Row label="Branch" value={project?.branch ?? "—"} />
              <Row
                label="Provider"
                value={providers.find((p) => p.id === providerId)?.label ?? "—"}
              />
              <Row label="Strategy" value={strategy} />
              <Row label="Build method" value={buildMethod} />
              <Row
                label="Env vars"
                value={
                  envVars.filter((v) => v.name.trim()).length === 0
                    ? "none"
                    : `${envVars.filter((v) => v.name.trim()).length} defined`
                }
              />
              {skipPipeline && (
                <Badge variant="secondary" className="text-[10px]">
                  Pipeline skipped
                </Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === "project" || (step === "provider" && !!initialProjectId)}
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
          </Button>

          {step === "confirm" ? (
            <Button onClick={submit} disabled={createDeploy.isPending}>
              <CircleCheck className="mr-1 h-3.5 w-3.5" />
              {createDeploy.isPending ? "Queueing…" : "Deploy"}
            </Button>
          ) : (
            <Button
              onClick={next}
              disabled={(step === "project" && !projectId) || (step === "provider" && !providerId)}
            >
              Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Stepper({ active, hasInitial }: { active: Step; hasInitial: boolean }) {
  const steps: Step[] = hasInitial
    ? ["provider", "build", "confirm"]
    : ["project", "provider", "build", "confirm"];

  const activeIdx = steps.indexOf(active);
  return (
    <ol className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
      {steps.map((s, i) => (
        <li key={s} className={`flex items-center gap-2 ${i === activeIdx ? "text-primary" : ""}`}>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              i <= activeIdx ? "border-primary bg-primary/15 text-primary" : "border-border/60"
            }`}
          >
            {i + 1}
          </span>
          <span>{s}</span>
          {i < steps.length - 1 && <span className="text-border">→</span>}
        </li>
      ))}
    </ol>
  );
}
