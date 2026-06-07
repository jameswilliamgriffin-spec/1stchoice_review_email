import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ReviewEmailProps = {
  customerName: string;
  workCompleted: string;
  personalMessage?: string;
  baseUrl?: string;
};

const googleReviewUrl =
  "https://search.google.com/local/writereview?placeid=ChIJ73dnpHG5cEgRG6LT16AuR0E";
const checkatradeUrl =
  "https://www.checkatrade.com/trades/1stchoiceroofingandbuildingltd";

// Change the core brand colours here if the visual identity changes.
const colors = {
  red: "#e31313",
  ink: "#171717",
  muted: "#666666",
  softText: "#3f3f46",
  border: "#e8e8e5",
  background: "#f7f7f4",
  panel: "#ffffff",
  blue: "#155dfc",
};

export default function ReviewEmail({
  customerName,
  workCompleted,
  personalMessage,
  baseUrl = "https://www.1stchoiceroofers.uk",
}: ReviewEmailProps) {
  // Public image files live in public and are referenced by their root paths.
  // Email clients need absolute URLs, so the API route provides the site origin.
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const logoUrl = `${normalizedBaseUrl}/logo.png`;
  const googleLogoUrl = `${normalizedBaseUrl}/google.png`;
  const checkatradeLogoUrl = `${normalizedBaseUrl}/logos-checkatrade.png`;

  return (
    <Html>
      <Head />
      <Preview>Thank you from 1st Choice Roofers</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Section style={header}>
              {/* Change email logos by replacing public/logo.png and public/logo_icon.png. */}
              <Img
                src={logoUrl}
                width="236"
                height="47"
                alt="1st Choice Roofers"
                style={logo}
              />
              <Text style={eyebrow}>Review request</Text>
              <Text style={headline}>
                Thank you for choosing{" "}
                <span style={{ color: colors.red }}>1st Choice Roofers</span>
              </Text>
              <Text style={intro}>
                A quick note from Richard and the team following your completed
                roofing work.
              </Text>
            </Section>

            <Section style={messagePanel}>
              {/* Change the customer-facing wording in this section. */}
              <Text style={greeting}>Hi {customerName},</Text>
              <Text style={paragraph}>
                Thank you again for choosing 1st Choice Roofers. We really
                appreciate your business and hope you are pleased with the work
                completed.
              </Text>
              <Text style={paragraph}>
                It was a pleasure helping with your{" "}
                <strong>{workCompleted}</strong>.
              </Text>

              {personalMessage ? (
                <Text style={personalNote}>{personalMessage}</Text>
              ) : null}

              <Text style={centeredParagraph}>
                As a family-run business, Google reviews make a huge difference
                to us. They not only help support our business, but they also
                help future customers feel confident that they are choosing a
                trusted, reliable roofing company.
              </Text>
              <Text style={{ ...paragraph, marginBottom: "0" }}>
                If you have a spare minute, we would be really grateful if you
                could leave us a review using one of the links below.
              </Text>
            </Section>

            <Section style={googlePanel}>
              <Img
                src={googleLogoUrl}
                width="200"
                height="100"
                alt="Google Reviews"
                style={googleLogo}
              />
              <Text style={reviewHeading}>
                Help Other Homeowners Choose With Confidence
              </Text>
              <Text style={reviewCopy}>
                It only takes a minute, but it helps local homeowners choose a
                reliable roofing company with confidence.
              </Text>
              <Button href={googleReviewUrl} style={googleButton}>
                Leave A Google Review
              </Button>
            </Section>

            <Section style={checkPanel}>
              <Img
                src={checkatradeLogoUrl}
                width="192"
                height="98"
                alt="Checkatrade"
                style={checkLogo}
              />
              <Text style={checkCopy}>
                <strong style={checkLead}>Already use Checkatrade?</strong>{" "}
                We&apos;d be grateful for your feedback there too.
              </Text>
              <Text style={checkCopy}>
                Some homeowners prefer to read reviews on Checkatrade when
                choosing a trusted local roofer.
              </Text>
              <Button href={checkatradeUrl} style={checkButton}>
                Review us on Checkatrade
              </Button>
            </Section>

            <Section style={footer}>
              <Hr style={footerTopRule} />
              <Img
                src={logoUrl}
                width="220"
                height="44"
                alt="1st Choice Roofers"
                style={footerLogo}
              />
              <Text style={footerSignoff}>Kind regards,</Text>
              <Text style={footerSignature}>Richard &amp; the team</Text>
              <Text style={footerCompany}>1st Choice Roofers</Text>
              <Text style={footerContact}>Birmingham: 0121 623 7200</Text>
              <Text style={footerContact}>info@1stchoiceroofers.uk</Text>
              <Text style={footerText}>
                Fully insured • Family-run business • 30+ years experience
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  margin: "0",
  backgroundColor: colors.background,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
};

const container = {
  width: "100%",
  maxWidth: "680px",
  margin: "0 auto",
  padding: "32px 14px",
};

const card = {
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
  borderRadius: "28px",
  backgroundColor: colors.panel,
  boxShadow: "0 24px 80px rgba(23, 23, 23, 0.08)",
};

const header = {
  padding: "42px 44px 34px",
  textAlign: "center" as const,
};

const logo = {
  display: "block",
  margin: "0 auto 34px",
};

const eyebrow = {
  margin: "0 0 12px",
  color: colors.red,
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "20px",
};

const headline = {
  margin: "0 auto",
  maxWidth: "500px",
  color: colors.ink,
  fontSize: "38px",
  fontWeight: "650",
  letterSpacing: "-0.4px",
  lineHeight: "43px",
};

const intro = {
  margin: "18px auto 0",
  maxWidth: "460px",
  color: colors.softText,
  fontSize: "18px",
  lineHeight: "29px",
};

const messagePanel = {
  margin: "0 28px 16px",
  padding: "28px",
  border: `1px solid ${colors.border}`,
  borderRadius: "22px",
  backgroundColor: "#fbfbfa",
};

const greeting = {
  margin: "0 0 18px",
  color: colors.ink,
  fontSize: "20px",
  fontWeight: "650",
  lineHeight: "28px",
};

const paragraph = {
  margin: "0 0 16px",
  color: colors.softText,
  fontSize: "15px",
  lineHeight: "25px",
};

const personalNote = {
  margin: "4px 0 18px",
  padding: "18px 20px",
  borderRadius: "16px",
  backgroundColor: colors.panel,
  color: colors.softText,
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const centeredParagraph = {
  ...paragraph,
  textAlign: "center" as const,
};

const googlePanel = {
  margin: "0 28px 16px",
  padding: "36px 34px",
  border: "1px solid #dce9ff",
  borderRadius: "24px",
  backgroundColor: "#f3f8ff",
  boxShadow: "0 18px 48px rgba(21, 93, 252, 0.08)",
  textAlign: "center" as const,
};

const googleLogo = {
  display: "block",
  margin: "0 auto 22px",
};

const reviewHeading = {
  margin: "0 auto",
  maxWidth: "500px",
  color: colors.ink,
  fontSize: "30px",
  fontWeight: "650",
  letterSpacing: "-0.2px",
  lineHeight: "36px",
  textAlign: "center" as const,
};

const reviewCopy = {
  margin: "14px auto 0",
  maxWidth: "470px",
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const googleButton = {
  display: "block",
  margin: "26px auto 0",
  padding: "17px 28px",
  borderRadius: "16px",
  backgroundColor: colors.blue,
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "650",
  textAlign: "center" as const,
  textDecoration: "none",
};

const checkPanel = {
  margin: "0 28px 18px",
  padding: "28px 32px",
  border: `1px solid ${colors.border}`,
  borderRadius: "24px",
  backgroundColor: "#f8f8f6",
  boxShadow: "0 14px 38px rgba(23, 23, 23, 0.05)",
  textAlign: "center" as const,
};

const checkLogo = {
  display: "block",
  margin: "0 auto 4px",
};

const checkCopy = {
  margin: "0 auto 10px",
  maxWidth: "470px",
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const checkLead = {
  color: colors.ink,
  fontWeight: "700",
};

const checkButton = {
  display: "inline-block",
  margin: "12px auto 0",
  padding: "15px 24px",
  border: "1px solid #d6d6d3",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  color: colors.ink,
  fontSize: "15px",
  fontWeight: "650",
  textAlign: "center" as const,
  textDecoration: "none",
};

const footer = {
  margin: "24px 28px 30px",
  padding: "0 28px 34px",
  borderRadius: "0",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};

const footerTopRule = {
  margin: "0 auto 30px",
  borderColor: colors.red,
  borderWidth: "2px",
};

const footerLogo = {
  display: "block",
  margin: "0 auto 22px",
};

const footerSignoff = {
  margin: "0 0 6px",
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "22px",
};

const footerSignature = {
  margin: "0",
  color: colors.ink,
  fontSize: "16px",
  fontWeight: "650",
  lineHeight: "23px",
};

const footerCompany = {
  margin: "0 0 18px",
  color: colors.softText,
  fontSize: "15px",
  lineHeight: "23px",
};

const footerContact = {
  margin: "0 0 6px",
  color: colors.muted,
  fontSize: "14px",
  lineHeight: "22px",
};

const footerText = {
  margin: "18px 0 0",
  color: colors.muted,
  fontSize: "13px",
  fontWeight: "600",
  lineHeight: "20px",
  textAlign: "center" as const,
};
