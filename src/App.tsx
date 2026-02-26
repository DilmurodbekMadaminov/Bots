import { motion } from "motion/react";
import { Bot, Server, Database, Shield, ExternalLink, Terminal, CheckCircle2 } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="w-5 h-5 text-zinc-950" />
            </div>
            <h1 className="font-semibold tracking-tight">HR Bot Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Ready for Deploy</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-white"
          >
            Professional HR Telegram Bot
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl"
          >
            A production-ready recruitment bot built with Python (aiogram 2.x), 
            featuring mandatory channel subscription, click tracking, and an admin panel.
          </motion.p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: "Sub Check", desc: "Mandatory channel membership verification" },
            { icon: Database, title: "SQLite DB", desc: "Persistent storage for user analytics" },
            { icon: Server, title: "Webhooks", desc: "High-performance event handling" },
            { icon: Bot, title: "Admin Panel", desc: "Real-time stats for administrators" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
            >
              <feature.icon className="w-6 h-6 text-emerald-500 mb-4" />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Deployment Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Terminal className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-semibold">Deployment Instructions (Render)</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Step 1: Prepare Repository
              </h4>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 font-mono text-sm text-zinc-300">
                <p>1. Create a new GitHub repository.</p>
                <p>2. Upload <span className="text-emerald-400">main.py</span> and <span className="text-emerald-400">requirements.txt</span>.</p>
                <p>3. Ensure your bot token is NOT hardcoded.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Step 2: Deploy via Blueprint (Recommended)
              </h4>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-400">
                  Render'da <span className="text-white font-medium">Blueprint</span> funksiyasidan foydalansangiz, 
                  <code className="text-emerald-400">render.yaml</code> fayli orqali hamma narsa avtomatik sozlanadi:
                </p>
                <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1 ml-2">
                  <li>Webhook manzili avtomatik aniqlanadi</li>
                  <li>Python muhiti sozlanadi</li>
                  <li>Ma'lumotlar bazasi fayli yaratiladi</li>
                </ul>
                <div className="pt-2">
                  <a 
                    href="https://dashboard.render.com/blueprints" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Render Blueprint'ga o'tish <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Step 3: Environment Variables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Variable</p>
                  <code className="text-emerald-400">BOT_TOKEN</code>
                  <p className="text-xs text-zinc-600 mt-2">Your Telegram Bot Token from @BotFather</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Variable</p>
                  <code className="text-emerald-400">WEBHOOK_HOST</code>
                  <p className="text-xs text-zinc-600 mt-2">Your Render service URL (e.g. https://my-bot.onrender.com)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <footer className="pt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm">
            Built for professional HR recruitment workflows.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="https://t.me/Xorazm_ish_bozor1" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium"
            >
              Channel <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://docs.aiogram.dev/en/latest/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium"
            >
              Aiogram Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
