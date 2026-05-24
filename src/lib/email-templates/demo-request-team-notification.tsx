import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

const SITE_NAME = "Dockier";
const TEAM_EMAIL = "hello@laravel42.com";

interface TeamNotificationProps {
  name?: string;
  email?: string;
  company?: string;
  teamSize?: string;
  repoIntegrations?: string[];
  useCase?: string;
  source?: string;
}

const DemoRequestTeamNotificationEmail = ({
  name,
  email,
  company,
  teamSize,
  repoIntegrations,
  useCase,
  source,
}: TeamNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      New demo request{company ? ` from ${company}` : ""}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New demo request</Heading>
        <Text style={lead}>
          A new demo request just landed on {SITE_NAME}.
        </Text>

        <Section style={card}>
          <Row label="Name" value={name} />
          <Row label="Email" value={email} />
          <Row label="Company" value={company} />
          <Row label="Team size" value={teamSize} />
          <Row
            label="Repo integrations"
            value={repoIntegrations?.join(", ") || "—"}
          />
          <Row label="Source" value={source} />
        </Section>

        <Hr style={hr} />
        <Text style={label}>Use case</Text>
        <Text style={useCaseText}>{useCase || "—"}</Text>

        <Text style={footer}>
          Sent automatically to {TEAM_EMAIL} from {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
);

const Row = ({ label: l, value }: { label: string; value?: string }) => (
  <Section style={row}>
    <Text style={rowLabel}>{l}</Text>
    <Text style={rowValue}>{value && value.length > 0 ? value : "—"}</Text>
  </Section>
);

export const template = {
  component: DemoRequestTeamNotificationEmail,
  subject: (data: Record<string, unknown>) => {
    const company = typeof data?.company === "string" ? data.company : null;
    return company
      ? `New demo request — ${company}`
      : "New demo request";
  },
  displayName: "Demo request — team notification",
  to: TEAM_EMAIL,
  previewData: {
    name: "Ada Lovelace",
    email: "ada@acme.com",
    company: "Acme Inc.",
    teamSize: "21-50 engineers",
    repoIntegrations: ["GitHub", "GitLab"],
    useCase: "Migrating from legacy security tools to a unified platform.",
    source: "/demo",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "600px" };
const h1 = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: "0 0 8px",
  letterSpacing: "-0.01em",
};
const lead = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#52525b",
  margin: "0 0 24px",
};
const card = {
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "8px 18px",
  margin: "0 0 24px",
  backgroundColor: "#fafafa",
};
const row = { padding: "10px 0", borderBottom: "1px solid #ececef" };
const rowLabel = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#71717a",
  margin: "0 0 2px",
};
const rowValue = {
  fontSize: "14px",
  color: "#18181b",
  margin: 0,
};
const hr = { borderColor: "#e4e4e7", margin: "8px 0 18px" };
const label = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#71717a",
  margin: "0 0 6px",
};
const useCaseText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#18181b",
  whiteSpace: "pre-wrap" as const,
  margin: "0 0 24px",
};
const footer = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "24px 0 0",
};