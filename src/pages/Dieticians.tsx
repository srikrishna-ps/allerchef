import { useState, useEffect } from "react";
import AuthModal from '@/pages/Auth';
import { useAuthStore } from '@/context/AuthContext';

const Dieticians = () => {
    const [activeAllergy, setActiveAllergy] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { isLoggedIn } = useAuthStore();
    const [dieticians, setDieticians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [specializations, setSpecializations] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
        } else {
            setShowAuthModal(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            setLoading(true);
            fetch('/api/dieticians')
                .then(res => res.json())
                .then(data => {
                    setDieticians(data.dieticians || []);
                    setLoading(false);
                    // Collect unique specializations from all dieticians
                    const specs = Array.from(new Set((data.dieticians || []).flatMap((d: any) => d.specializations) as string[]));
                    setSpecializations(specs);
                    // Set default activeAllergy to first specialization if not set
                    if (!activeAllergy && specs.length > 0) setActiveAllergy(specs[0]);
                })
                .catch(() => {
                    setError('Failed to load dieticians.');
                    setLoading(false);
                });
        }
    }, [isLoggedIn]);

    const filtered = dieticians.filter(d => d.specializations.some((s: string) => s.toLowerCase().includes(activeAllergy.toLowerCase())));

    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12 pt-16 bg-[#E6F2EA] relative px-3 sm:px-4">
            {isLoggedIn ? (
                <>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center allerchef-text-gradient">Meet Our Dieticians</h1>
                    <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
                        {specializations.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setActiveAllergy(spec)}
                                className={`allerchef-pill px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm${activeAllergy === spec ? " selected" : ""}`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                    {loading ? (
                        <div className="text-center text-muted-foreground text-sm sm:text-base">Loading dieticians...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 text-sm sm:text-base">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm sm:text-base">No dieticians found for this specialization yet.</div>
                    ) : (
                        filtered.map((dietician, idx) => (
                            <div key={dietician._id || idx} className="rounded-2xl bg-[#fafaf7] p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <img src={dietician.image} alt={dietician.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-primary" />
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">{dietician.name}</h2>
                                    <p className="mb-3 text-muted-foreground text-sm sm:text-base">{dietician.bio}</p>
                                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center md:justify-start">
                                        {dietician.specializations.map((tag: string, i: number) => (
                                            <span key={i} className="allerchef-pill bg-secondary text-secondary-foreground text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            ) : (
                <AuthModal open={showAuthModal} onClose={() => { }} clearFieldsOnClose hideClose={true} />
            )}
        </div>
    );
};

export default Dieticians; 