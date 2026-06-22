import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — san_dev" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setReady(true);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-[#050509] text-foreground/60">Loading admin...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050509] text-foreground">
        <div className="neon-card max-w-md rounded-2xl p-6 text-center">
          <h1 className="text-xl font-bold text-[color:var(--neon-gold)]">Access Denied</h1>
          <p className="mt-2 text-sm text-foreground/70">This account does not have admin privileges.</p>
          <Button onClick={signOut} className="mt-4" variant="outline">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509] text-foreground">
      <header className="sticky top-0 z-20 border-b border-[color:var(--neon-purple)]/30 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-bold text-[color:var(--neon-gold)]">
            san_dev <span className="text-foreground/60">/ admin</span>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="certificates">
          <TabsList>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="physical">Physical Docs</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="certificates" className="mt-6"><CertificatesAdmin /></TabsContent>
          <TabsContent value="physical" className="mt-6"><PhysicalAdmin /></TabsContent>
          <TabsContent value="skills" className="mt-6"><SkillsAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ------------------- Certificates ------------------- */

type Cert = {
  id: string;
  title: string;
  org: string;
  date: string;
  hue: number;
  verify_url: string | null;
  sort_order: number;
};

function CertificatesAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*").order("sort_order");
      if (error) throw error;
      return data as Cert[];
    },
  });
  const [editing, setEditing] = useState<Cert | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "certificates"] });
      qc.invalidateQueries({ queryKey: ["certificates"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="mr-2 h-4 w-4" />Add Certificate</Button>
          </DialogTrigger>
          <CertForm editing={editing} onDone={() => setOpen(false)} />
        </Dialog>
      </div>
      <div className="neon-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Org</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Order</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>}
            {data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell>{c.org}</TableCell>
                <TableCell>{c.date}</TableCell>
                <TableCell>{c.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete "${c.title}"?`)) del.mutate(c.id); }}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-foreground/60">No certificates yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CertForm({ editing, onDone }: { editing: Cert | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    org: editing?.org ?? "",
    date: editing?.date ?? "",
    hue: editing?.hue ?? 200,
    verify_url: editing?.verify_url ?? "",
    sort_order: editing?.sort_order ?? 0,
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, verify_url: form.verify_url || null };
      if (editing) {
        const { error } = await supabase.from("certificates").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certificates").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: ["admin", "certificates"] });
      qc.invalidateQueries({ queryKey: ["certificates"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Certificate</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Organization</Label><Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} /></div>
        <div><Label>Date</Label><Input placeholder="Mar 2025" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Hue (0-360)</Label><Input type="number" value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} /></div>
          <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Verify URL (optional)</Label><Input value={form.verify_url ?? ""} onChange={(e) => setForm({ ...form, verify_url: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title || !form.org || !form.date}>
          {save.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ------------------- Physical Docs ------------------- */

type Phys = {
  id: string;
  title: string;
  tag: string;
  icon: string;
  components: string;
  description: string;
  hue: number;
  sort_order: number;
};

function PhysicalAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "physical_docs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("physical_docs").select("*").order("sort_order");
      if (error) throw error;
      return data as Phys[];
    },
  });
  const [editing, setEditing] = useState<Phys | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("physical_docs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "physical_docs"] });
      qc.invalidateQueries({ queryKey: ["physical_docs"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="mr-2 h-4 w-4" />Add Project</Button>
          </DialogTrigger>
          <PhysForm editing={editing} onDone={() => setOpen(false)} />
        </Dialog>
      </div>
      <div className="neon-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="w-24">Order</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>}
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>{p.tag}</TableCell>
                <TableCell><code>{p.icon}</code></TableCell>
                <TableCell>{p.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete "${p.title}"?`)) del.mutate(p.id); }}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-foreground/60">No projects yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PhysForm({ editing, onDone }: { editing: Phys | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    tag: editing?.tag ?? "",
    icon: editing?.icon ?? "Cpu",
    components: editing?.components ?? "",
    description: editing?.description ?? "",
    hue: editing?.hue ?? 200,
    sort_order: editing?.sort_order ?? 0,
  });
  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("physical_docs").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("physical_docs").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: ["admin", "physical_docs"] });
      qc.invalidateQueries({ queryKey: ["physical_docs"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Physical Project</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Tag</Label><Input placeholder="IoT" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></div>
          <div><Label>Icon (Cpu, Radio, Wrench, Zap)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        </div>
        <div><Label>Components</Label><Input value={form.components} onChange={(e) => setForm({ ...form, components: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Hue (0-360)</Label><Input type="number" value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} /></div>
          <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title || !form.tag}>
          {save.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

/* ------------------- Skills ------------------- */

type SkillGroup = { id: string; title: string; items: string[]; sort_order: number };

function SkillsAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "skill_groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skill_groups").select("*").order("sort_order");
      if (error) throw error;
      return data as SkillGroup[];
    },
  });
  const [editing, setEditing] = useState<SkillGroup | null>(null);
  const [open, setOpen] = useState(false);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skill_groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "skill_groups"] });
      qc.invalidateQueries({ queryKey: ["skill_groups"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="mr-2 h-4 w-4" />Add Skill Group</Button>
          </DialogTrigger>
          <SkillForm editing={editing} onDone={() => setOpen(false)} />
        </Dialog>
      </div>
      <div className="neon-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="w-24">Order</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}
            {data.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.title}</TableCell>
                <TableCell className="text-foreground/70">{g.items.join(", ")}</TableCell>
                <TableCell>{g.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete "${g.title}"?`)) del.mutate(g.id); }}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-foreground/60">No skill groups yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SkillForm({ editing, onDone }: { editing: SkillGroup | null; onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    items: editing?.items.join(", ") ?? "",
    sort_order: editing?.sort_order ?? 0,
  });
  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        items: form.items.split(",").map((s) => s.trim()).filter(Boolean),
        sort_order: form.sort_order,
      };
      if (editing) {
        const { error } = await supabase.from("skill_groups").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("skill_groups").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: ["admin", "skill_groups"] });
      qc.invalidateQueries({ queryKey: ["skill_groups"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Skill Group</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Title</Label><Input placeholder="Frontend" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Items (comma separated)</Label><Textarea rows={3} placeholder="React, TypeScript, Tailwind" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} /></div>
        <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
      </div>
      <DialogFooter>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title}>
          {save.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
