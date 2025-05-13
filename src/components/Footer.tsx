import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Would integrate with newsletter service
    console.log('Subscribing email:', email);
    setEmail('');
    // Show toast notification
  };
  return <footer className="bg-black text-white py-8">
      <div className="came-container">
        <div className="border-b border-gray-800 pb-8">
          <div className="mono text-xl mb-8">Came</div>
          
          <div className="mb-8">
            <h3 className="text-sm mb-4">Stay in the Loop</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-transparent border-white/30 text-white" />
              <Button type="submit" variant="outline" className="border-white hover:bg-white text-slate-950">
                Sign Up
              </Button>
            </form>
          </div>

          <div className="text-xs text-gray-400">
            This form is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="underline">Privacy Policy</a> and{" "}
            <a href="#" className="underline">Terms of Service</a> apply.
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <div>© 2023 Came. All rights reserved.</div>
          <div className="mt-4 flex flex-wrap gap-4">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Cookies</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;