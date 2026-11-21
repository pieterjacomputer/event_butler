import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAdmin } from "@/auth";
import { listEvents } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Suspense fallback={<p className="text-muted-foreground">Laden…</p>}>
        <EventList />
      </Suspense>
    </main>
  );
}

async function EventList() {
  if (!(await isAdmin())) redirect("/admin/login");
  const events = await listEvents();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <SignOutButton />
      </header>
      <ul className="flex flex-col gap-2">
        {events.map((event) => (
          <li key={event.slug}>
            <Link
              href={`/admin/${event.slug}`}
              className="block rounded-lg border px-4 py-3 hover:bg-muted"
            >
              <span className="font-medium">{event.title}</span>{" "}
              <span className="text-sm text-muted-foreground">
                · {formatDate(event.startsAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
