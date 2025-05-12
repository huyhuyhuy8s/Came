
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-12 came-container">
      <h1 className="text-4xl font-bold mono mb-8">About Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Came was born from a simple desire: to bring exceptional coffee experiences to people without the wait. 
            Founded in 2018 by coffee enthusiasts Maria and John Chen, our cafe started as a small corner shop 
            in downtown with just three varieties of beans and a vision.
          </p>
          <p className="text-gray-700 mb-4">
            We understand that your time is valuable, yet you shouldn't have to compromise on quality. 
            This fundamental belief drives everything we do at Came – from our carefully sourced beans 
            to our innovative online ordering system that lets you skip the line.
          </p>
          <p className="text-gray-700">
            Today, we're proud to serve thousands of customers weekly across multiple locations, 
            but our mission remains unchanged: delivering moments of coffee perfection, efficiently.
          </p>
        </div>
        
        <div className="relative h-[400px]">
          <img 
            src="/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png" 
            alt="Our cafe" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Our Philosophy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-xl mb-3">Quality First</h3>
            <p className="text-gray-600">
              We never compromise on quality. From bean selection to brewing techniques, 
              we maintain exacting standards to ensure every cup exceeds expectations.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-xl mb-3">Convenience Matters</h3>
            <p className="text-gray-600">
              <strong>We believe great coffee shouldn't require waiting in line.</strong> Our innovative 
              ordering system lets you enjoy premium coffee on your schedule.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-xl mb-3">Community Connection</h3>
            <p className="text-gray-600">
              Beyond serving coffee, we create spaces where connections form. Whether in-store 
              or through our digital community, we bring people together.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-black text-white p-8 md:p-12 rounded-lg mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Commitment to You</h2>
          <p className="text-lg mb-8">
            <strong>At Came, we understand that coffee is more than a beverage – it's a ritual, a comfort, 
            and often the highlight of your day.</strong> That's why we're passionate about delivering not just 
            exceptional coffee, but an experience that fits seamlessly into your life.
          </p>
          <p className="mb-8">
            We've built our entire service model around what matters to you: quality without compromise, 
            convenience without waiting, and personalization without complexity.
          </p>
          <Link to="/menu">
            <Button className="bg-white text-black hover:bg-gray-100">
              Explore Our Menu
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Visit Us</h2>
        <p className="text-gray-700 mb-8">
          Experience Came for yourself at any of our locations. Whether you're stopping by or 
          ordering online for pickup, we're looking forward to serving you.
        </p>
        <div className="bg-gray-50 p-6 inline-block rounded-lg">
          <p className="font-medium">Downtown Location</p>
          <address className="not-italic text-gray-600">
            123 Coffee Street<br />
            City Center<br />
            Open daily: 7am - 7pm
          </address>
        </div>
      </div>
    </div>
  );
};

export default About;
