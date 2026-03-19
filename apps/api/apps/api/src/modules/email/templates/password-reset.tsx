import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmailLayout } from './base-layout';

interface PasswordResetEmailProps {
  resetUrl: string;
  userName?: string;
}

export const PasswordResetEmail = ({
  resetUrl = 'https://yourapp.com/auth/reset-password?token=example',
  userName = 'there',
}: PasswordResetEmailProps) => (
  <BaseEmailLayout previewText="Reset your password — link expires in 1 hour">
    <Heading style={heading}>Reset your password</Heading>

    <Text style={paragraph}>Hi {userName},</Text>

    <Text style={paragraph}>
      We received a request to reset the password for your account. Click the
      button below to choose a new password. This link is valid for{' '}
      <strong>1 hour</strong>.
    </Text>

    <Section style={buttonSection}>
      <Button href={resetUrl} style={button}>
        Reset Password
      </Button>
    </Section>

    <Section style={warningSection}>
      <Text style={warningText}>
        🔒 If you didn't request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </Text>
    </Section>

    <Text style={paragraph}>
      For security, this link will expire in 1 hour and can only be used once.
      After resetting your password, all active sessions will be signed out.
    </Text>
  </BaseEmailLayout>
);

export default PasswordResetEmail;

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

const warningSection = {
  background: '#fef9c3',
  borderRadius: '8px',
  margin: '0 0 24px',
  padding: '16px 20px',
  borderLeft: '4px solid #eab308',
};

const warningText = {
  color: '#713f12',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};
