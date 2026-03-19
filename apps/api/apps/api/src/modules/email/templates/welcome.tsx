import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmailLayout } from './base-layout';

interface WelcomeEmailProps {
  userName: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  userName = 'there',
  loginUrl = 'https://yourapp.com/login',
}: WelcomeEmailProps) => (
  <BaseEmailLayout previewText="Welcome - Your journey starts here!">
    <Heading style={heading}>Welcome, {userName}!</Heading>

    <Text style={paragraph}>
      Your email has been verified successfully. You're all set to start using
      our platform.
    </Text>

    <Section style={benefitsSection}>
      <Text style={benefitsTitle}>What's next?</Text>
      <Text style={bulletPoint}>✓ Complete your profile</Text>
      <Text style={bulletPoint}>✓ Explore the features and capabilities</Text>
      <Text style={bulletPoint}>✓ Set up your preferences</Text>
      <Text style={bulletPoint}>✓ Get started in minutes</Text>
    </Section>

    <Section style={buttonSection}>
      <Button href={loginUrl} style={button}>
        Get Started
      </Button>
    </Section>

    <Text style={paragraph}>
      If you have any questions or need assistance, our support team is here to
      help.
    </Text>
  </BaseEmailLayout>
);

export default WelcomeEmail;

// Styles

const heading = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '32px 0 0',
  padding: '0',
};

const paragraph = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const benefitsSection = {
  background: '#f8fafc',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '24px',
  borderLeft: '4px solid #e11d48',
};

const benefitsTitle = {
  color: '#e11d48',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const bulletPoint = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '4px 0',
};

const buttonSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#e11d48',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};
