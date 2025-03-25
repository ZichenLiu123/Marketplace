
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignUpFormProps {
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  signUpName: string;
  setSignUpName: (name: string) => void;
  signUpEmail: string;
  setSignUpEmail: (email: string) => void;
  signUpPassword: string;
  setSignUpPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  program: string;
  setProgram: (program: string) => void;
  year: string;
  setYear: (year: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
}

const SignUpForm = ({
  handleSignUp,
  signUpName,
  setSignUpName,
  signUpEmail,
  setSignUpEmail,
  signUpPassword,
  setSignUpPassword,
  confirmPassword,
  setConfirmPassword,
  program,
  setProgram,
  year,
  setYear,
  phone,
  setPhone,
  bio,
  setBio,
  errors,
  isLoading
}: SignUpFormProps) => {
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullname">Full Name <span className="text-red-500">*</span></Label>
        <Input 
          id="fullname" 
          type="text" 
          required
          className={errors.fullName ? "border-red-500" : ""}
          value={signUpName}
          onChange={(e) => setSignUpName(e.target.value)}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">UofT Email Address <span className="text-red-500">*</span></Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="your.name@mail.utoronto.ca"
            className="pl-10"
            required
            pattern=".*@mail\.utoronto\.ca$"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          You must use your @mail.utoronto.ca email to register
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program">Program <span className="text-red-500">*</span></Label>
          <Input 
            id="program" 
            placeholder="e.g. Computer Science"
            className={errors.program ? "border-red-500" : ""}
            required
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
          {errors.program && (
            <p className="text-sm text-red-500">{errors.program}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
          <Input 
            id="year" 
            placeholder="e.g. '26"
            className={errors.year ? "border-red-500" : ""}
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
        <Input 
          id="phone" 
          placeholder="(xxx) xxx-xxxx"
          required
          className={errors.phone ? "border-red-500" : ""}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio <span className="text-red-500">*</span></Label>
        <Textarea 
          id="bio" 
          placeholder="Tell others a bit about yourself"
          rows={3}
          required
          className={errors.bio ? "border-red-500" : ""}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password <span className="text-red-500">*</span></Label>
        <Input 
          id="signup-password" 
          type="password" 
          required
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password <span className="text-red-500">*</span></Label>
        <Input 
          id="confirm-password" 
          type="password" 
          required
          className={errors.confirmPassword ? "border-red-500" : ""}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-toronto-blue hover:bg-toronto-blue/90" 
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-toronto-blue hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-toronto-blue hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
