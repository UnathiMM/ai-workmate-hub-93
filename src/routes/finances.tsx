import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Wallet, Plus, Trash2, Download, Upload, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { analyzeFinances } from "@/lib/ai-tools.functions";

export const Route = createFileRoute("/finances")({
  head: () => ({ meta: [{ title: "Finance Tracker — Workly AI" }] }),
  component: FinancesPage,
});

type TxType = "income" | "expense";
type Tx = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TxType;
  amount: number;
};

const STORAGE_KEY = "workly.finances.v1";
const LINK_KEY = "workly.finances.link.v1";

const CATEGORIES = ["Sales", "Services", "Salary", "Rent", "Utilities", "Software", "Marketing", "Travel", "Supplies", "Taxes", "Other"];

function load(): Tx[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save(rows: Tx[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function FinancesPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [link, setLink] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sales");
  const [type, setType] = useState<TxType>("income");
  const [amount, setAmount] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const analyze = useServerFn(analyzeFinances);

  useEffect(() => {
    setRows(load());
    setLink(localStorage.getItem(LINK_KEY) || "");
  }, []);

  const totals = useMemo(() => {
    const income = rows.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
    const expense = rows.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
    return { income, expense, net: income - expense };
  }, [rows]);

  function addRow() {
    const amt = parseFloat(amount);
    if (!description.trim() || !amt || isNaN(amt)) return toast.error("Description and amount required");
    const tx: Tx = { id: crypto.randomUUID(), date, description: description.trim(), category, type, amount: Math.abs(amt) };
    const next = [tx, ...rows];
    setRows(next); save(next);
    setDescription(""); setAmount("");
    toast.success("Transaction added");
  }

  function removeRow(id: string) {
    const next = rows.filter((r) => r.id !== id);
    setRows(next); save(next);
  }

  function updateRow(id: string, patch: Partial<Tx>) {
    const next = rows.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setRows(next); save(next);
  }

  function saveLink() {
    localStorage.setItem(LINK_KEY, link);
    toast.success("Spreadsheet link saved");
  }

  function exportCsv() {
    const header = "Date,Description,Category,Type,Amount\n";
    const body = rows.map((r) => [r.date, `"${r.description.replace(/"/g, '""')}"`, r.category, r.type, r.amount].join(",")).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `finances-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const start = lines[0]?.toLowerCase().startsWith("date,") ? 1 : 0;
      const imported: Tx[] = [];
      for (let i = start; i < lines.length; i++) {
        const m = lines[i].match(/("[^"]*"|[^,]*)(?:,|$)/g);
        if (!m) continue;
        const parts = m.map((s) => s.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
        const [d, desc, cat, t, amt] = parts;
        const n = parseFloat(amt);
        if (!desc || isNaN(n)) continue;
        imported.push({
          id: crypto.randomUUID(),
          date: d || new Date().toISOString().slice(0, 10),
          description: desc,
          category: cat || "Other",
          type: (t === "expense" ? "expense" : "income"),
          amount: Math.abs(n),
        });
      }
      const next = [...imported, ...rows];
      setRows(next); save(next);
      toast.success(`Imported ${imported.length} rows`);
    };
    reader.readAsText(file);
  }

  async function runInsights() {
    if (!rows.length) return toast.error("Add some transactions first");
    setLoading(true);
    try {
      const res = await analyze({ data: { transactions: rows } });
      setInsight(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <PageHeader
        title="Finance Tracker"
        description="Log income and expenses, link your business spreadsheet, and get AI insights on your numbers."
        icon={<Wallet className="size-5" />}
      />
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Income" value={fmt(totals.income)} tone="positive" />
          <SummaryCard label="Expenses" value={fmt(totals.expense)} tone="negative" />
          <SummaryCard label="Net" value={fmt(totals.net)} tone={totals.net >= 0 ? "positive" : "negative"} />
        </div>

        {/* Spreadsheet link */}
        <div className="rounded-xl border bg-card p-5 shadow-soft">
          <Label className="text-sm">Linked spreadsheet (Google Sheets, Excel Online, Notion, Airtable…)</Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/…" />
            <Button onClick={saveLink} variant="secondary">Save</Button>
            {link && (
              <Button asChild variant="outline">
                <a href={link} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /> Open</a>
              </Button>
            )}
          </div>
        </div>

        {/* Add transaction */}
        <div className="rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Add transaction</h2>
          <div className="grid gap-3 md:grid-cols-6">
            <div className="space-y-1.5 md:col-span-1"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="space-y-1.5 md:col-span-2"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Client invoice #1042" /></div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TxType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Amount</Label><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={addRow}><Plus className="size-4" /> Add</Button>
            <Button variant="outline" onClick={exportCsv}><Download className="size-4" /> Export CSV</Button>
            <label className="inline-flex">
              <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
              <Button variant="outline" asChild><span><Upload className="size-4" /> Import CSV</span></Button>
            </label>
            <Button variant="secondary" onClick={runInsights} disabled={loading} className="ml-auto">
              {loading ? <><Loader2 className="size-4 animate-spin" /> Analyzing…</> : <><Sparkles className="size-4" /> AI Insights</>}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No transactions yet. Add one above or import a CSV.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><Input type="date" value={r.date} onChange={(e) => updateRow(r.id, { date: e.target.value })} className="h-8 border-0 bg-transparent p-1" /></TableCell>
                  <TableCell><Input value={r.description} onChange={(e) => updateRow(r.id, { description: e.target.value })} className="h-8 border-0 bg-transparent p-1" /></TableCell>
                  <TableCell>
                    <Select value={r.category} onValueChange={(v) => updateRow(r.id, { category: v })}>
                      <SelectTrigger className="h-8 border-0 bg-transparent p-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.type === "income" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                      {r.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={r.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {r.type === "expense" ? "-" : "+"}{fmt(r.amount)}
                    </span>
                  </TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => removeRow(r.id)}><Trash2 className="size-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Insights */}
        {insight && (
          <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
            <h2 className="font-display text-lg font-semibold">AI Insights</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{insight}</ReactMarkdown></div>
            <AIDisclaimer />
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "positive" | "negative" }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold ${tone === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{value}</div>
    </div>
  );
}
