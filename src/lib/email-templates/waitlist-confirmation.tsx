import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

const SITE_NAME = "Dockier";

interface WaitlistConfirmationProps {
  email?: string;
}

const WaitlistConfirmationEmail = ({ email }: WaitlistConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're on the {SITE_NAME} waitlist</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're on the list.</Heading>
        <Text style={text}>
          Thanks for joining the {SITE_NAME} waitlist
          {email ? ` with ${email}` : ""}. We're rolling out access in waves —
          you'll hear from us as soon as your spot opens up.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>What happens next</Text>
          <Text style={cardText}>
            We'll send a personal note when your account is ready, along with
            onboarding steps tailored to your stack.
          </Text>
        </Section>
        <Text style={footer}>— The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: WaitlistConfirmationEmail,
  subject: `You're on the ${SITE_NAME} waitlist`,
  displayName: "Waitlist confirmation",
  previewData: { email: "ada@example.com" },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: "0 0 16px",
  letterSpacing: "-0.01em",
};
const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#3f3f46",
  margin: "0 0 24px",
};
const card = {
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "18px 20px",
  margin: "0 0 28px",
  backgroundColor: "#fafafa",
};
const cardLabel = {
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#71717a",
  margin: "0 0 6px",
};
const cardText = {
  fontSize: "14px",
  lineHeight: "1.55",
  color: "#27272a",
  margin: 0,
};
const footer = {
  fontSize: "13px",
  color: "#71717a",
  margin: "32px 0 0",
};