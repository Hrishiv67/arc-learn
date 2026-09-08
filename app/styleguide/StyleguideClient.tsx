"use client";

import { Button, TextButton, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SearchField } from "@/components/ui/SearchField";
import { Callout } from "@/components/ui/Callout";
import { Badge } from "@/components/ui/Badge";
import { StepProgress, ProgressRing } from "@/components/ui/StepProgress";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatTiles } from "@/components/ui/StatTile";
import { Quote } from "@/components/ui/Quote";
import { Accordion } from "@/components/nav/Accordion";

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 py-8 border-b border-mist-600">
      <h2 className="font-heading font-bold text-arc-navy text-[20px]">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </section>
  );
}

export function StyleguideClient() {
  return (
    <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-10">
      <h1 className="font-heading font-bold text-arc-navy text-[30px] md:text-[42px]">
        Styleguide
      </h1>
      <p className="font-body text-[17px] text-arc-ink mt-3 max-w-[60ch]">
        Every ARC Modules primitive used in this app, in every state, for review
        at 375px and 1240px. Radius is 0 everywhere except circular controls; no
        shadow outside the one modal/tooltip overlay use; one red element per
        screen in real product context (not necessarily on this reference page).
      </p>

      <Row title="Button">
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="text">Text</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <IconButton label="Search">
          <Icon name="search" size={18} />
        </IconButton>
        <TextButton>Text button</TextButton>
      </Row>

      <Row title="Badge">
        <Badge tone="navy">Navy</Badge>
        <Badge tone="red">Red</Badge>
        <Badge tone="sky">Sky</Badge>
        <Badge tone="mist">Coming soon</Badge>
        <Badge tone="go">Go</Badge>
        <Badge tone="caution">Caution</Badge>
        <Badge tone="outline">Outline</Badge>
      </Row>

      <Row title="Callout">
        <div className="flex flex-col gap-3 w-full max-w-[520px]">
          <Callout tone="go" title="Correct">
            Feedback for a right answer.
          </Callout>
          <Callout tone="caution" title="Draft lesson text">
            Unverified technical content, flagged visibly.
          </Callout>
          <Callout tone="info" title="Ask a parent or teacher first">
            Account tier notice.
          </Callout>
          <Callout tone="danger" title="Locked">
            Safety-gate explanation.
          </Callout>
        </div>
      </Row>

      <Row title="Forms">
        <div className="flex flex-col gap-4 w-full max-w-[320px]">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Select label="Season">
            <option>2027</option>
          </Select>
          <SearchField />
          <Checkbox label="I have read the safety code" />
          <RadioGroup
            name="demo"
            legend="Pick one"
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
            ]}
          />
        </div>
      </Row>

      <Row title="Progress">
        <div className="flex flex-col gap-4 w-full max-w-[320px]">
          <StepProgress
            steps={[
              { label: "Read", state: "done" },
              { label: "Quiz", state: "current" },
            ]}
          />
          <div className="flex gap-4 items-center">
            <ProgressRing pct={40} />
            <ProgressRing pct={100} done />
          </div>
        </div>
      </Row>

      <Row title="Card / SectionTitle / Quote">
        <Card variant="hairline" className="p-5 w-full max-w-[320px]">
          Hairline card on white.
        </Card>
        <Card variant="mist" className="p-5 w-full max-w-[320px]">
          Mist-fill card for grids.
        </Card>
        <div className="w-full max-w-[320px]">
          <SectionTitle eyebrow="Eyebrow" title="Section title" />
        </div>
        <div className="w-full max-w-[320px]">
          <Quote cite="A first-year team">Reading a flight is a skill.</Quote>
        </div>
      </Row>

      <Row title="StatTiles">
        <div className="w-full">
          <StatTiles
            stats={[
              { value: "800", unit: "ft", label: "Altitude target" },
              { value: "37–40", unit: "sec", label: "Flight duration" },
              { value: "2", unit: "eggs", label: "Payload" },
            ]}
          />
        </div>
      </Row>

      <Row title="Accordion">
        <div className="w-full max-w-[520px]">
          <Accordion
            items={[
              {
                title: "What is ARC Learn?",
                content: "A free companion course.",
              },
              {
                title: "Do I need an account?",
                content: "No — never required.",
              },
            ]}
          />
        </div>
      </Row>
    </div>
  );
}
