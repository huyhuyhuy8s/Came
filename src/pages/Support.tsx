
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SupportTicketForm from '@/components/SupportTicketForm';
import { Mail, MapPin, Phone } from 'lucide-react';

const Support = () => {
  return (
    <div className="py-16 came-container">
      <h1 className="text-3xl font-bold mono mb-8">Support & Help</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What are your operating hours?</AccordionTrigger>
                  <AccordionContent>
                    Our cafes are open from 7:00 AM to 8:00 PM Monday through Friday, and from 8:00 AM to 7:00 PM on weekends.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do you offer delivery?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer delivery within a 5-mile radius of our locations. Delivery fees start at $5, and there's a minimum order of $15.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I redeem promotions or discounts?</AccordionTrigger>
                  <AccordionContent>
                    Promotions and discounts can be applied automatically when you place your order online during the valid promotion period. For in-store promotions, simply mention the offer to our staff when placing your order.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you offer catering services?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we provide catering services for events of all sizes. Please contact us at least 48 hours in advance to discuss your needs and place your order.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How can I check the status of my order?</AccordionTrigger>
                  <AccordionContent>
                    You can check the status of your order by logging into your account and viewing the "Orders" section. You'll receive updates via email or in your account notifications as well.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>Are your products suitable for people with allergies?</AccordionTrigger>
                  <AccordionContent>
                    We provide allergen information for all our products. However, all food is prepared in a kitchen where allergens are present, so we cannot guarantee that any item is completely allergen-free. Please inform our staff about any allergies when placing your order.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-6">Submit a Support Ticket</h2>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Submit a support ticket and our team will get back to you as soon as possible.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <SupportTicketForm />
              </div>
            </section>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Main Location</p>
                  <p className="text-gray-600">123 Coffee Street</p>
                  <p className="text-gray-600">San Francisco, CA 94103</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">support@came.coffee</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Hours of Operation</h3>
              <div className="space-y-1 text-gray-600">
                <p>Monday - Friday: 7:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 8:00 AM - 7:00 PM</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View on Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
