import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const BaseEmailLayout = ({
  previewText,
  children,
}: BaseEmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Global Header */}
          <Section style={logoSection}>
            <Heading style={logoText}>YOUR APP</Heading>
          </Section>

          {/* Dynamic Content injected here */}
          <Section style={contentSection}>{children}</Section>

          {/* Global Footer */}
          <Hr style={hr} />
          <Text style={footerText}>
            Your App - Professional Solutions
            <br />
            <Link href="https://yourapp.com" style={link}>
              yourapp.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// --- Shared Base Styles ---

export const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

export const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 20px 48px',
  marginBottom: '64px',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  maxWidth: '600px',
};

export const logoSection = {
  padding: '32px 0 0',
  textAlign: 'center' as const,
};

export const logoText = {
  color: '#e11d48',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  textAlign: 'center' as const,
  letterSpacing: '0.5px',
};

export const contentSection = {
  // Inner children will provide their exact paddings/margins.
};

export const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0 24px',
};

export const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0',
  textAlign: 'center' as const,
};

export const link = {
  color: '#e11d48',
  textDecoration: 'underline',
};
