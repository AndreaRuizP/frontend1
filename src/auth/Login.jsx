import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail, sanitizeInput, authStorage } from "../utils/security";

const HojaIcon = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="m8.158,7.403c1.236,1.031,2.516,2.097,4.183,2.097,2.142,0,3.932-1.489,4.475-3.5.891.534,1.726,1.349,2.483,2.59l.854-.521c-.955-1.566-2.033-2.528-3.172-3.124.003-.067.019-.129.019-.196,0-2.619-2.09-4.75-4.659-4.75C6.754,0,4.275,4.61,4.172,4.807l-.383.732h.826c1.305,0,2.392.906,3.543,1.865ZM12.341,1c1.939,0,3.515,1.559,3.636,3.516-1.298-.444-2.65-.516-3.977-.516v1c1.35,0,2.672.069,3.91.556-.361,1.681-1.822,2.944-3.569,2.944-1.305,0-2.392-.906-3.543-1.865-1.017-.848-2.062-1.719-3.329-2.002.858-1.191,3.08-3.633,6.872-3.633Zm9.914,10.322l-.449-.686-.404.714c-.674,1.192-1.912,1.889-3.223,2.627-1.373.773-2.792,1.572-3.604,3.007-.619,1.095-.771,2.364-.43,3.572.149.527.399,1.005.708,1.439-.818.309-1.756.505-2.852.505v1c1.388,0,2.575-.26,3.574-.692.255.223.53.425.834.593.733.405,1.528.597,2.313.597,1.67,0,3.294-.869,4.166-2.41,2.792-4.937-.491-10.052-.633-10.267Zm-.238,9.774c-1.014,1.79-3.312,2.43-5.124,1.43-.123-.068-.229-.156-.343-.235,1.61-1.007,2.596-2.501,3.031-3.941l-.957-.289c-.393,1.302-1.323,2.651-2.856,3.516-.301-.379-.526-.816-.661-1.293-.269-.95-.148-1.947.339-2.808.674-1.192,1.913-1.89,3.224-2.627,1.131-.637,2.294-1.292,3.122-2.306.74,1.474,2.163,5.129.226,8.554Zm-13.096.014c-.011-.782.141-1.59.286-2.372.27-1.446.548-2.941-.126-4.426-.536-1.18-1.494-2.075-2.699-2.52-.711-.262-1.456-.327-2.189-.239.207-.879.57-1.666,1.031-2.202l-.758-.651c-.686.799-1.158,1.917-1.354,3.118-.12.045-.243.072-.36.127C.369,13.058-.679,15.93.418,18.346c2.396,5.279,8.307,5.505,8.558,5.512l.835.023-.374-.747c-.333-.666-.507-1.347-.516-2.025Zm-.697-2.555c-.154.829-.314,1.687-.303,2.568.007.553.103,1.104.283,1.646-1.612-.254-5.234-1.222-6.876-4.836-.844-1.86-.083-4.046,1.684-4.984-.026,1.638.472,3.295,1.643,4.412l.689-.724c-1.087-1.037-1.431-2.593-1.312-4.06.236-.047.475-.079.715-.079.434,0,.868.077,1.288.232.952.352,1.71,1.06,2.135,1.995.544,1.198.305,2.476.053,3.83Z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    const cleanEmail = sanitizeInput(email.trim());
    if (!cleanEmail) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!validateEmail(cleanEmail)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // En producción el rol llega desde el servidor; aquí se simula por email
    const role = cleanEmail === "admin@cleanpoints.com" ? "admin" : "user";
    authStorage.setSession("mock-jwt-token", { email: cleanEmail, role });
    navigate(role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{animation: "float1 8s ease-in-out infinite"}} className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-2xl" />
        <div style={{animation: "float2 10s ease-in-out infinite"}} className="absolute bottom-16 right-10 w-48 h-48 bg-emerald-300 rounded-full opacity-20 blur-3xl" />
        <div style={{animation: "float3 12s ease-in-out infinite"}} className="absolute top-1/2 left-1/4 w-24 h-24 bg-lime-200 rounded-full opacity-25 blur-2xl" />
        <div style={{animation: "float1 9s ease-in-out infinite reverse"}} className="absolute top-1/4 right-1/4 w-20 h-20 bg-teal-200 rounded-full opacity-30 blur-xl" />

        <HojaIcon className="absolute top-16 right-20 w-12 h-12 text-green-400 opacity-40" style={{animation: "floatIcon 7s ease-in-out infinite"}} />
        <HojaIcon className="absolute bottom-24 left-16 w-10 h-10 text-emerald-500 opacity-35" style={{animation: "floatIcon 9s ease-in-out infinite 2s"}} />
        <HojaIcon className="absolute top-1/3 left-8 w-8 h-8 text-green-300 opacity-40" style={{animation: "floatIcon 11s ease-in-out infinite 1s"}} />
        <HojaIcon className="absolute bottom-32 right-1/4 w-14 h-14 text-teal-400 opacity-25" style={{animation: "floatIcon 8s ease-in-out infinite 3s"}} />
        <HojaIcon className="absolute top-10 left-1/2 w-7 h-7 text-lime-500 opacity-30" style={{animation: "floatIcon 10s ease-in-out infinite 0.5s"}} />
        <HojaIcon className="absolute bottom-10 left-1/3 w-9 h-9 text-green-400 opacity-35" style={{animation: "floatIcon 6s ease-in-out infinite 1.5s"}} />
        {[
          { top: "15%", left: "55%", size: 6, delay: "0s", dur: "5s" },
          { top: "70%", left: "20%", size: 4, delay: "1s", dur: "6s" },
          { top: "40%", left: "80%", size: 8, delay: "2s", dur: "7s" },
          { top: "85%", left: "60%", size: 5, delay: "0.5s", dur: "8s" },
          { top: "25%", left: "70%", size: 3, delay: "1.5s", dur: "4s" },
        ].map((dot, i) => (
          <div
            key={i}
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              animation: `floatIcon ${dot.dur} ease-in-out infinite ${dot.delay}`,
            }}
            className="absolute bg-green-400 rounded-full opacity-30"
          />
        ))}
      </div>

      <form
        className="bg-white max-w-sm w-full rounded-xl p-8 shadow border border-[#E0E5EB] relative z-10"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-green-600 mb-1">
          CleanPoints
        </h1>
        <p className="text-center text-[#7D8797] text-sm mb-8">
          Inicia sesión para continuar
        </p>
        <label className="block text-black text-sm mb-1" htmlFor="email">
          Correo electrónico
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-green-400 text-base placeholder-[#ADB5BD] ${errors.email ? "border-red-400 mb-1" : "border-[#E0E5EB] mb-4"}`}
          id="email"
          type="email"
          autoComplete="username"
          placeholder="tu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-red-500 text-xs mb-3">{errors.email}</p>
        )}
        <label className="block text-black text-sm mb-1" htmlFor="password">
          Contraseña
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-green-400 text-base ${errors.password ? "border-red-400 mb-1" : "border-[#E0E5EB] mb-6"}`}
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-red-500 text-xs mb-4">{errors.password}</p>
        )}
        <button
          type="submit"
          className="w-full h-11 bg-green-600 text-white font-semibold rounded-lg transition hover:bg-green-700 mb-2"
        >
          Iniciar Sesión
        </button>
        <div className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}