import { Navigation } from "@/components/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #efefbb 0%, #d4d3dd 100%)' }}>
      <div className="flex">
        <Navigation />
        <main className="flex-1 md:ml-0">
          <div className="p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
