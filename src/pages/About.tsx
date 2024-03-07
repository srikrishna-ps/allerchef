import { Mail, Globe, MapPin, CheckCircle, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const bulletPoints = [
    { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Allergen-Free Recipe Filtering" },
    { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Nutrient-Focused Meal Suggestions" },
    { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Dietician Mapping by Allergy Type" },
    { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Curated Health Blogs and Wellness Resources" },
];

const About = () => (
    <div className="min-h-screen bg-[#E6F2EA] py-12 px-6 md:px-10 lg:px-16 pt-16">
        <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="rounded-2xl bg-[#fafaf7] shadow-inner p-6 md:p-10 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">Empowering Healthy Eating, One Recipe at a Time</h1>
                <p className="text-gray-600 text-lg md:text-xl mb-6 max-w-2xl mx-auto">AllerChef helps you discover safe, nutrient-rich recipes personalized to your dietary needs—so food is always a source of joy, not stress.</p>
                <Link to="/recipes" className="allerchef-btn-primary px-8 py-3 rounded-2xl font-semibold text-lg mt-2">Explore Recipes</Link>
            </section>

            {/* Who We Are */}
            <section className="rounded-2xl bg-white shadow-md p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left md:text-left text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Who We Are</h2>
                    <p className="text-lg text-muted-foreground">At AllerChef, we believe that food should nourish, not restrict. We're a team of developers, designers, and nutrition enthusiasts working to make recipe discovery simple, safe, and personalized—especially for people with food allergies or specific nutritional goals.</p>
                </div>
                <img src="/placeholder.svg" alt="Team Illustration" className="w-40 h-40 md:w-56 md:h-56 object-contain hidden md:block" />
            </section>

            {/* What We Do */}
            <section className="rounded-2xl bg-[#fafaf7] shadow-md p-6 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">What We Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {bulletPoints.map((bp, i) => (
                        <div key={i} className="flex items-start gap-3">
                            {bp.icon}
                            <span className="text-lg text-foreground">{bp.text}</span>
                        </div>
                    ))}
                </div>
                <p className="text-muted-foreground mt-4">Our platform blends smart technology with real-world food challenges—making everyday decisions easier and more informed.</p>
            </section>

            {/* Why It Matters */}
            <section className="rounded-2xl bg-[#fafaf7] shadow-md p-6 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Why It Matters</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <blockquote className="border-l-4 border-green-400 pl-4 italic text-lg text-gray-700 flex items-center gap-2 mb-4">
                            <Quote className="w-6 h-6 text-green-400 mr-2" />
                            Eating well should feel like joy, not a risk. That’s the experience we want to create.
                        </blockquote>
                        <p className="text-muted-foreground">Millions of people live with food allergies or dietary restrictions, and most recipe platforms aren’t designed with them in mind. We created AllerChef to prioritize inclusion and health—so that everyone has the freedom to enjoy food without fear or compromise.</p>
                    </div>
                </div>
            </section>

            {/* Our Vision */}
            <section className="rounded-2xl bg-[#fafaf7] shadow-md p-6 md:p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Our Vision</h2>
                <p className="text-2xl md:text-3xl italic font-serif text-green-900">To become the go-to platform for personalized nutrition—empowering individuals to eat better, live better, and feel better, every day.</p>
            </section>

            {/* Let's Connect */}
            <section className="rounded-2xl bg-white shadow-md p-6 md:p-10">
                <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">Let’s Connect</h2>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3 text-lg">
                        <Mail className="text-green-500 w-5 h-5" />
                        <span>hello@allerchef.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <Globe className="text-green-500 w-5 h-5" />
                        <span>www.allerchef.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                        <MapPin className="text-green-500 w-5 h-5" />
                        <span>Based in India. Built for the world.</span>
                    </div>
                </div>
                {/* Social media placeholders can be added here if needed */}
            </section>
        </div>
    </div>
);

export default About; 