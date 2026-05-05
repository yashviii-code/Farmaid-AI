import { Leaf } from "lucide-react";

export function Logo({ className = "", textClassName = "text-2xl" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
        <Leaf className="w-5 h-5 text-white" />
      </div>
      <span className={`font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent ${textClassName}`}>
        FarmAid AI
      </span>
    </div>
  );
}
