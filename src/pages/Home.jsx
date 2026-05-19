import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import Footer from "../components/Footer";
import Header from "../components/Header";
import heroImage from "../assets/img_1.png";
import clickIcon from "../assets/click.svg";

export default function Home() {
  return (
    <main className="w-full min-h-[calc(100vh-60px)] flex flex-col items-center bg-white">
      <Header />
      <section className="w-full bg-[#eef9ef]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="mx-auto lg:mx-0 text-[clamp(2.2rem,4.8vw,4.1rem)] leading-[0.95] font-extrabold tracking-tight text-[#0f172a] max-w-xl">
                Recicla, Aprende y Gana con CleanPoints
              </h1>
              <p className="mx-auto lg:mx-0 mt-4 max-w-xl text-[1rem] sm:text-[1.06rem] lg:text-[1.08rem] leading-[1.65] text-slate-600">
                Únete a la comunidad que está transformando la forma en que manejamos los residuos. Aprende, actúa y recibe recompensas por tus acciones positivas para el medio ambiente.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:justify-start">
                <Link
                  to="/login"
                  className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-[5px] bg-green-600 px-6 sm:px-7 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-green-700 active:bg-green-800 cursor-pointer"
                >
                  <span>Empieza a Recolectar</span>
                  <img src={clickIcon} alt="" aria-hidden="true" className="icon-click h-5 w-5 object-contain" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Reciclaje"
                className="w-full rounded-lg shadow-lg object-cover h-64 sm:h-80 lg:h-full"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="caracteristicas" className="w-full max-w-6xl mx-auto bg-white pt-10 md:pt-14 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 mb-4 md:mb-6">
        <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2.25rem] font-bold text-center text-[#141B21] mb-3 leading-snug">
          Características Principales
        </h2>
        <p className="mx-auto max-w-3xl text-[0.98rem] sm:text-[1.05rem] md:text-[1.1rem] text-center text-[#666] leading-[1.7] px-2">
          CleanPoints ofrece una experiencia completa para fomentar el manejo adecuado de residuos sólidos.
        </p>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
        <Cards />
      </section>
      <Footer />
    </main>
  );
}