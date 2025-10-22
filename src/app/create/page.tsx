"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Sentiment from "sentiment";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Send,
  Loader2,
  Wand2,
  Eye,
  EyeOff,
  ImagePlus,
  Shield,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

const EditorContent = dynamic(
  () => import("@tiptap/react").then((m) => m.EditorContent),
  { ssr: false }
);

export default function CreatePage() {
  const sentiment = new Sentiment();

  // ─── State ─────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("Discussion");
  const [visibility, setVisibility] = useState("Public");
  const [score, setScore] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("0 min");
  const [warn, setWarn] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [community, setCommunity] = useState("");

  // ─── TipTap ─────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: "Write something kind...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const analysis = sentiment.analyze(text);
      setScore(analysis.score);
      setWordCount(text.trim().split(/\s+/).length);
      setReadTime(`${Math.ceil(wordCount / 200)} min`);
      setWarn(
        analysis.score < -3 ? "Tone may sound harsh. Try softening." : null
      );
    },
  });

  // ─── Autosave ───────────────────────────────────────────
  const autosave = useCallback(() => {
    if (!editor) return;
    const data = {
      title,
      intent,
      visibility,
      content: editor.getHTML(),
      image,
    };
    localStorage.setItem("kinddit_draft", JSON.stringify(data));
  }, [title, intent, visibility, image, editor]);

  useEffect(() => {
    const id = setInterval(autosave, 4000);
    return () => clearInterval(id);
  }, [autosave]);

  // ─── Theme Toggle ───────────────────────────────────────
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("kinddit_theme", newTheme);
  };

  // ─── Submit ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!editor || !title.trim() || !community.trim()) {
      toast.error("Add a title, community, and content.");
      return;
    }
    if (warn) {
      toast.error("Tone check failed. Please review.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("🌍 Post shared to Kinddit");
    editor.commands.clearContent();
    setTitle("");
    setCommunity("");
  };

  // ─── AI Mock ────────────────────────────────────────────
  const aiMock = async (text: string, mode: "kindness" | "clarity") => {
    await new Promise((r) => setTimeout(r, 600));
    if (mode === "kindness")
      return text.replace(/hate/gi, "dislike").replace(/angry/gi, "upset");
    return text.replace(/\bvery\b/gi, "").replace(/\breally\b/gi, "");
  };

  const handleAIRewrite = async (mode: "kindness" | "clarity") => {
    if (!editor) return;
    toast.loading(`Rewriting for ${mode}...`);
    const newText = await aiMock(editor.getText(), mode);
    toast.dismiss();
    editor.commands.setContent(newText);
    toast.success(`Rewritten for ${mode}`);
  };

  const handleAISuggestTitle = async () => {
    if (!editor) return;
    const txt = editor.getText().split(" ").slice(0, 10).join(" ");
    setTitle(`“${txt}…”`);
    toast.success("AI suggested a title.");
  };

  // ─── Image Upload (mock) ────────────────────────────────
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
    toast.success("Image added");
  };

  // ─── Adaptive aura ─────────────────────────────────────
  const aura =
    score > 6
      ? "from-emerald-400 to-green-500"
      : score > 2
        ? "from-sky-400 to-indigo-500"
        : score > -2
          ? "from-yellow-400 to-orange-500"
          : "from-rose-500 to-red-600";

  // ─── Render ─────────────────────────────────────────────
  return (
    <div
      className={`relative min-h-screen overflow-hidden flex flex-col items-center transition-colors duration-300 ${theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-950 to-slate-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-gray-100 text-black"
        }`}
    >
      <Toaster />
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-sm px-3 py-1 rounded-full border border-gray-500 hover:border-sky-400 transition-all"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{" "}
        {theme === "dark" ? "Light" : "Dark"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-12 text-4xl font-bold flex items-center gap-2"
      >
        <Sparkles className="text-yellow-400" /> Create a Post
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`relative w-full max-w-3xl bg-gradient-to-r ${aura} p-[2px] rounded-3xl shadow-2xl mt-8`}
      >
        <div
          className={`rounded-3xl p-6 flex flex-col gap-5 ${theme === "dark" ? "bg-gray-950" : "bg-white"
            }`}
        >
          <input
            className="w-full bg-transparent border-b border-gray-700 focus:border-sky-500 outline-none text-2xl font-semibold pb-2 transition"
            placeholder="Title your thought..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full bg-transparent border-b border-gray-700 focus:border-sky-500 outline-none text-lg pb-2 transition"
            placeholder="Choose community..."
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {["Discussion", "Idea", "Question", "Support"].map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.9 }}
                className={`px-3 py-1 rounded-full text-sm ${intent === opt
                    ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                onClick={() => setIntent(opt)}
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1"
            >
              <option>Public</option>
              <option>Private</option>
              <option>Invite-only</option>
            </select>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EditorContent
                    editor={editor}
                    className="prose prose-invert min-h-[250px]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-gray-900 rounded-lg min-h-[250px]"
                  dangerouslySetInnerHTML={{
                    __html: editor?.getHTML() || "",
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {image && (
            <motion.img
              src={image}
              alt="upload preview"
              className="rounded-lg max-h-64 object-cover border border-gray-700"
            />
          )}
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <ImagePlus size={16} /> Add image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          <div className="flex justify-between text-sm text-gray-400">
            <span>
              {wordCount} words • ≈ {readTime}
            </span>
            {warn && <span className="text-rose-400">{warn}</span>}
          </div>

          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 bg-gray-800 rounded-lg flex items-center gap-1"
                onClick={() => handleAIRewrite("kindness")}
              >
                <Wand2 size={16} /> Kindness
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 bg-gray-800 rounded-lg flex items-center gap-1"
                onClick={() => handleAIRewrite("clarity")}
              >
                <Zap size={16} /> Clarity
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 bg-gray-800 rounded-lg flex items-center gap-1"
                onClick={handleAISuggestTitle}
              >
                <Shield size={16} /> Suggest Title
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 text-sm text-gray-400"
              onClick={() => setPreview((p) => !p)}
            >
              {preview ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
              {preview ? "Edit" : "Preview"}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={saving}
            className={`mt-4 w-full flex justify-center items-center gap-2 py-3 rounded-full font-semibold text-lg transition-all ${saving
                ? "bg-gray-700"
                : "bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-indigo-400 hover:to-sky-500"
              }`}
          >
            {saving ? <Loader2 className="animate-spin" /> : <Send />}
            {saving ? "Sending..." : "Send to Kinddit"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
