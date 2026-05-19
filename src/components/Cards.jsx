const CARDS = [
  {
    icon: <i className="fi fi-rr-marker text-[#13A3F7] dark:text-[#38bdf8] text-3xl mb-4"></i>,
    title: "Mapa de Contenedores",
    desc: "Encuentra contenedores cercanos mediante geolocalización y escanea códigos QR al depositar residuos.",
  },
  {
    icon: <i className="fi fi-rr-recycle text-[#00C9A7] dark:text-[#4ade80] text-3xl mb-4"></i>,
    title: "Validación de Acciones",
    desc: "Sube fotos como evidencia de tu correcta disposición de residuos y recibe validación.",
  },
  {
    icon: <i className="fi fi-rr-coins text-[#FFD300] dark:text-[#fbbf24] text-3xl mb-4"></i>,
    title: "Sistema de Puntos",
    desc: "Gana CleanPoints por cada acción validada y acumula puntos para canjear por recompensas.",
  },
  {
    icon: <i className="fi fi-rr-shopping-bag text-[#8F50FD] dark:text-[#a78bfa] text-3xl mb-4"></i>,
    title: "Marketplace Sostenible",
    desc: "Canjea tus puntos por productos de pequeños productores que trabajan con materiales reciclados.",
  },
  {
    icon: <i className="fi fi-rr-users-alt text-[#FF5B5B] dark:text-[#f87171] text-3xl mb-4"></i>,
    title: "Retos y Referidos",
    desc: "Participa en retos diarios individuales y grupales, e invita a amigos para completar tareas juntos.",
  },
];

export default function Cards() {
  return (
    <div className="w-full mx-auto grid gap-5 sm:grid-cols-2 xl:grid-cols-3 pb-8">
      {CARDS.map((card) => (
        <div
          key={card.title}
          className="min-h-[180px] bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-emerald-950/20"
        >
          {card.icon}
          <h3 className="text-lg font-bold text-[#141B21] dark:text-slate-100 mb-2">{card.title}</h3>
          <p className="text-[#7D8797] dark:text-slate-400 text-sm leading-6">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}