"use client";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
    return (
        <RequireAuth>
            <AppShell hideHeader>
                <div className="flex min-h-svh justify-center items-center">
                    <h1 className="text-2xl font-bold">Welcome to RepoSense</h1>
                </div>
            </AppShell>
        </RequireAuth>
    );
}

