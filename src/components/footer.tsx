export default function Footer() {
  return (
    <footer className="relative bg-black py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-center items-center gap-3">
          <span className="w-32 h-px bg-gradient-to-r from-transparent to-[#e94560]/50" />
          <span className="text-white/40 text-sm tracking-[0.3em] uppercase">
            Jul
          </span>
          <span className="w-32 h-px bg-gradient-to-l from-transparent to-[#e94560]/50" />
        </div>
      </div>
    </footer>
  );
}
