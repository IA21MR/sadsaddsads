'use client';

import { useState, FormEvent } from 'react';

export default function ReservationsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      requestedFor: (form.elements.namedItem('requestedFor') as HTMLInputElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value || undefined,
    };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string })?.message ?? 'Error al enviar la solicitud');
      }
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">¡Listo!</p>
          <h1 className="mt-4 text-3xl font-black">Solicitud recibida</h1>
          <p className="mt-4 text-slate-300">Nos pondremos en contacto a la brevedad para confirmar tu reserva.</p>
          <button
            className="mt-8 rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950"
            onClick={() => setSuccess(false)}
          >
            Hacer otra reserva
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Reservas</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight">Reserva una atención</h1>
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2"
        >
          <input name="name" required className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="Nombre" />
          <input name="email" required type="email" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="Correo" />
          <input name="requestedFor" required type="datetime-local" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none md:col-span-2" />
          <textarea name="notes" className="min-h-32 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none md:col-span-2" placeholder="Detalles de la reserva" />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-60 md:col-span-2"
          >
            {loading ? 'Enviando...' : 'Solicitar reserva'}
          </button>
        </form>
      </section>
    </main>
  );
}
