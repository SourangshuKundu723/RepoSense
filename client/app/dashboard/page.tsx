"use client";

import { useCurrentUser } from "@/hooks/use-auth";

export default function DashBoardPage(){
    const { data:user, isLoading } = useCurrentUser();

    console.log(user);

    return (
        <div>DashBoardPage</div>
    )
}