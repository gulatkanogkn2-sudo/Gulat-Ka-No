import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

export interface GenericPlaceholderPageProps {
  title: string;
  description: string;
}

export const GenericPlaceholderPage: React.FC<GenericPlaceholderPageProps> = ({ title, description }) => {
  return (
    <PageContainer title={title} description={description}>
      <Card variant="glass" className="border-[#00D9FF]/20 text-center py-12">
        <h3 className="text-2xl font-bold text-[#00D9FF] mb-2 drop-shadow-[0_0_10px_rgba(0,217,255,0.4)]">Coming Soon</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          This section is currently under development. Please check back later.
        </p>
        <Link to="/">
          <Button variant="outline" className="border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF]/10">
            RETURN TO HOME
          </Button>
        </Link>
      </Card>
    </PageContainer>
  );
};
