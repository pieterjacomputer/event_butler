import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Niet gevonden</h1>
      <p className="text-muted-foreground">
        Deze pagina bestaat niet. Controleer de link uit je uitnodiging.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Naar de startpagina
      </Link>
    </main>
  );
}
