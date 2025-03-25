import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  return <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-toronto-blue opacity-80"></div>
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80')",
        filter: "brightness(0.5) saturate(1.2)"
      }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              The Marketplace Exclusively for <br className="hidden md:block" />
              <span className="text-toronto-gold">University of Toronto</span> Students
            </h1>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Buy and sell textbooks, electronics, furniture and more with verified UofT students. 
              Safe, local, and designed specifically for our community.
            </p>
          </div>

          <div className={`transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row max-w-2xl mx-auto space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <Input type="text" placeholder="What are you looking for?" className="w-full pl-10 h-12 text-base" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
              <Button type="submit" className="h-12 px-8 bg-toronto-gold text-toronto-dark hover:bg-toronto-gold/90">
                Search
              </Button>
            </form>
            
            {/* Sign up button */}
            <div className="mt-6">
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" asChild>
                
              </Button>
            </div>
          </div>

          <div className={`mt-16 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
              {['Textbooks', 'Electronics', 'Furniture', 'Services'].map((category, index) => <Link key={category} to={`/products?category=${category.toLowerCase()}`} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <span className="text-white font-medium">{category}</span>
                </Link>)}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Shape Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
        </svg>
      </div>
    </div>;
};
export default Hero;