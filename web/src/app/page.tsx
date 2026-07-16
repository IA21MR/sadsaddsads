import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Proyecto generado por SOTEK Platform
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tight">
            sadsaddsads
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            adsda
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/reservations" className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:bg-cyan-300/10">
              reservations
            </Link>
        </div>


        <div className="mt-14 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Módulo público</p>
          <h2 className="mt-3 text-xl font-semibold text-white">reservations</h2>
          <p className="mt-2 text-sm text-slate-300">
            Sección inicial generada para este proyecto. Aquí SOTEK puede desarrollar la experiencia específica del cliente.
          </p>
        </article>
        </div>
      </section>
    </main>
  );
}
