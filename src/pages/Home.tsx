import { Link } from 'react-router-dom';
import { Search, Shield, Heart, Users, TrendingUp, ChefHat } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Home = () => {
  const quickFilters = [
    'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Vegan', 'High Protein', 
    'Low Sugar', 'Iron Rich', 'Keto', 'Low Sodium', 'Heart Healthy'
  ];

  const features = [
    {
      icon: Shield,
      title: 'Allergy-Safe Recipes',
      description: 'Filter out allergens and find safe, delicious meals tailored to your dietary restrictions.'
    },
    {
      icon: Heart,
      title: 'Nutritional Goals',
      description: 'Discover recipes rich in the nutrients you need, from protein to vitamins and minerals.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Connect with specialized dieticians who understand your specific dietary needs.'
    },
    {
      icon: TrendingUp,
      title: 'Health Insights',
      description: 'Stay updated with the latest nutrition research and healthy eating trends.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="allerchef-card allerchef-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Healthy cooking" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center py-16 px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Cook Safe, Eat Well
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Discover delicious recipes perfectly tailored to your allergies and nutritional goals. 
            Your journey to healthy, worry-free cooking starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/recipes" 
              className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Search className="inline-block mr-2 h-5 w-5" />
              Find Recipes
            </Link>
            <Link 
              to="/dieticians" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
            >
              <Users className="inline-block mr-2 h-5 w-5" />
              Meet Experts
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Popular Dietary Preferences</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {quickFilters.map((filter) => (
            <Link
              key={filter}
              to={`/recipes?filter=${filter.toLowerCase().replace(' ', '-')}`}
              className="allerchef-pill"
            >
              {filter}
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="allerchef-card text-center group">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="allerchef-card bg-secondary text-center">
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
      <section className="allerchef-card text-center bg-accent text-white">
        <ChefHat className="h-16 w-16 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands who've found their perfect recipes</p>
        <Link 
          to="/auth" 
          className="bg-white text-accent px-8 py-4 rounded-2xl font-bold text-lg hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-lg inline-block"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
};

export default Home;