// ========================================
// Next.js App – Sequential Blueprint Generation (improved UI)
// ========================================
"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Loader2,
  Circle,
  XCircle,
} from "lucide-react";
import HealthBlueprintUI from "@/components/HealthBlueprintUI";

interface FileStatus {
  state: "pending" | "processing" | "done" | "error";
  summary?: string;
  error?: string;
}

const FILES: string[] = [
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy's%20Allelica%20polygenic%20panel%20(1).pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/0057.AS___CRR___Year_2.pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/amy%20labs.pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy%20Shpall%20Medical%20Report%20Dec%202023%20(1).pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy%20Shpall%20Medical%20Report%20July%202025%20(2).pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy's%20Alzheimer's%20risk%20report%20(1).pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy's%20InBody,%20EKG,%20Labs%20March%2025%20(1).pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Amy's%20mammogram%20May%20'25.pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Decades%20Health%20Summary.pdf",
  "https://whgeuauulzwtyigriged.supabase.co/storage/v1/object/public/media/Amy%20Samuel/Grail%20Order%20558-ECVI-L4Z%20-%20Test%20Result%20Report%20GAL0YLFFLR-1%20(1).pdf",
];

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [blueprint, setBlueprint] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [fileStatuses, setFileStatuses] =
    useState<Record<string, FileStatus>>(() =>
      Object.fromEntries(FILES.map((f) => [f, { state: "pending" }]))
    );
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  // Load prompt file on mount
  useEffect(() => {
    fetch("/prompts/amy-samuel.txt")
      .then((res) => res.text())
      .then(setPrompt)
      .catch((err) => console.error("Failed to load prompt:", err));
  }, []);

  async function generate() {
    if (!prompt) {
      alert("Prompt is still loading. Please try again in a moment.");
      return;
    }

    setStarted(true);
    setLoading(true);
    setBlueprint("");

    const summaries: string[] = [];

    for (const fileUrl of FILES) {
      setCurrentFile(fileUrl);
      setFileStatuses((s) => ({
        ...s,
        [fileUrl]: { state: "processing" },
      }));

      try {
        const res = await fetch("/api/summarise-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl }),
        });
        const data = await res.json();
        summaries.push(`\n### ${fileUrl.split("/").pop()}\n${data.summary}`);
        setFileStatuses((s) => ({
          ...s,
          [fileUrl]: { state: "done", summary: data.summary },
        }));
      } catch (err: any) {
        console.error(err);
        setFileStatuses((s) => ({
          ...s,
          [fileUrl]: { state: "error", error: err.message || "Error" },
        }));
      }
    }

    // Collate summaries and generate blueprint
    const res = await fetch("/api/generate-blueprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        summaries: summaries.join("\n\n"),
      }),
    });

    const data = await res.json();
    setBlueprint(data.blueprint || "No blueprint generated");
    setLoading(false);
    setCurrentFile(null);
  }

  function renderIcon(state: FileStatus["state"]) {
    switch (state) {
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  }

  // ---------- UI ----------
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gray-50">
      {!blueprint ? (
        <>
          <div className="w-full max-w-lg">
            <Button
              className="w-full h-16 rounded-full text-lg font-semibold bg-gradient-to-r from-[#F35126] to-[#FE8432]"
              onClick={generate}
              disabled={loading || !prompt}
            >
              {loading ? "Generating…" : "Generate Blueprint"}
            </Button>
          </div>

          {/* Progress list – only visible after generation starts */}
          {started && (
            <ul className="w-full max-w-lg max-h-96 overflow-auto divide-y rounded-xl bg-white shadow p-4 text-sm">
              {FILES.map((f) => {
                const status = fileStatuses[f];
                return (
                  <li key={f} className="py-2 flex items-start space-x-3">
                    {renderIcon(status.state)}
                    <div className="flex-1">
                      <p className="font-medium break-all">
                        {f.split("/").pop()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {status.state === "pending" && "Waiting"}
                        {status.state === "processing" && "Analyzing…"}
                        {status.state === "done" && "Analyzed"}
                        {status.state === "error" && status.error}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Current file info */}
          {currentFile && (
            <p className="text-xs text-gray-600">
              Analyzing: {currentFile.split("/").pop()}
            </p>
          )}
        </>
      ) : (
        <div className="w-full h-full overflow-auto bg-white">
          <HealthBlueprintUI blueprint={typeof blueprint === "string" ? JSON.parse(blueprint) : blueprint} />
          {/* <pre className="whitespace-pre-wrap text-sm">{typeof blueprint === "string" ? blueprint : JSON.stringify(blueprint, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}
