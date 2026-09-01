import { useState } from "react";

import Navbar from "@/components/common/Navbar";
import Drawer from "@/components/common/Drawer";
import PerformanceCarousel from "@/components/performance/PerformanceCarousel";
import PerformanceDetails from "@/components/performance/PerformanceDetails";
import PerformanceFaq from "@/components/performance/PerformanceFaq";

import "@/pages/Performance/Performance.css";

const Performance = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <main className="performance-page">
            <Navbar
                title="공연 안내"
                showMenuButton
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />

            <Drawer
                isOpen={isMenuOpen}
                onClose={handleMenuClose}
            />

            <div className="performance-content">
                <PerformanceCarousel />
                <PerformanceDetails />
                <PerformanceFaq />
            </div>
        </main>
    );
};

export default Performance;