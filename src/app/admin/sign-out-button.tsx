import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <Button type="submit" variant="outline" size="sm">
        Uitloggen
      </Button>
    </form>
  );
}
