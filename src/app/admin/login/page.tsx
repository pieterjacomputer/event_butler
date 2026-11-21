import type { Metadata } from "next";
import { Suspense } from "react";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin – inloggen" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <Suspense>
            <LoginError searchParams={searchParams} />
          </Suspense>
          <p className="text-muted-foreground">
            Alleen de organisator heeft toegang.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin" });
            }}
          >
            <Button type="submit" className="w-full">
              Inloggen met GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

async function LoginError({
  searchParams,
}: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive"
    >
      {error === "AccessDenied"
        ? "Geen toegang: dit account is niet de organisator."
        : "Inloggen is mislukt. Probeer het opnieuw."}
    </p>
  );
}
