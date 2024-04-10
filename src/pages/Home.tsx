import { Link } from 'react-router-dom';
import { Search, Users, Leaf, ChefHat, Apple, Carrot, Egg, Star } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const featurePills = [
  { icon: <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />, label: 'Allergy-Safe' },
  { icon: <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />, label: 'Dietician-Approved' },
  { icon: <Star className="w-3 h-3 sm:w-4 sm:h-4" />, label: 'Easy & Delicious' },
];

const Home = () => {
  const quickFilters = [
    'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Vegan', 'High Protein',
    'Low Sugar', 'Iron Rich', 'Keto', 'Low Sodium', 'Heart Healthy'
  ];

  const features = [
    {
      icon: ChefHat,
      title: 'Allergy-Safe Recipes',
      description: 'Filter out allergens and find safe, delicious meals tailored to your dietary restrictions.'
    },
    {
      icon: Users,
      title: 'Nutritional Goals',
      description: 'Discover recipes rich in the nutrients you need, from protein to vitamins and minerals.'
    },
    {
      icon: Leaf,
      title: 'Expert Guidance',
      description: 'Connect with specialized dieticians who understand your specific dietary needs.'
    },
    {
      icon: Star,
      title: 'Health Insights',
      description: 'Stay updated with the latest nutrition research and healthy eating trends.'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fafaf7] rounded-2xl shadow-md px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-20 flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-0">
        {/* Text Block */}
        <div className="flex-1 z-10 text-left md:pr-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-green-800 leading-tight">
            Cook Safe, Eat Joyfully
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-700 mb-4 sm:mb-6 max-w-xl font-light">
            Personalized, allergy-safe recipes and expert nutrition guidance for every home cook. Discover food that fits your life—delicious, safe, and joyful.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {featurePills.map((pill, i) => (
              <span key={i} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 shadow text-green-700 font-medium text-xs sm:text-sm animate-bounce-slow hover:scale-105 transition-transform">
                {pill.icon} {pill.label}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/recipes"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-lg flex items-center justify-center gap-2"
              style={{ background: '#1b9d4a', color: '#fff', transition: 'all 0.2s', border: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = '#1b9d4a'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#1b9d4a'; }}
            >
              <Search className="inline-block h-4 w-4 sm:h-5 sm:w-5" />
              Find Recipes
            </Link>
            <a
              href="#features-grid"
              className="bg-white border-2 border-green-600 text-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-green-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              How It Works
            </a>
          </div>
        </div>
        {/* Hero Image */}
        <div className="flex-1 z-10 flex justify-center md:justify-end w-full md:w-auto mt-6 sm:mt-10 md:mt-0">
          <img
            src={heroImage}
            alt="Healthy cooking"
            className="w-64 sm:w-72 md:w-[28rem] h-auto rounded-2xl shadow-lg object-cover border-4 border-white"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 scroll-mt-32">
        {features.map((feature, index) => (
          <div key={index} className="allerchef-card text-center group p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#16a34a] group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{ color: '#16a34a' }}>{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="allerchef-card bg-[#fafaf7] text-center p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">10,000+</div>
            <div className="text-muted-foreground text-sm sm:text-base">Allergy-Safe Recipes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">50+</div>
            <div className="text-muted-foreground text-sm sm:text-base">Expert Dieticians</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">1M+</div>
            <div className="text-muted-foreground text-sm sm:text-base">Happy Cooks</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="allerchef-card text-center bg-[#fafaf7] text-accent p-6 sm:p-8">
        <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Cooking?</h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">Join thousands who've found their perfect recipes</p>
        <Link
          to="/auth"
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-lg inline-block"
          style={{ background: '#1b9d4a', color: '#fff', transition: 'all 0.2s', border: 'none' }}
          onMouseOver={e => { e.currentTarget.style.background = '#1b9d4a'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#1b9d4a'; }}
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
};

export default Home;