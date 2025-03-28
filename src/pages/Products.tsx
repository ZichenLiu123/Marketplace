import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading products from an API
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockProducts = [
        {
          id: "1",
          title: "Calculus Textbook",
          price: 45,
          description: "MAT137 Calculus textbook, slightly used with no markings.",
          image: "/placeholder.svg",
          seller: "Alice Chen",
          postedDate: "2023-09-15",
          condition: "Like New",
          category: "textbooks"
        },
        {
          id: "2",
          title: "MacBook Pro 2021",
          price: 1200,
          description: "M1 MacBook Pro with 16GB RAM and 512GB SSD. Perfect condition.",
          image: "/placeholder.svg",
          seller: "John Smith",
          postedDate: "2023-10-01",
          condition: "Excellent",
          category: "electronics"
        },
        {
          id: "3", 
          title: "Room for Rent",
          price: 850,
          description: "Private room in 3-bedroom apartment near campus. Available immediately.",
          image: "/placeholder.svg",
          seller: "Maria Garcia",
          postedDate: "2023-10-05",
          condition: "N/A",
          category: "housing"
        },
        {
          id: "4",
          title: "Physics Tutoring",
          price: 30,
          description: "PHY131/PHY132 tutoring from a 4th year Physics major. $30/hour.",
          image: "/placeholder.svg",
          seller: "David Kim",
          postedDate: "2023-09-28",
          condition: "N/A",
          category: "academic-services"
        }
      ];
      
      // Filter by category if provided
      const filtered = categoryParam 
        ? mockProducts.filter(product => product.category === categoryParam)
        : mockProducts;
      
      setProducts(filtered);
      setIsLoading(false);
    };

    loadProducts();
  }, [categoryParam]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Sidebar/Filters */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="textbooks" className="mr-2" />
                    <label htmlFor="textbooks">Textbooks</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="electronics" className="mr-2" />
                    <label htmlFor="electronics">Electronics</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="housing" className="mr-2" />
                    <label htmlFor="housing">Housing</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="transportation" className="mr-2" />
                    <label htmlFor="transportation">Transportation</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="academic-services" className="mr-2" />
                    <label htmlFor="academic-services">Academic Services</label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Condition</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="new" className="mr-2" />
                    <label htmlFor="new">New</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="like-new" className="mr-2" />
                    <label htmlFor="like-new">Like New</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="good" className="mr-2" />
                    <label htmlFor="good">Good</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="fair" className="mr-2" />
                    <label htmlFor="fair">Fair</label>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
          
          {/* Product Listings */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Sort</span>
                </Button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-6">
              {categoryParam 
                ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}` 
                : 'All Products'}
            </h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border rounded-lg p-4 h-80 animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    seller={product.seller}
                    category={product.category}
                    condition={product.condition}
                    postedTime={product.postedDate}
                    location="University of Toronto"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No products found</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
