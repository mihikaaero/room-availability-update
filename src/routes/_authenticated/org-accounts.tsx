import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/_authenticated/org-accounts")({
  head: () => ({
    meta: [
      { title: "Organisation Accounts — PEC Venue Booking" },
      {
        name: "description",
        content:
          "Administrator view of every club and society account on the PEC Chandigarh venue booking portal, with login usernames and registration status.",
      },
      { property: "og:title", content: "Organisation Accounts — PEC Venue Booking" },
      {
        property: "og:description",
        content: "Login usernames and account status for every club and society.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrgAccountsPage,
});

type OrgAccount = {
  name: string;
  abbreviation: string;
  category: "club" | "society";
  auth_user_id: string | null;
};

function OrgAccountsPage() {
  const { data: session, isLoading } = useSession();
  const isAdmin = Boolean(session?.isAdmin);

  const { data: accounts = [] } = useQuery({
    queryKey: ["org-accounts"],
    enabled: isAdmin,
    queryFn: async (): Promise<OrgAccount[]> => {
      const { data, error } = await supabase
        .from("organizations")
        .select("name,abbreviation,category,auth_user_id")
        .order("abbreviation");
      if (error) throw error;
      return (data ?? []) as OrgAccount[];
    },
  });

  if (isLoading) return null;

  if (!isAdmin) {
    return (
      <Card className="max-w-lg">
        <CardContent className="flex items-center gap-3 pt-6 text-sm text-muted-foreground">
          <ShieldAlert className="size-4" />
          This page is available to the administrator account only.
        </CardContent>
      </Card>
    );
  }

  const registered = accounts.filter((a) => a.auth_user_id).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organisation accounts</h1>
        <p className="text-sm text-muted-foreground">
          Every club and society, its login username and whether the account has been
          registered. {registered} of {accounts.length} accounts are registered.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Login usernames</CardTitle>
          <CardDescription>
            Passwords are set by each organisation at registration and are stored
            encrypted, so they cannot be displayed here. An organisation that has
            forgotten its password can change it from Account settings after signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.abbreviation}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell className="font-mono text-xs uppercase">
                      {account.abbreviation}
                    </TableCell>
                    <TableCell className="capitalize">{account.category}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Set by organisation (encrypted)
                    </TableCell>
                    <TableCell>
                      {account.auth_user_id ? (
                        <Badge variant="secondary">Registered</Badge>
                      ) : (
                        <Badge variant="outline">Not registered</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
