import { Link } from 'react-router-dom';
import { Search, Users, Leaf, ChefHat, Apple, Carrot, Egg, Star } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const featurePills = [
  { icon: <Leaf className="w-4 h-4" />, label: 'Allergy-Safe' },
  { icon: <ChefHat className="w-4 h-4" />, label: 'Dietician-Approved' },
  { icon: <Star className="w-4 h-4" />, label: 'Easy & Delicious' },
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
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fafaf7] rounded-2xl shadow-md px-4 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-0">
        {/* Text Block */}
        <div className="flex-1 z-10 text-left md:pr-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-green-800 leading-tight">
            Cook Safe, Eat Joyfully
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6 max-w-xl font-light">
            Personalized, allergy-safe recipes and expert nutrition guidance for every home cook. Discover food that fits your life—delicious, safe, and joyful.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {featurePills.map((pill, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow text-green-700 font-medium text-sm animate-bounce-slow hover:scale-105 transition-transform">
                {pill.icon} {pill.label}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/recipes"
              className="px-8 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              style={{ background: '#1b9d4a', color: '#fff', transition: 'all 0.2s', border: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = '#1b9d4a'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#1b9d4a'; }}
            >
              <Search className="inline-block h-5 w-5" />
              Find Recipes
            </Link>
            <a
              href="#features-grid"
              className="bg-white border-2 border-green-600 text-green-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              How It Works
            </a>
          </div>
        </div>
        {/* Hero Image */}
        <div className="flex-1 z-10 flex justify-center md:justify-end w-full md:w-auto mt-10 md:mt-0">
          <img
            src={heroImage}
            alt="Healthy cooking"
            className="w-72 md:w-[28rem] h-auto rounded-2xl shadow-lg object-cover border-4 border-white"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-32">
        {features.map((feature, index) => (
          <div key={index} className="allerchef-card text-center group">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <feature.icon className="h-8 w-8 text-[#16a34a] group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#16a34a' }}>{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="allerchef-card bg-[#fafaf7] text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Allergy-Safe Recipes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Expert Dieticians</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">1M+</div>
            <div className="text-muted-foreground">Happy Cooks</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="allerchef-card text-center bg-[#fafaf7] text-accent">
        <ChefHat className="h-16 w-16 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands who've found their perfect recipes</p>
        <Link
          to="/auth"
          className="px-8 py-4 rounded-2xl font-bold text-lg shadow-lg inline-block"
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