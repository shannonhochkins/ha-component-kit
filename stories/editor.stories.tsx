import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

export default {
  title: "editor/WIP - Drag and Drop editor",
  component: Render,
  tags: ["autodocs"],
  parameters: {
    hidePrimary: true,
    hideComponentProps: true,
    afterPrimary: <SplashContent />
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

function Render() {
  return <></>
}

function SplashContent() {
  return <>
    {/* ─────────────────────────  Hero  ───────────────────────── */}
    <section id="hero">
      {/* TODO: Hero background / screenshot */}
      <h3>Build Your Dream Home&nbsp;Assistant&nbsp;Dashboard&nbsp;<em>without</em>&nbsp;the YAML Headaches</h3>
      <p>
        <a href="https://www.npmjs.com/package/@hakit/core" target="_blank" rel="noreferrer">@hakit/core</a> &amp; <a href="https://www.npmjs.com/package/@hakit/components" target="_blank" rel="noreferrer">@hakit/components</a> give developers super-powers, but let’s be real:
        not everyone wants to live in VS Code. <br />
        <span className="tagline">Introducing a fresh, drag-and-drop editor that anyone can master.</span>
      </p>
      {/* TODO: Primary call-to-action button */}
    </section>

    {/* ─────────────────────────  The Problem  ───────────────────────── */}
    <section id="problem">
      <h4>Why does dashboard building still feel like rocket science?</h4>
      <p>
        Lovelace is brilliant, but cobbling together community plugins, editing sprawling YAML, and praying nothing
        breaks after an update? <br />We’ve been there, we’ve sworn at the screen, and we decided enough was enough.
      </p>
    </section>

    {/* ─────────────────────────  The Solution  ───────────────────────── */}
    <section id="solution">
      <h4>Say g’day to <a className="brand" href="https://github.com/shannonhochkins/hakit" target="_blank" rel="noreferrer">https://github.com/shannonhochkins/hakit</a></h4>
      <ul className="features">
        <li>
          <strong>Drag &amp; Drop Bliss</strong> – Move components exactly where you want them. No coordinates, no
          typos.
        </li>
        <li>
          <strong>Click-to-Edit</strong> – Tap a card, tweak the options, watch it update instantly.
        </li>
        <li>
          <strong>Live&nbsp;Previews</strong> – See every change in real-time before you hit publish.
        </li>
        <li>
          <strong>Advanced&nbsp;Fields 🚀</strong> – Text, numbers, colour pickers, file uploads, repeaters… you name it,
          we’ve got it (or you can add it).
        </li>
        <li>
          <strong>Developer&nbsp;Mode</strong> – Point to a local repo, hack away, hot-reload in the editor. Zero build
          loops.
        </li>
        <li><strong>Built-in asset uploads</strong> – Add images or other media straight to a component through its upload field—no external hosting or extra code needed.</li>
        <li><strong>One dashboard, all devices</strong> – Fine-tune each component for mobile, tablet, and desktop within a single dashboard—no duplicate dashboards required.</li>
        <li>
          <strong>Addon&nbsp;Marketplace</strong> – Drop a GitHub URL and the editor scaffolds the rest. Clear docs,
          smooth DX.
        </li>
        <li>
          <strong>Multiple Dashboards ➕ Pages</strong> – Craft distinct dashboards with clean URLs, then deep-link
          between them.
        </li>
        <li>
          <strong>Conditional&nbsp;Recipes</strong> – Hide, show, or style components based on other components’ state
          (no extra code).
        </li>
        <li>
          <strong>Granular&nbsp;Styling</strong> – Inline CSS fields on every component for pixel-perfect control.
        </li>
        <li>
          <strong>Isolated Viewer</strong> – Preview dashboards outside Home Assistant for lightning-fast load times
          (with optional in-app embedding coming soon).
        </li>
        <li>
          <strong>Custom&nbsp;Dropzones</strong> – Define exactly what can (or cannot) be dropped where.
        </li>
      </ul>
    </section>

    {/* ─────────────────────────  Community & Early Access  ───────────────────────── */}
    <section id="community">
      <h4>We’re simply not ready yet</h4>
      <p>Whilst we’re working on getting things into shape, feel free to star the repo, join the discord to keep up to date.</p>
      {/* <h4>Jump in early – it’s free while we shape it together</h4>
      <p>
        We’re still pre-alpha (<b>read</b>: things will break, unicorns may cry). During this phase the hosted editor is <span
          className="highlight"
        >
          completely free
        </span>{' '}
        while we gather feedback.<br />
        When we flip the switch to paid plans, pricing will stay&nbsp;cheap and cheerful – promise.
      </p> */}
      <p>
        <a href="https://github.com/shannonhochkins/hakit" target="_blank" rel="noopener noreferrer">
          <strong>⭐ Star us on GitHub</strong>
        </a> to follow progress, drop issues, or peek at the source.
        
      </p>
      <p>
        <a href="https://discord.com/invite/cGgbmppKJZ" target="_blank" rel="noopener noreferrer">
          <strong>💬 Join the Discord crew</strong>
        </a> for hot-off-the-press updates and to ~heckle~ chat with the devs.
      </p>
    </section>

    {/* ─────────────────────────  Call-To-Action  ───────────────────────── */}
    {/* <section id="cta">
      <h4>Ready to build a dashboard you’ll actually brag about?</h4>
      <p>
        Start tinkering today at{' '}
        <a href="https://hakit.dev" target="_blank" rel="noopener noreferrer">
          hakit.dev
        </a>{' '}
        – your future-proof dashboard awaits.
      </p>
    </section> */}
  </>
};