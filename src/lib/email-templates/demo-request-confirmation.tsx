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

interface DemoConfirmationProps {
  name?: string;
  company?: string;
}

const DemoRequestConfirmationEmail = ({ name, company }: DemoConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} demo request is in</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thanks, ${name}.` : "Thanks for reaching out."}
        </Heading>
        <Text style={text}>
          We've received your demo request{company ? ` for ${company}` : ""} and
          a member of the {SITE_NAME} team will be in touch within one business
          day to schedule a 30-minute walkthrough tailored to your stack.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>What to expect</Text>
          <Text style={cardText}>
            A short scheduling note from a real engineer, plus a few questions
            so we can shape the demo around the repos and workflows you
            mentioned.
          </Text>
        </Section>
        <Text style={footer}>— The {SITE_NAME} team</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: DemoRequestConfirmationEmail,
  subject: `Your ${SITE_NAME} demo request is in`,
  displayName: "Demo request confirmation",
  previewData: { name: "Ada", company: "Acme Inc." },
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