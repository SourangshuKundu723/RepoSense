import { cn } from "@/lib/utils";
import { RepoSenseIcon } from "../icons/reposense-icon";

export function BrandMark({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex items-center gap-2.5 font-semibold tracking-tight",
                className
            )}
        >
            <RepoSenseIcon className="size-8 rounded-[10px]" />
            <span className="font-heading text-[1.05rem] leading-none">RepoSense</span>
        </div>
    );
}