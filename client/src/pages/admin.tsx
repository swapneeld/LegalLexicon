import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingSubmissions from '@/components/admin/PendingSubmissions';
import ReportedContent from '@/components/admin/ReportedContent';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      setLocation('/');
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600">Manage content, review submissions, and monitor user activity.</p>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
          <TabsTrigger value="reported">Reported Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PendingSubmissions />
        </TabsContent>
        
        <TabsContent value="reported">
          <ReportedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
