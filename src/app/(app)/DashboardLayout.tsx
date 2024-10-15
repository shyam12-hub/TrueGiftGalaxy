"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import logo from "@/image/logo gift 3.png";
import { Menu, X, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current route's pathname
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive active tab based on the pathname
  const activeTab = pathname.includes("/dashboard/Shop") ? "shop" : "products";

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`bg-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-20 shadow-lg`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Image src={logo} alt="Logo" className="h-16 w-auto" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-rose-500" />
          </Button>
        </div>
        <nav>
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              activeTab === "products"
                ? "bg-rose-100 text-rose-700"
                : "text-gray-600 hover:bg-rose-50"
            }`}
            onClick={() => {
              setSidebarOpen(false);
              router.push("/dashboard/Product");
            }}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          <Button
            variant={activeTab === "shop" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "shop"
                ? "bg-rose-100 text-rose-700"
                : "text-gray-600 hover:bg-rose-50"
            }`}
            onClick={() => {
              setSidebarOpen(false);
              router.push("/dashboard/Shop");
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop
          </Button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6 text-rose-500" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Always render children */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
