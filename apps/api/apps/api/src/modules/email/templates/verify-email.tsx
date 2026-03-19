import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmailLayout } from './base-layout';

interface VerifyEmailProps {
  otp: string;
  userName?: string;
  expiresInMinutes?: number;
}

export const VerifyEmail = ({
  otp = '123456',
  userName,
  expiresInMinutes = 10,
}: VerifyEmailProps) => (
  <BaseEmailLayout previewText="Verify your email address">
    <Heading style={heading}>
      {userName ? `Hi ${userName}!` : 'Welcome!'}
    </Heading>

    <Text style={paragraph}>
      Thank you for signing up. To complete your registration, please verify
      your email address using the OTP code below:
    </Text>

    <Section style={otpSection}>
      <Text style={otpText}>{otp}</Text>
    </Section>

    <Text style={paragraph}>
      This code will expire in <strong>{expiresInMinutes} minutes</strong>.
    </Text>

    <Text style={paragraph}>
      If you didn't create an account, you can safely ignore this email.
    </Text>
  </BaseEmailLayout>
);

export default VerifyEmail;

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

const otpSection = {
  background: '#f8fafc',
  borderRadius: '8px',
  margin: '32px 0',
  padding: '32px',
  textAlign: 'center' as const,
  border: '2px dashed #cbd5e1',
};

const otpText = {
  color: '#e11d48',
  fontSize: '48px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
};
