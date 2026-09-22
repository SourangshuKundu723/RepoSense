"use client";

const ChatView = ({ repoId }: { repoId: string }) => {
    return (
        <div className="flex min-h-svh justify-center items-center">
            <h1 className="text-2xl font-bold">Chat View for {repoId}</h1>
        </div>
    );
};

export default ChatView;