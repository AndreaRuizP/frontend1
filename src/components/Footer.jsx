import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E0E5EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#141B21] dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_1fr] md:items-start">
          <div>
            <div className="flex items-center mb-3">
              <img src={logo} alt="Logo CleanPoints" className="h-7 mr-2" />
              <span className="font-bold text-xl">CleanPoints</span>
            </div>
            <p className="max-w-md text-[#7D8797] dark:text-slate-400 text-sm leading-6">
              Educando para un manejo adecuado de residuos sólidos y promoviendo un planeta más limpio.
            </p>
          </div>

          <div>
            <span className="font-semibold text-base block mb-3">Síguenos</span>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="transition hover:text-green-600 dark:hover:text-green-400">
                <i className="bi bi-facebook text-2xl"></i>
              </a>
              <a href="#" aria-label="Twitter" className="transition hover:text-green-600 dark:hover:text-green-400">
                <i className="bi bi-twitter text-2xl"></i>
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:text-green-600 dark:hover:text-green-400">
                <i className="bi bi-instagram text-2xl"></i>
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <span className="font-semibold text-base block mb-3">Legal</span>
            <div className="flex flex-col gap-2 text-sm text-[#7D8797] dark:text-slate-400 md:items-end">
              <a href="#" className="hover:underline hover:text-green-600 dark:hover:text-green-400">Términos de Servicio</a>
              <a href="#" className="hover:underline hover:text-green-600 dark:hover:text-green-400">Política de Privacidad</a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#E0E5EB] dark:border-slate-800" />

        <div className="flex flex-col gap-3 text-sm text-[#7D8797] dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>© 2025 CleanPoints. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}