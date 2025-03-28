
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Book, Laptop, Home, Bike, GraduationCap, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 1,
    name: 'Textbooks',
    icon: Book,
    description: 'Find textbooks for all courses at UofT',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    link: '/products?category=textbooks'
  },
  {
    id: 2,
    name: 'Electronics',
    icon: Laptop,
    description: 'Laptops, calculators, tablets and more',
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-200',
    link: '/products?category=electronics'
  },
  {
    id: 3,
    name: 'Housing',
    icon: Home,
    description: 'Find roommates and student housing',
    color: 'bg-green-50',
    iconColor: 'text-green-500',
    borderColor: 'border-green-200',
    link: '/products?category=housing'
  },
  {
    id: 4,
    name: 'Transportation',
    icon: Bike,
    description: 'Bikes, scooters, rideshares and more',
    color: 'bg-red-50',
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
    link: '/products?category=transportation'
  },
  {
    id: 5,
    name: 'Academic Services',
    icon: GraduationCap,
    description: 'Tutoring, editing, and study groups',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
    link: '/products?category=academic-services'
  },
  {
    id: 6,
    name: 'Miscellaneous',
    icon: Tag,
    description: 'Everything else for student life',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    borderColor: 'border-indigo-200',
    link: '/products?category=miscellaneous'
  }
];

const Categories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxScroll = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      maxScroll.current = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const newPosition = direction === 'left' 
        ? Math.max(scrollPosition - 300, 0)
        : Math.min(scrollPosition + 300, maxScroll.current);
      
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-20 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 
            ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            Categories
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-100
            ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            Explore our marketplace categories designed specifically for UofT students
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 hidden md:block">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-md hover:bg-toronto-blue hover:text-white"
              onClick={() => scroll('left')}
              disabled={scrollPosition <= 0}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 hidden md:block">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-md hover:bg-toronto-blue hover:text-white"
              onClick={() => scroll('right')}
              disabled={scrollPosition >= maxScroll.current}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Categories */}
          <div 
            className="flex overflow-x-auto space-x-6 py-4 no-scrollbar"
            ref={containerRef}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`flex-shrink-0 w-64 ${category.color} border ${category.borderColor} rounded-lg p-6 transition-all duration-500 card-hover
                  ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${category.iconColor} bg-white`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button variant="link" className="p-0 text-toronto-blue" asChild>
                  <Link to={category.link}>Browse {category.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
