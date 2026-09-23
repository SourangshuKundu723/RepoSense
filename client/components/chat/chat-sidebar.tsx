"use client";

import { formatDistanceToNow } from "date-fns";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import { IndexStatusBadge } from "@/components/dashboard/repo-status";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useChatSessions,
    useCreateChatSession,
    useDeleteChatSession,
} from "@/hooks/use-chat";
import { useStartIndexing } from "@/hooks/use-repos";
import type { ChatSession, Repository } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ChatSidebar({
    repo,
    sessionId,
    onSelectSession,
    onDeleteSession,
}: {
    repo: Repository;
    sessionId: string | null;
    onSelectSession: (id: string) => void;
    onDeleteSession: () => void;
}) {
    const ready = repo.indexStatus === "READY";
    const sessionsQuery = useChatSessions(repo.id, ready);
    const createSession = useCreateChatSession(repo.id);
    const deleteSession = useDeleteChatSession(repo.id);
    const reindex = useStartIndexing();
    const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);

    return (
        <aside className="flex w-full flex-col border-b md:w-72 md:border-r md:border-b-0">
            <div className="space-y-3 p-4">
                <div className="space-y-1">
                    <p className="truncate text-sm font-medium">{repo.fullName}</p>
                    <div className="flex flex-wrap items-center gap-2">
                        <IndexStatusBadge status={repo.indexStatus} />
                        {repo.isPrivate && (
                            <span className="text-xs text-muted-foreground">Private</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1"
                        disabled={!ready || createSession.isPending}
                        onClick={() =>
                            createSession.mutate("New chat", {
                                onSuccess: (session) => onSelectSession(session.id),
                            })
                        }
                    >
                        <Plus data-icon="inline-start" />
                        New chat
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={reindex.isPending || repo.indexStatus === "INDEXING"}
                        onClick={() => reindex.mutate(repo.id)}
                        aria-label="Re-index repository"
                    >
                        <RotateCcw />
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                Sessions
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-1 px-2 pb-4">
                    {!ready && (
                        <p className="px-2 text-xs text-muted-foreground">
                            Sessions unlock after indexing completes.
                        </p>
                    )}

                    {sessionsQuery.isLoading &&
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-xl" />
                        ))}

                    {sessionsQuery.data?.map((session) => (
                        <div
                            key={session.id}
                            className={cn(
                                "group flex items-center rounded-xl transition-colors hover:bg-muted",
                                sessionId === session.id && "bg-muted"
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => onSelectSession(session.id)}
                                className="min-w-0 flex-1 px-3 py-2.5 text-left"
                            >
                                <p className="truncate text-sm font-medium">{session.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(session.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="mr-1 size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 focus-visible:opacity-100"
                                disabled={deleteSession.isPending}
                                onClick={() => setSessionToDelete(session)}
                                aria-label={`Delete ${session.title}`}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))}

                    {ready && sessionsQuery.isSuccess && sessionsQuery.data.length === 0 && (
                        <p className="px-2 text-xs text-muted-foreground">
                            No chats yet. Start one to begin.
                        </p>
                    )}
                </div>
            </ScrollArea>

            <AlertDialog
                open={sessionToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleteSession.isPending) {
                        setSessionToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this chat session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{sessionToDelete?.title}&quot; and
                            all of its messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteSession.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteSession.isPending}
                            onClick={() => {
                                if (!sessionToDelete) return;

                                const deletedSessionId = sessionToDelete.id;
                                deleteSession.mutate(deletedSessionId, {
                                    onSuccess: () => {
                                        if (deletedSessionId === sessionId) {
                                            onDeleteSession();
                                        }
                                        setSessionToDelete(null);
                                    },
                                });
                            }}
                        >
                            {deleteSession.isPending ? "Deleting..." : "Delete session"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
}