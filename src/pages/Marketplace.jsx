import { useState, useEffect } from "react";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from "../components/HamburgerMenu";
import Sidebar from "../components/Sidebar";
import { getMarketplaceItems, redeemItem, getBalance } from "../api/gamification";

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E0E5EB] dark:border-slate-800 p-3.5 animate-pulse">
      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-xl mb-3 h-[120px]" />
      <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-1/3 mb-3" />
      <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl" />
    </div>
  );
}

export default function Marketplace() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [search, setSearch]         = useState("");
  const [items, setItems]           = useState([]);
  const [balance, setBalance]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [redeeming, setRedeeming]   = useState(null);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    Promise.all([getMarketplaceItems(), getBalance()])
      .then(([its, bal]) => {
        setItems(Array.isArray(its) ? its : []);
        setBalance(bal);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 7000);
  }

  async function handleRedeem(item) {
    if (confirming !== item.id) {
      setConfirming(item.id);
      return;
    }
    setConfirming(null);
    setRedeeming(item.id);
    try {
      await redeemItem(item.id, 1);
      const bal = await getBalance();
      setBalance(bal);
      setItems((prev) =>
        prev.map((it) => it.id === item.id ? { ...it, stock: it.stock - 1 } : it)
      );
      showToast("ok", `¡Canjeaste "${item.name}" por ${item.pointsCost} pts!`);
    } catch (err) {
      showToast("err", err.message || "No se pudo completar el canje");
    } finally {
      setRedeeming(null);
    }
  }

  const resultado = items.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase()) ||
    (it.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const canAfford = (cost) => balance !== null && balance.balance >= cost;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white transition-all max-w-xs w-full
          ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-500"}`}>
          <i className={`bi ${toast.type === "ok" ? "bi-check-circle-fill" : "bi-x-circle-fill"} text-base shrink-0`}></i>
          <span className="flex-1 leading-snug">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <i className="bi bi-x text-lg leading-none"></i>
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex justify-between items-center pt-3 px-4 lg:hidden">
          <UserHeader onMenu={() => setMenuOpen(true)} showDarkMode={true} />
        </div>

        <div className="hidden lg:flex items-center justify-end px-6 py-4 border-b border-[#E0E5EB] dark:border-slate-800">
          <UserHeader onMenu={() => setMenuOpen(true)} showMenu={false} showDarkMode={true} />
        </div>

        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="w-full max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6 pb-6 flex-1">

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 px-5 py-4 flex items-center justify-between mb-4 lg:mb-6 transition-colors duration-300">
            <div>
              <div className="text-gray-500 dark:text-slate-400 font-medium" style={{ fontSize: 14 }}>
                Tu saldo disponible
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                {loading ? (
                  <div className="h-7 w-20 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black" style={{ fontSize: 26 }}>
                      {balance?.balance ?? 0}
                    </span>
                    <span className="text-gray-500 dark:text-slate-400 font-medium" style={{ fontSize: 14 }}>
                      CleanPoints
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 dark:text-slate-500 font-medium" style={{ fontSize: 14 }}>
                Acumulados
              </div>
              <div className="mt-1">
                {loading ? (
                  <div className="h-6 w-16 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="text-gray-600 dark:text-slate-300 font-bold" style={{ fontSize: 18 }}>
                      {balance?.total ?? 0}
                    </span>
                    <span className="ml-1 text-gray-400 dark:text-slate-500" style={{ fontSize: 14 }}>pts</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5 relative">
            <span className="absolute left-3.5 top-3 text-gray-400 dark:text-slate-500">
              <i className="bi bi-search text-sm"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-[#E0E5EB] dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 shadow-sm transition-all"
              style={{ fontSize: 15 }}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : resultado.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <i className="bi bi-shop text-4xl mb-3 block"></i>
              <p className="font-medium">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {resultado.map((item) => {
                const outOfStock  = item.stock === 0;
                const isConfirm   = confirming === item.id;
                const isRedeeming = redeeming === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#E0E5EB] dark:border-slate-800 p-3.5 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div className="w-full bg-gray-50 dark:bg-slate-950/60 rounded-xl mb-3 flex items-center justify-center border border-gray-100 dark:border-slate-800/50" style={{ height: 120 }}>
                        <i className="bi bi-leaf text-3xl text-emerald-300 dark:text-emerald-800"></i>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 leading-snug mb-1 block" style={{ fontSize: 15 }}>
                        {item.name}
                      </span>
                      {item.description && (
                        <span className="text-gray-400 dark:text-slate-400 block mb-2 font-medium leading-snug" style={{ fontSize: 12 }}>
                          {item.description.length > 70 ? item.description.slice(0, 68) + "…" : item.description}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-amber-500 dark:text-amber-400 flex items-center gap-1" style={{ fontSize: 16 }}>
                          <i className="bi bi-lightning-charge-fill text-sm"></i>
                          {item.pointsCost} pts
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          outOfStock
                            ? "bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {outOfStock ? "Agotado" : `${item.stock} disp.`}
                        </span>
                      </div>

                      {outOfStock ? (
                        <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-bold text-center" style={{ fontSize: 14 }}>
                          Sin stock
                        </div>
                      ) : !canAfford(item.pointsCost) ? (
                        <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-bold text-center" style={{ fontSize: 14 }}>
                          Puntos insuficientes
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={isRedeeming}
                          className={`w-full py-2.5 rounded-xl font-bold transition active:scale-95 shadow-sm focus:outline-none text-white
                            ${isConfirm
                              ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600"
                              : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            }`}
                          style={{ minHeight: 38, fontSize: 14 }}
                        >
                          {isRedeeming ? "Canjeando…" : isConfirm ? "¿Confirmar?" : "Canjear"}
                        </button>
                      )}

                      {isConfirm && (
                        <button
                          onClick={() => setConfirming(null)}
                          className="w-full mt-1.5 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
