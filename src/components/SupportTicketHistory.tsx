
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserSupportTickets, SupportTicket } from '@/services/supportService';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SupportTicketHistory: React.FC = () => {
  const { user } = useAuth();
  
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-support-tickets', user?.id],
    queryFn: () => user ? getUserSupportTickets(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Error loading tickets</h3>
        <p className="text-gray-600 mb-4">Could not load your support ticket history.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
        <p className="text-gray-600">You haven't created any support tickets yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Support Ticket History</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.issue_description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SupportTicketHistory;
