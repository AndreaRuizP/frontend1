const CARDS = [
  {
    icon: <i className="fi fi-rr-marker text-[#13A3F7] text-3xl mb-4"></i>,
    title: "Mapa de Contenedores",
    desc: "Encuentra contenedores cercanos mediante geolocalización y escanea códigos QR al depositar residuos.",
  },
  {
    icon: <i className="fi fi-rr-recycle text-[#00C9A7] text-3xl mb-4"></i>,
    title: "Validación de Acciones",
    desc: "Sube fotos como evidencia de tu correcta disposición de residuos y recibe validación.",
  },
  {
    icon: <i className="fi fi-rr-coins text-[#FFD300] text-3xl mb-4"></i>,
    title: "Sistema de Puntos",
    desc: "Gana CleanPointss por cada acción validada y acumula puntos para canjear por recompensas.",
  },
  {
    icon: <i className="fi fi-rr-shopping-bag text-[#8F50FD] text-3xl mb-4"></i>,
    title: "Marketplace Sostenible",
    desc: "Canjea tus puntos por productos de pequeños productores que trabajan con materiales reciclados.",
  },
  {
    icon: <i className="fi fi-rr-users-alt text-[#FF5B5B] text-3xl mb-4"></i>,
    title: "Retos y Referidos",
    desc: "Participa en retos diarios individuales y grupales, e invita a amigos para completar tareas juntos.",
  },
];

export default function Cards() {
  return (
    <div className="w-full mx-auto grid gap-4 sm:grid-cols-2 xl:grid-cols-3 pb-8">
      {CARDS.map(card => (
        <div
          key={card.title}
          className="min-h-[180px] bg-white border border-[#E0E5EB] rounded-xl p-6 flex flex-col items-center text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {card.icon}
          <h3 className="text-lg font-bold text-[#141B21] mb-2">{card.title}</h3>
          <p className="text-[#7D8797] text-sm">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
