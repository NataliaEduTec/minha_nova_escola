export function LayoutReport({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-screen z-[10010] bg-base-200 p-8 overflow-y-auto max-h-[100vh] print:overflow-y-visible">
            <div className="max-w-7xl mx-auto ">
                {children}
            </div>
        </div>
    );
}