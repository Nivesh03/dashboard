'use client';

import { IntegrationTest } from '@/components/dashboard/integration-test';
import { UserFlowTest } from '@/components/dashboard/user-flow-test';
import { IntegrationSummary } from '@/components/dashboard/integration-summary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Integration Testing</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comprehensive testing of all dashboard components and user flows.
          </p>
        </div>
      </div>

      {/* Integration Summary */}
      <IntegrationSummary />

      {/* Testing Tabs */}
      <Tabs defaultValue="integration" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integration">Component Integration</TabsTrigger>
          <TabsTrigger value="user-flows">User Flow Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integration" className="space-y-4">
          <IntegrationTest />
        </TabsContent>
        
        <TabsContent value="user-flows" className="space-y-4">
          <UserFlowTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}