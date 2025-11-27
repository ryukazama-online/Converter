// Desimal-Biner-Heksadesimal-Oktal Converter
// Single-file React component (Next.js page or React app entry)
// Tailwind classes used for styling — if you deploy on Vercel with Next.js, make sure Tailwind is configured,
// or the UI will still work but without Tailwind styles.

import { useState } from "react";

export default function ConverterPage() {
  const [input, setInput] = useState("");
  const [detected, setDetected] = useState("");
  const [error, setError] = useState("");

  function detectBase(str) {
    const s = String(str).trim();
    if (!s) return null;
    if (/^[01]+$/i.test(s)) return "binary"; // only 0-1
    if (/^[0-7]+$/i.test(s)) return "octal"; // 0-7 digits only
    if (/^[0-9]+$/i.test(s)) return "decimal"; // all digits 0-9
    if (/^[0-9A-Fa-f]+$/i.test(s)) return "hex"; // hex allowed
    return null;
  }

  function toDecimal(str, base) {
    try {
      if (base === "auto") {
        base = detectBase(str) || "decimal";
      }
      if (!base) throw new Error("Tidak dapat mendeteksi basis input");
      const radix = (base === "binary") ? 2 : (base === "octal") ? 8 : (base === "hex") ? 16 : 10;
      const val = parseInt(String(str).trim(), radix);
      if (Number.isNaN(val)) throw new Error("Input tidak valid untuk basis yang dipilih");
      return val;
    } catch (e) {
      throw e;
    }
  }

  function convertAll(str, base = "auto") {
    setError("");
    try {
      const dec = toDecimal(str, base);
      setDetected(base === "auto" ? detectBase(str) || "decimal" : base);
      return {
        decimal: String(dec),
        binary: dec.toString(2),
        octal: dec.toString(8),
        hex: dec.toString(16).toUpperCase()
      };
    } catch (e) {
      setError(e.message || "Kesalahan konversi");
      return null;
    }
  }

  const [result, setResult] = useState(null);
  const [inputBase, setInputBase] = useState("auto");

  function handleConvert(e) {
    e && e.preventDefault();
    const r = convertAll(input, inputBase);
    setResult(r);
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setError("");
    setDetected("");
  }

  async function copy(val) {
    try {
      await navigator.clipboard.writeText(val);
      // tiny UI feedback by briefly setting detected to "copied"
      setDetected("copied");
      setTimeout(() => setDetected("") , 900);
    } catch (e) {
      setError("Gagal menyalin: " + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Converter — Desimal ⇄ Biner / Heksa / Oktal</h1>
        <p className="text-sm text-gray-500 mb-4">Masukkan angka di bawah. Pilih "Auto" untuk deteksi otomatis basis input.</p>

        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Input</label>
            <div className="mt-1 flex gap-2">
              <input
                className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="contoh: 255 atau FF atau 11111111 atau 377"
                value={input}
                onChange={(e)=> setInput(e.target.value)}
              />

              <select
                value={inputBase}
                onChange={(e)=> setInputBase(e.target.value)}
                className="rounded-md border px-3 py-2"
                title="Pilih basis input atau Auto"
              >
                <option value="auto">Auto</option>
                <option value="decimal">Desimal</option>
                <option value="binary">Biner (basis 2)</option>
                <option value="hex">Heksadesimal (basis 16)</option>
                <option value="octal">Oktal (basis 8)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Convert</button>
            <button type="button" onClick={handleClear} className="px-4 py-2 rounded border">Clear</button>
            <button type="button" onClick={()=>{ const r = convertAll(input, inputBase); if(r) { setResult(r); navigator.clipboard.writeText(JSON.stringify(r)); setDetected('copied'); setTimeout(()=>setDetected(''),900); } }} className="px-4 py-2 rounded border">Copy JSON</button>
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          {result && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card label="Desimal" value={result.decimal} onCopy={()=>copy(result.decimal)} />
              <Card label="Biner" value={result.binary} onCopy={()=>copy(result.binary)} />
              <Card label="Heksa" value={result.hex} onCopy={()=>copy(result.hex)} />
              <Card label="Oktal" value={result.octal} onCopy={()=>copy(result.octal)} />
            </div>
          )}

          <div className="pt-4 text-sm text-gray-500">Detected: {detected || (input ? detectBase(input) || 'unknown' : '-')}</div>
        </form>

        <footer className="mt-6 text-xs text-gray-400">
          Tips: untuk hex beri tanpa prefix (contoh: <code>FF</code>), untuk biner gunakan hanya 0/1.
        </footer>
      </div>
    </div>
  );
}

function Card({ label, value, onCopy }){
  return (
    <div className="p-3 border rounded-lg flex items-start justify-between gap-3">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-mono break-all mt-1">{value}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button onClick={onCopy} className="text-sm px-2 py-1 border rounded">Copy</button>
      </div>
    </div>
  );
}
