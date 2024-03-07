import { useState, useEffect } from "react";
import AuthModal from '@/pages/Auth';

const allergies = [
    "Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish", "Fish", "Sesame"
];

const dieticians = [
    {
        name: "Dr. Priya Sharma",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Certified clinical nutritionist specializing in gluten and dairy allergies. 10+ years experience helping families eat safe and well.",
        specializations: ["Gluten-Free", "Dairy-Free", "Pediatric Nutrition"]
    },
    {
        name: "Dr. Rahul Mehta",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Expert in nut and egg allergies, passionate about making Indian cuisine accessible for all.",
        specializations: ["Nut-Free", "Egg-Free", "Indian Cuisine"]
    },
    {
        name: "Dr. Aisha Khan",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        bio: "Registered dietician with focus on heart health and soy allergies. Loves creating tasty, safe recipes.",
        specializations: ["Soy-Free", "Heart Healthy", "Meal Planning"]
    }
];

const Dieticians = () => {
    const [activeAllergy, setActiveAllergy] = useState(allergies[0]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('allerchef_user'));

    useEffect(() => {
        if (!localStorage.getItem('allerchef_user')) {
            setShowAuthModal(true);
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-12 pt-16 bg-[#E6F2EA] relative">
            {isLoggedIn ? (
                <>
                    <h1 className="text-4xl font-bold mb-8 text-center allerchef-text-gradient">Meet Our Dieticians</h1>
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        {allergies.map((allergy) => (
                            <button
                                key={allergy}
                                onClick={() => setActiveAllergy(allergy)}
                                className={`allerchef-pill px-4 py-2${activeAllergy === allergy ? " selected" : ""}`}
                            >
                                {allergy}
                            </button>
                        ))}
                    </div>
                    {dieticians.filter(d => d.specializations.some(s => s.toLowerCase().includes(activeAllergy.toLowerCase()))).length === 0 ? (
                        <div className="text-center text-muted-foreground">No dieticians found for this allergy yet.</div>
                    ) : (
                        dieticians.filter(d => d.specializations.some(s => s.toLowerCase().includes(activeAllergy.toLowerCase()))).map((dietician, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#fafaf7] p-5 shadow-md flex flex-col md:flex-row items-center gap-6">
                                <img src={dietician.image} alt={dietician.name} className="w-28 h-28 rounded-full object-cover border-4 border-primary" />
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold mb-2 text-foreground">{dietician.name}</h2>
                                    <p className="mb-3 text-muted-foreground">{dietician.bio}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dietician.specializations.map((tag, i) => (
                                            <span key={i} className="allerchef-pill bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            ) : null}
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} hideClose={true} />
        </div>
    );
};

export default Dieticians; 