import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useSavedItems } from "@/contexts/SavedItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import MyListings from "@/components/MyListings";
import { Calendar, Home, Inbox, Search, Settings, LogOut, Edit, Save, Trash2, Camera, User, ShoppingBag, Heart, MessageSquare, Loader2 } from "lucide-react";
interface UserProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  program: string;
  year: string;
  bio: string;
}
const Account = () => {
  const {
    toast: customToast
  } = useToast();
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateUserProfile,
    userMessages,
    isUpdatingProfile
  } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    savedItems,
    removeSavedItem
  } = useSavedItems();
  const unreadCount = userMessages.filter(msg => !msg.read).length;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfileFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    program: user?.program || '',
    year: user?.year || '',
    bio: user?.bio || ''
  });
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        program: user.program || '',
        year: user.year || '',
        bio: user.bio || ''
      });
      console.log("Setting form data from user:", user);
    }
  }, [user]);
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);
        toast.success("Profile photo updated");
      }
    };
    reader.readAsDataURL(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      id,
      value
    } = e.target;
    if (id !== 'bio' && id !== 'phone') {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };
  const toggleEditMode = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setIsEditing(true);
    }
  };
  const handleRemoveSavedItem = (id: string) => {
    if (removeSavedItem(id)) {
      toast.success("The item has been removed from your saved items");
    }
  };
  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  const handleSubmit = async () => {
    if (!isEditing) return;
    try {
      console.log("Submitting profile update...");
      if (!formData.fullName.trim()) {
        toast.error("Name is required");
        return;
      }
      const profile = {
        name: formData.fullName,
        program: formData.program,
        year: formData.year,
        bio: user?.bio,
        phone: user?.phone
      };
      console.log("Submitting profile data:", profile);
      setIsSubmitting(true);
      const success = await updateUserProfile(profile);
      if (success) {
        setIsEditing(false);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['profile', 'listings', 'saved', 'settings'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="md:hidden mb-8 text-center">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                    {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>}
                  </div>
                  <label htmlFor="profile-image-mobile" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                    <Camera className="h-4 w-4" />
                    <input id="profile-image-mobile" type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                  </label>
                </div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.program} {user?.year ? `'${user.year}` : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="hidden md:flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                        {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center">
                            <User className="h-12 w-12 text-gray-400" />
                          </div>}
                      </div>
                      <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                        <Camera className="h-4 w-4" />
                        <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                      </label>
                    </div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">
                      {user?.program} {user?.year ? `'${user.year}` : ''}
                    </p>
                  </div>
                  
                  <nav className="space-y-1">
                    <a href="#profile" className={`flex items-center space-x-3 px-3 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => handleNavClick('profile')}>
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </a>
                    <a href="#listings" className={`flex items-center space-x-3 px-3 py-2 rounded-md ${activeTab === 'listings' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => handleNavClick('listings')}>
                      <ShoppingBag className="h-5 w-5" />
                      <span>My Listings</span>
                    </a>
                    <a href="#saved" className={`flex items-center space-x-3 px-3 py-2 rounded-md ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => handleNavClick('saved')}>
                      <Heart className="h-5 w-5" />
                      <span>Saved Items</span>
                    </a>
                    <Link to="/inbox" className="flex items-center justify-between space-x-3 px-3 py-2 rounded-md hover:bg-gray-100">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5" />
                        <span>Inbox</span>
                      </div>
                      {unreadCount > 0 && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>}
                    </Link>
                    <a href="#settings" className={`flex items-center space-x-3 px-3 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`} onClick={() => handleNavClick('settings')}>
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </a>
                    <button onClick={handleSignOut} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-red-500 w-full text-left">
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </nav>
                </div>
              </div>
              
              <div className="md:col-span-3">
                {activeTab === 'profile' && <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Personal Information</h2>
                      
                    </div>
                    
                    {isUpdatingProfile && <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Saving profile information...</span>
                      </div>}
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          {isEditing ? <Input id="fullName" value={formData.fullName} onChange={handleInputChange} /> : <div className="mt-1 p-2 border rounded-md bg-gray-50">{user?.name || ''}</div>}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="mt-1 p-2 border rounded-md bg-gray-50">{user?.email || ''}</div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="mt-1 p-2 border rounded-md bg-gray-50">{user?.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label htmlFor="program">Program</Label>
                          {isEditing ? <Input id="program" value={formData.program || ''} onChange={handleInputChange} /> : <div className="mt-1 p-2 border rounded-md bg-gray-50">{user?.program || 'Not provided'}</div>}
                        </div>
                        <div>
                          <Label htmlFor="year">Year</Label>
                          {isEditing ? <Input id="year" value={formData.year || ''} onChange={handleInputChange} /> : <div className="mt-1 p-2 border rounded-md bg-gray-50">{user?.year ? `'${user.year}` : 'Not provided'}</div>}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[100px]">{user?.bio || 'No bio provided.'}</div>
                      </div>
                    </div>
                  </div>}
                
                {activeTab === 'listings' && <div className="bg-white rounded-lg shadow-sm p-6">
                    <MyListings />
                  </div>}
                
                {activeTab === 'saved' && <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Saved Items</h2>
                    
                    {savedItems.length === 0 ? <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any saved items yet.</p>
                        <Button asChild className="mt-4">
                          <Link to="/products">Browse Products</Link>
                        </Button>
                      </div> : <div className="space-y-4">
                        {savedItems.map(item => <div key={item.id} className="flex items-center border rounded-md p-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                            </div>
                            
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium">
                                <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                                  {item.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">
                                Saved on: {item.savedDate} • Seller: {item.seller}
                              </p>
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="ml-4 flex">
                              <Button variant="outline" size="sm" className="mr-2" asChild>
                                <Link to={`/product/${item.id}`}>View</Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveSavedItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </div>)}
                      </div>}
                  </div>}
                
                {activeTab === 'settings' && <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <Button variant="outline" onClick={() => {
                      toast.success("Password reset email sent. Check your email for instructions to reset your password.");
                    }}>
                          Change Password
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="email-notif" className="h-4 w-4 mr-2" defaultChecked onChange={() => {
                          toast.success("Your notification preferences have been updated");
                        }} />
                            <label htmlFor="email-notif">Email Notifications</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="sms-notif" className="h-4 w-4 mr-2" defaultChecked onChange={() => {
                          toast.success("Your notification preferences have been updated");
                        }} />
                            <label htmlFor="sms-notif">SMS Notifications</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Privacy</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="profile-visible" className="h-4 w-4 mr-2" defaultChecked onChange={() => {
                          toast.success("Your privacy settings have been updated");
                        }} />
                            <label htmlFor="profile-visible">Make Profile Visible to Others</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="show-listings" className="h-4 w-4 mr-2" defaultChecked onChange={() => {
                          toast.success("Your privacy settings have been updated");
                        }} />
                            <label htmlFor="show-listings">Show My Listings Publicly</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                        <Button variant="destructive" onClick={() => {
                      toast.success("Account deletion requested. We've sent you an email to confirm your account deletion request.");
                    }}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Account;