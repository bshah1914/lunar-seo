import React, { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  Building2,
  Search,
  Key,
  Link,
  Swords,
  FileText,
  Image,
  Share2,
  Megaphone,
  Target,
  BarChart3,
  Bot,
  Brain,
  Bell,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Play,
  Users,
  Globe,
  TrendingUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ModuleDoc {
  id: string
  icon: React.ElementType
  title: string
  description: string
  content: React.ReactNode
}

// ---------------------------------------------------------------------------
// Reusable Components
// ---------------------------------------------------------------------------

const ProTip = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-amber-900">
      <span className="font-semibold">Pro Tip:</span> {children}
    </div>
  </div>
)

const Badge = ({
  color,
  children,
}: {
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray'
  children: React.ReactNode
}) => {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 border-b border-gray-100 pb-2">
    {children}
  </h3>
)

const StepList = ({ steps }: { steps: string[] }) => (
  <ol className="list-none space-y-2 my-3">
    {steps.map((step, i) => (
      <li key={i} className="flex gap-3 items-start">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
          {i + 1}
        </span>
        <span className="text-sm text-gray-700">{step}</span>
      </li>
    ))}
  </ol>
)

const SimpleTable = ({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h, i) => (
            <th
              key={i}
              className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                className="px-4 py-2.5 text-gray-600 border-b border-gray-100"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ---------------------------------------------------------------------------
// Module Documentation Content
// ---------------------------------------------------------------------------

const modules: ModuleDoc[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    description:
      'Overview of all your marketing data across clients in one place.',
    content: (
      <>
        <SectionHeading>What It Shows</SectionHeading>
        <p className="text-sm text-gray-700">
          The Dashboard is your command center. It aggregates data from all your
          clients and surfaces the most important metrics, trends, and alerts so
          you can see the health of every campaign at a glance.
        </p>

        <SectionHeading>Key Sections</SectionHeading>
        <SimpleTable
          headers={['Section', 'What It Shows']}
          rows={[
            ['Stats Cards', 'Total clients, keywords tracked, backlinks, content pieces'],
            ['Traffic Chart', 'Organic traffic trend over the last 30/90/365 days'],
            ['Keyword Distribution', 'Pie chart showing keyword position ranges'],
            ['Activity Feed', 'Recent actions taken by you and Atlas AI'],
            ['Top Keywords', 'Your best-performing keywords across all clients'],
            ['Active Campaigns', 'Campaigns currently running with progress bars'],
            ['Alerts', 'Issues that need your attention, sorted by severity'],
          ]}
        />

        <SectionHeading>How to Use</SectionHeading>
        <StepList
          steps={[
            'The dashboard updates automatically every time you visit it.',
            'Click any stat card to drill down into the detailed module.',
            'Use the date range picker in the top-right to change the time window.',
            'Stats aggregate from all your active clients by default. Use the client filter to focus on one.',
          ]}
        />

        <ProTip>
          Check your dashboard first thing every morning. The alerts section
          will tell you if anything needs urgent attention.
        </ProTip>
      </>
    ),
  },
  {
    id: 'clients',
    icon: Building2,
    title: 'Client Management',
    description:
      'Add, edit, and manage all your clients and their brand settings.',
    content: (
      <>
        <SectionHeading>How to Add a Client</SectionHeading>
        <StepList
          steps={[
            'Navigate to the Clients page from the sidebar.',
            'Click the "Add Client" button in the top-right corner.',
            'Fill in the required fields: Company Name and Domain.',
            'Add optional details: Industry, Brand Colors, Brand Fonts.',
            'Enter target keywords your client wants to rank for.',
            'Add competitor domains to track.',
            'Set marketing goals (e.g., "Increase organic traffic by 50%").',
            'Click "Create Client" to save.',
          ]}
        />

        <SectionHeading>Client Fields Explained</SectionHeading>
        <SimpleTable
          headers={['Field', 'Description', 'Required']}
          rows={[
            ['Company Name', 'The official name of the client or brand', 'Yes'],
            ['Domain', 'The website URL (e.g., example.com)', 'Yes'],
            ['Industry', 'Business category for tailored recommendations', 'No'],
            ['Brand Colors', 'Primary and secondary hex colors for content/images', 'No'],
            ['Brand Fonts', 'Typography preferences for generated content', 'No'],
            ['Keywords', 'Target search terms to track rankings for', 'No'],
            ['Competitors', 'Competitor domains to monitor', 'No'],
            ['Marketing Goals', 'Objectives that guide AI recommendations', 'No'],
          ]}
        />

        <SectionHeading>Client Status</SectionHeading>
        <div className="space-y-2 my-3">
          <div className="flex items-center gap-2">
            <Badge color="green">Active</Badge>
            <span className="text-sm text-gray-600">Client is being actively managed and tracked.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="yellow">Paused</Badge>
            <span className="text-sm text-gray-600">Tracking is temporarily stopped. Data is preserved.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="gray">Archived</Badge>
            <span className="text-sm text-gray-600">Client is no longer active. Historical data remains accessible.</span>
          </div>
        </div>

        <SectionHeading>Editing and Deleting</SectionHeading>
        <p className="text-sm text-gray-700 mb-2">
          Click on any client card to open their detail page. Use the edit icon
          to modify details, or the menu button for options including Archive and
          Delete. Deleting a client is permanent and removes all associated data.
        </p>

        <SectionHeading>Brand Kit</SectionHeading>
        <p className="text-sm text-gray-700">
          Brand colors and fonts you set here are automatically used by the AI
          Content Studio and AI Image Studio to maintain visual consistency
          across all generated assets.
        </p>

        <ProTip>
          Fill in as many details as possible when creating a client. The more
          context you provide, the better AI-generated content and
          recommendations will be.
        </ProTip>
      </>
    ),
  },
  {
    id: 'seo-audit',
    icon: Search,
    title: 'SEO Audit',
    description:
      'Scan websites for technical SEO issues and get actionable fixes.',
    content: (
      <>
        <SectionHeading>What Is an SEO Audit?</SectionHeading>
        <p className="text-sm text-gray-700">
          An SEO audit scans your client's website and evaluates it against
          hundreds of technical SEO best practices. It identifies issues that
          could be hurting search rankings and provides specific recommendations
          to fix them.
        </p>

        <SectionHeading>How to Run an Audit</SectionHeading>
        <StepList
          steps={[
            'Go to SEO Audit from the sidebar.',
            'Select a client from the dropdown.',
            'Click "Run Audit" and wait for the scan to complete (usually 1-3 minutes).',
            'Review the results organized by category and severity.',
          ]}
        />

        <SectionHeading>Understanding Scores</SectionHeading>
        <SimpleTable
          headers={['Score', 'Range', 'Meaning']}
          rows={[
            ['Overall', '0-100', 'Combined health score of the entire site'],
            ['Performance', '0-100', 'Page speed and loading optimization'],
            ['SEO', '0-100', 'On-page SEO elements and best practices'],
            ['Accessibility', '0-100', 'How usable the site is for all visitors'],
            ['Best Practices', '0-100', 'Security, modern standards, and code quality'],
          ]}
        />

        <SectionHeading>Core Web Vitals Explained</SectionHeading>
        <SimpleTable
          headers={['Metric', 'What It Measures', 'Good', 'Needs Improvement', 'Poor']}
          rows={[
            ['LCP (Largest Contentful Paint)', 'Page load speed', '< 2.5s', '2.5s - 4.0s', '> 4.0s'],
            ['FID (First Input Delay)', 'Interactivity responsiveness', '< 100ms', '100ms - 300ms', '> 300ms'],
            ['CLS (Cumulative Layout Shift)', 'Visual stability', '< 0.1', '0.1 - 0.25', '> 0.25'],
          ]}
        />

        <SectionHeading>Issue Severity Levels</SectionHeading>
        <div className="space-y-2 my-3">
          <div className="flex items-center gap-2">
            <Badge color="red">Critical</Badge>
            <span className="text-sm text-gray-600">Fix immediately. These are actively hurting your rankings.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="yellow">Warning</Badge>
            <span className="text-sm text-gray-600">Fix soon. These may be limiting your ranking potential.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="blue">Info</Badge>
            <span className="text-sm text-gray-600">Nice to have. Minor improvements for a polished site.</span>
          </div>
        </div>

        <SectionHeading>Common Issues and Fixes</SectionHeading>
        <SimpleTable
          headers={['Issue', 'Impact', 'How to Fix']}
          rows={[
            ['Missing meta descriptions', 'Medium', 'Add a unique 150-160 character description to every page'],
            ['Large images', 'High', 'Compress images, use WebP format, add width/height attributes'],
            ['Broken links (404s)', 'High', 'Fix or remove links pointing to non-existent pages'],
            ['Missing alt text', 'Medium', 'Add descriptive alt attributes to every image'],
            ['Redirect chains', 'Medium', 'Update links to point directly to the final URL'],
            ['Missing H1 tag', 'Medium', 'Add exactly one H1 tag per page with a descriptive heading'],
            ['Slow server response', 'High', 'Upgrade hosting, enable caching, optimize database queries'],
          ]}
        />

        <ProTip>
          After fixing critical issues, run the audit again to verify your
          fixes. Aim for an overall score above 80 before moving to warning-level
          issues.
        </ProTip>
      </>
    ),
  },
  {
    id: 'keywords',
    icon: Key,
    title: 'Keyword Intelligence',
    description:
      'Track keyword rankings, discover opportunities, and monitor positions.',
    content: (
      <>
        <SectionHeading>What Are Keywords?</SectionHeading>
        <p className="text-sm text-gray-700">
          Keywords are the search terms people type into Google when looking for
          products, services, or information. Tracking your keyword positions
          tells you how visible your website is in search results.
        </p>

        <SectionHeading>How to Add Keywords</SectionHeading>
        <StepList
          steps={[
            'Go to Keywords from the sidebar.',
            'Select your client from the dropdown.',
            'Click "Add Keywords" to enter keywords manually, one per line.',
            'Or click "AI Research" to let AI discover relevant keywords for your niche.',
            'Keywords will begin tracking within 24 hours.',
          ]}
        />

        <SectionHeading>Table Columns Explained</SectionHeading>
        <SimpleTable
          headers={['Column', 'What It Means']}
          rows={[
            ['Position', 'Current Google ranking for this keyword (1 = top result)'],
            ['Change', 'Position change since last check (green = improved, red = dropped)'],
            ['Volume', 'Monthly search volume - how many people search this term'],
            ['Difficulty', 'How hard it is to rank for this keyword (0-100)'],
            ['CPC', 'Cost per click if you were to run ads for this keyword'],
            ['SERP Features', 'Special result types appearing for this keyword'],
            ['URL', 'Which page on your site ranks for this keyword'],
          ]}
        />

        <SectionHeading>Position Ranges</SectionHeading>
        <SimpleTable
          headers={['Range', 'Label', 'Visibility']}
          rows={[
            ['1-3', 'Excellent', 'Top of page 1 - gets ~60% of all clicks'],
            ['4-10', 'Page 1', 'Visible on first page - gets ~30% of clicks'],
            ['11-20', 'Page 2', 'Rarely seen by users - very few clicks'],
            ['21-50', 'Low', 'Buried in results - almost no organic traffic'],
            ['50+', 'Not visible', 'Effectively invisible in search results'],
          ]}
        />

        <SectionHeading>Keyword Difficulty</SectionHeading>
        <div className="space-y-2 my-3">
          <div className="flex items-center gap-2">
            <Badge color="green">Easy (0-30)</Badge>
            <span className="text-sm text-gray-600">New or small sites can rank with quality content alone.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="yellow">Medium (31-60)</Badge>
            <span className="text-sm text-gray-600">Requires good content plus some backlinks to rank.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="red">Hard (61-100)</Badge>
            <span className="text-sm text-gray-600">Very competitive. Needs strong authority, content, and backlinks.</span>
          </div>
        </div>

        <SectionHeading>SERP Features</SectionHeading>
        <SimpleTable
          headers={['Feature', 'What It Is']}
          rows={[
            ['Featured Snippet', 'A highlighted answer box at the very top of results'],
            ['People Also Ask', 'Expandable related questions that appear in results'],
            ['Image Pack', 'A row of images shown within the search results'],
            ['Video', 'Video results, typically from YouTube'],
            ['Knowledge Panel', 'An information box on the right side of results'],
          ]}
        />

        <SectionHeading>Keyword Groups</SectionHeading>
        <p className="text-sm text-gray-700">
          Organize related keywords into groups (e.g., "Brand Terms", "Product
          Keywords", "Long-tail Questions") for easier management and analysis.
          Groups help you see which topic clusters are performing best.
        </p>

        <ProTip>
          Focus on keywords with high search volume but low difficulty for the
          fastest ranking wins. These are often long-tail keywords (3+ words)
          that larger competitors overlook.
        </ProTip>
      </>
    ),
  },
  {
    id: 'backlinks',
    icon: Link,
    title: 'Backlink Intelligence',
    description:
      'Monitor your backlink profile, find opportunities, and protect your site.',
    content: (
      <>
        <SectionHeading>What Are Backlinks?</SectionHeading>
        <p className="text-sm text-gray-700">
          Backlinks are links from other websites that point to your site. Google
          treats each backlink as a "vote of confidence" - the more quality
          backlinks you have, the more authoritative your site appears, and the
          higher you rank.
        </p>

        <SectionHeading>Why They Matter</SectionHeading>
        <p className="text-sm text-gray-700">
          Backlinks are one of Google's top 3 ranking factors. A site with 100
          high-quality backlinks will almost always outrank a site with 1,000
          low-quality ones. Quality matters far more than quantity.
        </p>

        <SectionHeading>Key Metrics</SectionHeading>
        <SimpleTable
          headers={['Metric', 'What It Means', 'Good Value']}
          rows={[
            ['Domain Authority (DA)', 'Strength of the linking domain (0-100)', '40+ is strong'],
            ['Spam Score', 'Likelihood the link is spammy (0-100%)', 'Below 10%'],
            ['Follow vs Nofollow', 'Whether the link passes ranking power', 'Follow links pass value'],
            ['Anchor Text', 'The clickable text of the link', 'Relevant to your content'],
            ['Referring Domains', 'Unique domains linking to you', 'Diversity matters most'],
          ]}
        />

        <SectionHeading>What Makes a Good Backlink</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li>Comes from a site with high Domain Authority (40+)</li>
          <li>Has a low spam score (under 10%)</li>
          <li>Is from a website relevant to your industry</li>
          <li>Is a "dofollow" link (passes ranking value)</li>
          <li>Has natural, descriptive anchor text</li>
          <li>Is placed within the main content (not footer or sidebar)</li>
        </ul>

        <SectionHeading>Monitoring Your Backlinks</SectionHeading>
        <StepList
          steps={[
            'Check your backlink dashboard weekly for new and lost links.',
            'Review new backlinks - disavow any from spammy or irrelevant sites.',
            'When you lose a valuable backlink, check if the linking page was removed or the link was changed.',
            'Contact the webmaster of sites that removed your links to request reinstatement.',
            'Monitor your referring domain count trend - it should be growing steadily.',
          ]}
        />

        <ProTip>
          One backlink from a high-authority news site (DA 70+) is worth more
          than 100 backlinks from low-quality directories. Focus on earning
          links from reputable, relevant sources.
        </ProTip>
      </>
    ),
  },
  {
    id: 'competitors',
    icon: Swords,
    title: 'Competitor Intelligence',
    description:
      'Analyze competitor strategies and find gaps you can exploit.',
    content: (
      <>
        <SectionHeading>How to Add Competitors</SectionHeading>
        <StepList
          steps={[
            'Go to Competitor Intelligence from the sidebar.',
            'Select your client from the dropdown.',
            'Click "Add Competitor" and enter their domain name.',
            'The system will begin analyzing their SEO profile automatically.',
          ]}
        />

        <SectionHeading>Analysis Types</SectionHeading>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-1">Keyword Gap Analysis</h4>
        <p className="text-sm text-gray-700 mb-3">
          Discovers keywords your competitors rank for that you do not.
          These are immediate opportunities - if they can rank, so can you.
          Sort by volume to find the highest-impact gaps first.
        </p>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-1">Content Gap Analysis</h4>
        <p className="text-sm text-gray-700 mb-3">
          Identifies topics and content types your competitors cover that you
          have not addressed yet. Use these to plan your content calendar and
          fill coverage holes.
        </p>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-1">Backlink Gap Analysis</h4>
        <p className="text-sm text-gray-700 mb-3">
          Finds websites that link to your competitors but not to you. These
          are warm outreach targets because they already link to sites in your
          space.
        </p>

        <SectionHeading>How to Use Insights</SectionHeading>
        <StepList
          steps={[
            'Add gap keywords to your keyword tracking list.',
            'Create content to cover topics your competitors address but you do not.',
            'Reach out to sites linking to competitors and pitch your content as an alternative or addition.',
            'Compare DA, traffic, keywords, and backlinks side by side to benchmark your progress.',
          ]}
        />

        <ProTip>
          Run competitor analysis monthly. Your competitors are constantly
          evolving, and new gaps and opportunities appear regularly. Focus on
          the gaps with the highest search volume and lowest keyword difficulty.
        </ProTip>
      </>
    ),
  },
  {
    id: 'content-studio',
    icon: FileText,
    title: 'AI Content Studio',
    description:
      'Generate SEO-optimized blog posts, landing pages, emails, and more.',
    content: (
      <>
        <SectionHeading>Content Types</SectionHeading>
        <SimpleTable
          headers={['Type', 'Best For', 'Typical Length']}
          rows={[
            ['Blog Article', 'Organic traffic and thought leadership', '1,000-2,500 words'],
            ['Landing Page', 'Conversions and lead generation', '500-1,500 words'],
            ['Email Campaign', 'Nurturing leads and driving action', '200-500 words'],
            ['Ad Copy', 'Paid advertising across platforms', '50-150 words'],
            ['Social Post', 'Social media engagement', '50-280 characters'],
          ]}
        />

        <SectionHeading>How to Generate Content</SectionHeading>
        <StepList
          steps={[
            'Go to AI Content Studio from the sidebar.',
            'Select the content type you want to create.',
            'Enter your topic or headline idea.',
            'Set target keywords (these will be woven into the content naturally).',
            'Choose a tone of voice that matches your brand.',
            'Set the desired word count or length.',
            'Click "Generate" and wait a few seconds.',
            'Review the output, make edits, then publish or save as draft.',
          ]}
        />

        <SectionHeading>Tone Options</SectionHeading>
        <SimpleTable
          headers={['Tone', 'Best For']}
          rows={[
            ['Professional', 'B2B content, whitepapers, corporate blogs'],
            ['Casual', 'Lifestyle brands, personal blogs, social media'],
            ['Persuasive', 'Landing pages, ad copy, sales emails'],
            ['Educational', 'How-to guides, tutorials, documentation'],
            ['Humorous', 'Social media, brand-personality-driven content'],
          ]}
        />

        <SectionHeading>SEO Optimization Panel</SectionHeading>
        <p className="text-sm text-gray-700">
          Every piece of generated content includes an SEO score breakdown with
          a checklist: keyword usage, heading structure, meta title length
          (aim for 50-60 characters), meta description length (aim for 150-160
          characters), internal linking suggestions, and readability grade.
        </p>

        <SectionHeading>Content Workflow</SectionHeading>
        <div className="flex items-center gap-2 my-3 text-sm">
          <Badge color="gray">Draft</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="yellow">Review</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="green">Published</Badge>
        </div>

        <ProTip>
          AI-generated content is a starting point, not a finished product.
          Always review, fact-check, and add your unique perspective. The best
          content combines AI efficiency with human expertise.
        </ProTip>
      </>
    ),
  },
  {
    id: 'image-studio',
    icon: Image,
    title: 'AI Image Studio',
    description:
      'Create stunning visuals for social media, ads, blogs, and more.',
    content: (
      <>
        <SectionHeading>Image Types and Dimensions</SectionHeading>
        <SimpleTable
          headers={['Type', 'Dimensions', 'Use Case']}
          rows={[
            ['Instagram Post', '1080 x 1080 px', 'Square format for Instagram feed'],
            ['Facebook Ad', '1200 x 628 px', 'Landscape format for Facebook ads'],
            ['LinkedIn Banner', '1584 x 396 px', 'Wide banner for LinkedIn profiles/pages'],
            ['Blog Thumbnail', '1200 x 630 px', 'Featured image for blog posts'],
            ['Website Banner', '1920 x 600 px', 'Hero section banner for websites'],
            ['YouTube Thumbnail', '1280 x 720 px', 'Video thumbnail for YouTube'],
          ]}
        />

        <SectionHeading>How to Generate Images</SectionHeading>
        <StepList
          steps={[
            'Go to AI Image Studio from the sidebar.',
            'Select the image type (this sets the correct dimensions).',
            'Write a detailed description of what you want in the image.',
            'Choose a visual style from the options.',
            'Optionally set brand colors for consistency.',
            'Click "Generate" and wait for the image to render.',
            'Download the image or use it directly in content.',
          ]}
        />

        <SectionHeading>Style Options</SectionHeading>
        <SimpleTable
          headers={['Style', 'Description']}
          rows={[
            ['Photorealistic', 'Looks like a real photograph'],
            ['Illustration', 'Hand-drawn or digital art look'],
            ['Minimal', 'Clean, simple, lots of white space'],
            ['Abstract', 'Artistic shapes and patterns'],
            ['Corporate', 'Professional, business-appropriate'],
            ['Vibrant', 'Bold colors, eye-catching and energetic'],
          ]}
        />

        <ProTip>
          Be as descriptive as possible in your prompt. Instead of "office
          photo," try "modern open-plan office with natural light, wooden desks,
          green plants, and a team of diverse professionals collaborating around
          a whiteboard." Mention what NOT to include too.
        </ProTip>
      </>
    ),
  },
  {
    id: 'social-media',
    icon: Share2,
    title: 'Social Media Management',
    description:
      'Schedule posts, manage accounts, and track social media performance.',
    content: (
      <>
        <SectionHeading>Connecting Accounts</SectionHeading>
        <p className="text-sm text-gray-700 mb-2">
          MarketingOS supports Instagram, Facebook, LinkedIn, and Twitter/X.
          Connect accounts through Settings &gt; Integrations, or when prompted
          in the Social Media module.
        </p>
        <StepList
          steps={[
            'Click "Connect Account" and select the platform.',
            'Authorize MarketingOS to manage your account.',
            'Choose which client this account belongs to.',
            'Your account is now ready for posting and analytics.',
          ]}
        />

        <SectionHeading>Creating Posts</SectionHeading>
        <StepList
          steps={[
            'Click "Create Post" in the Social Media module.',
            'Write your content or click "AI Generate" for an AI caption.',
            'Add images or videos by uploading or selecting from Image Studio.',
            'Select which platforms to post to (multi-select supported).',
            'Choose "Post Now" for immediate publishing, or "Schedule" to pick a date and time.',
            'Review and confirm.',
          ]}
        />

        <SectionHeading>AI Caption Generator</SectionHeading>
        <p className="text-sm text-gray-700">
          Enter a topic and select a tone, and the AI will generate
          platform-optimized captions. It automatically adjusts length and style
          for each platform (e.g., shorter for Twitter, more hashtags for
          Instagram).
        </p>

        <SectionHeading>Content Calendar</SectionHeading>
        <p className="text-sm text-gray-700">
          The monthly calendar view shows all scheduled and published posts.
          Drag and drop to reschedule. Color-coded by platform for easy
          scanning. Click any post to edit or cancel.
        </p>

        <SectionHeading>Recommended Posting Frequency</SectionHeading>
        <SimpleTable
          headers={['Platform', 'Frequency', 'Best Times']}
          rows={[
            ['Instagram', '3-5 posts/week', 'Tue-Fri, 10 AM - 2 PM'],
            ['Facebook', '3-5 posts/week', 'Wed-Fri, 1 PM - 4 PM'],
            ['LinkedIn', '2-3 posts/week', 'Tue-Thu, 8 AM - 10 AM'],
            ['Twitter/X', '1-3 posts/day', 'Mon-Fri, 9 AM - 3 PM'],
          ]}
        />

        <ProTip>
          Consistency beats frequency. It is better to post 3 high-quality posts
          per week than 3 mediocre posts per day. Use the calendar to plan at
          least 2 weeks ahead.
        </ProTip>
      </>
    ),
  },
  {
    id: 'ads-manager',
    icon: Megaphone,
    title: 'Ads Manager',
    description:
      'Manage paid advertising campaigns across Google, Facebook, and LinkedIn.',
    content: (
      <>
        <SectionHeading>Supported Platforms</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li><strong>Google Ads</strong> - Search, Display, YouTube, Shopping</li>
          <li><strong>Facebook Ads</strong> - Feed, Stories, Reels, Messenger</li>
          <li><strong>LinkedIn Ads</strong> - Sponsored Content, InMail, Text Ads</li>
        </ul>

        <SectionHeading>Connecting Ad Accounts</SectionHeading>
        <StepList
          steps={[
            'Go to Settings > Integrations.',
            'Click "Connect" next to the ad platform.',
            'Sign in to your ad account and authorize access.',
            'Select the specific ad account(s) to import.',
            'Your campaigns will sync automatically.',
          ]}
        />

        <SectionHeading>Key Metrics Explained</SectionHeading>
        <SimpleTable
          headers={['Metric', 'What It Means', 'Good Benchmark']}
          rows={[
            ['Impressions', 'Number of times your ad was shown', 'Depends on budget'],
            ['Clicks', 'Number of times users clicked your ad', 'Higher is better'],
            ['CTR (Click-Through Rate)', 'Clicks / Impressions * 100', '> 2% is good'],
            ['Conversions', 'Completed desired actions (purchases, signups)', 'Depends on goals'],
            ['CPC (Cost Per Click)', 'Average cost for each click', 'Lower is better'],
            ['Cost Per Lead', 'Total spend / Number of leads', 'Varies by industry'],
            ['ROAS', 'Revenue generated / Ad spend', '> 3x is good'],
          ]}
        />

        <SectionHeading>Conversion Funnel</SectionHeading>
        <div className="flex items-center gap-2 my-3 text-sm flex-wrap">
          <Badge color="blue">Impressions</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="purple">Clicks</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="green">Conversions</Badge>
        </div>
        <p className="text-sm text-gray-700">
          Each stage narrows. If your impressions are high but clicks are low,
          improve your ad creative. If clicks are high but conversions are low,
          optimize your landing page.
        </p>

        <ProTip>
          Start with a small daily budget and scale what works. Never increase
          budget by more than 20% at a time, as sudden jumps can reset ad
          platform learning algorithms.
        </ProTip>
      </>
    ),
  },
  {
    id: 'campaigns',
    icon: Target,
    title: 'Campaign Planner',
    description:
      'Plan and manage multi-channel marketing campaigns with goals and budgets.',
    content: (
      <>
        <SectionHeading>What Is a Campaign?</SectionHeading>
        <p className="text-sm text-gray-700">
          A campaign is a coordinated, multi-channel marketing effort with
          defined goals, budget, timeline, and deliverables. It brings together
          content, ads, social posts, and SEO efforts under one umbrella for
          tracking and optimization.
        </p>

        <SectionHeading>Campaign Types</SectionHeading>
        <SimpleTable
          headers={['Type', 'Primary Channel', 'Goal']}
          rows={[
            ['SEO', 'Organic search', 'Improve rankings and organic traffic'],
            ['Content', 'Blog/website', 'Build authority and attract visitors'],
            ['Ads', 'Paid platforms', 'Drive targeted traffic and conversions'],
            ['Social', 'Social media', 'Build brand awareness and engagement'],
            ['Email', 'Email lists', 'Nurture leads and drive repeat business'],
          ]}
        />

        <SectionHeading>How to Create a Campaign</SectionHeading>
        <StepList
          steps={[
            'Go to Campaign Planner from the sidebar.',
            'Click "Create Campaign."',
            'Enter a campaign name and select the type.',
            'Set start and end dates.',
            'Define the budget allocation.',
            'Set measurable goals (e.g., 500 new leads, 10,000 visits).',
            'Select the channels and platforms involved.',
            'Add campaign components: content, ads, social posts, landing pages.',
            'Click "Launch" when ready or save as Draft.',
          ]}
        />

        <SectionHeading>Campaign Lifecycle</SectionHeading>
        <div className="flex items-center gap-2 my-3 text-sm flex-wrap">
          <Badge color="gray">Draft</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="green">Active</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="yellow">Paused</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="blue">Completed</Badge>
        </div>

        <SectionHeading>Tracking Metrics</SectionHeading>
        <p className="text-sm text-gray-700">
          Each campaign tracks budget progress (spent vs. allocated),
          impressions, clicks, conversions, and custom goal metrics. The
          progress bar shows how close you are to your targets.
        </p>

        <ProTip>
          Set SMART goals for every campaign: Specific, Measurable, Achievable,
          Relevant, and Time-bound. "Increase blog traffic by 30% in 90 days"
          is much better than "get more traffic."
        </ProTip>
      </>
    ),
  },
  {
    id: 'reports',
    icon: BarChart3,
    title: 'Reports',
    description:
      'Generate beautiful, client-ready reports with charts and insights.',
    content: (
      <>
        <SectionHeading>Report Types</SectionHeading>
        <SimpleTable
          headers={['Type', 'What It Covers']}
          rows={[
            ['SEO Report', 'Rankings, organic traffic, technical health, backlinks'],
            ['Ads Report', 'Ad spend, ROAS, conversions, top campaigns'],
            ['Content Report', 'Published content, traffic, engagement, SEO scores'],
            ['Competitor Report', 'Competitive benchmarking, keyword/content/backlink gaps'],
            ['Comprehensive', 'All of the above combined into one executive report'],
          ]}
        />

        <SectionHeading>How to Generate a Report</SectionHeading>
        <StepList
          steps={[
            'Go to Reports from the sidebar.',
            'Select a client from the dropdown.',
            'Choose the report type.',
            'Set the date range (last 7 days, 30 days, 90 days, or custom).',
            'Click "Generate Report."',
            'Review the report with executive summary, key metrics, charts, and recommendations.',
          ]}
        />

        <SectionHeading>Sharing and Scheduling</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li><strong>Download PDF:</strong> Export a beautifully formatted PDF for offline sharing.</li>
          <li><strong>Email to Client:</strong> Send the report directly to your client's inbox.</li>
          <li><strong>Schedule:</strong> Set up automated weekly or monthly reports so you never forget.</li>
        </ul>

        <ProTip>
          Schedule monthly comprehensive reports for every client. Automated
          reports save you hours and ensure clients always feel informed, even
          when you are busy.
        </ProTip>
      </>
    ),
  },
  {
    id: 'ai-assistant',
    icon: Bot,
    title: 'AI Assistant',
    description:
      'Your intelligent marketing copilot that answers questions and suggests strategies.',
    content: (
      <>
        <SectionHeading>What It Can Do</SectionHeading>
        <p className="text-sm text-gray-700">
          The AI Assistant is a conversational interface that can answer
          marketing questions, suggest strategies, analyze your data, explain
          metrics, help troubleshoot issues, and generate action plans.
        </p>

        <SectionHeading>Example Questions by Category</SectionHeading>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2">SEO Questions</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>"Why did my rankings drop this week?"</li>
          <li>"What keywords should I focus on next?"</li>
          <li>"How do I fix the Core Web Vitals issues from my audit?"</li>
        </ul>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2">Content Questions</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>"Suggest 10 blog topic ideas for a SaaS company."</li>
          <li>"How often should I publish blog posts?"</li>
          <li>"What content format works best for lead generation?"</li>
        </ul>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2">Ads Questions</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>"How can I improve my Google Ads CTR?"</li>
          <li>"What budget should I allocate for Facebook Ads?"</li>
          <li>"Why is my cost per lead so high?"</li>
        </ul>

        <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2">Strategy Questions</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>"Create a 90-day SEO action plan for my client."</li>
          <li>"What marketing channels should I prioritize with a $5,000/month budget?"</li>
          <li>"How do I measure marketing ROI?"</li>
        </ul>

        <SectionHeading>Tips for Better Responses</SectionHeading>
        <StepList
          steps={[
            'Be specific: "How do I improve my landing page conversion rate?" is better than "Help with marketing."',
            'Provide context: "My client is a B2B SaaS company selling project management tools."',
            'Select a client in the dropdown so the AI can access that client\'s data.',
            'Ask follow-up questions to go deeper into any topic.',
          ]}
        />

        <ProTip>
          Select a client before asking questions. The AI Assistant will
          reference that client's actual data (rankings, traffic, backlinks) to
          give you personalized, data-driven answers instead of generic advice.
        </ProTip>
      </>
    ),
  },
  {
    id: 'seo-by-ai',
    icon: Brain,
    title: 'SEO By AI (Atlas)',
    description:
      'Fully autonomous AI agent that manages your SEO strategy 24/7.',
    content: (
      <>
        <SectionHeading>What Is Atlas?</SectionHeading>
        <p className="text-sm text-gray-700">
          Atlas is MarketingOS's autonomous AI agent. Once enabled, it
          continuously monitors your SEO performance, identifies opportunities
          and issues, creates action plans, and can execute changes
          automatically - all without you lifting a finger.
        </p>

        <SectionHeading>How It Works</SectionHeading>
        <div className="flex items-center gap-2 my-3 text-sm flex-wrap">
          <Badge color="blue">Monitor</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="purple">Analyze</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="yellow">Plan</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="green">Execute</Badge>
          <span className="text-gray-400">&rarr;</span>
          <Badge color="blue">Learn</Badge>
        </div>
        <p className="text-sm text-gray-700">
          Atlas runs this cycle continuously, learning from results to make
          better decisions over time.
        </p>

        <SectionHeading>Action Types</SectionHeading>
        <SimpleTable
          headers={['Type', 'Description', 'Example']}
          rows={[
            ['Auto-executable', 'Atlas performs these automatically', 'Update meta descriptions, fix broken links'],
            ['Needs Approval', 'Atlas proposes these and waits for you', 'Publish new content, start ad campaigns'],
          ]}
        />

        <SectionHeading>Action Categories</SectionHeading>
        <SimpleTable
          headers={['Category', 'Examples']}
          rows={[
            ['Technical SEO', 'Fix crawl errors, optimize page speed, add schema markup'],
            ['Content', 'Create new articles, update existing content, optimize headings'],
            ['Keywords', 'Add new keywords to track, adjust targeting strategy'],
            ['Backlinks', 'Identify link opportunities, flag toxic links for disavowal'],
            ['Social', 'Schedule posts, optimize posting times'],
            ['Ads', 'Adjust bids, pause underperforming ads, suggest new campaigns'],
            ['Competitors', 'Alert to competitor changes, identify new gaps'],
            ['Reporting', 'Generate and send reports on schedule'],
          ]}
        />

        <SectionHeading>Autopilot Modes</SectionHeading>
        <SimpleTable
          headers={['Mode', 'What Atlas Can Do', 'Best For']}
          rows={[
            ['Full Auto', 'Executes all actions automatically', 'Experienced users who trust the AI'],
            ['Semi-Auto', 'Auto-executes safe actions, asks for approval on major ones', 'Most users (recommended)'],
            ['Manual Review', 'Proposes all actions but executes none without approval', 'New users learning the platform'],
          ]}
        />

        <SectionHeading>Strategy Tab</SectionHeading>
        <p className="text-sm text-gray-700">
          The Strategy tab shows Atlas's current SEO strategy: what it is
          focusing on, why, and what results it expects. It includes traffic
          and ranking forecasts with confidence intervals.
        </p>

        <SectionHeading>Chatting with Atlas</SectionHeading>
        <p className="text-sm text-gray-700 mb-2">
          You can talk directly to Atlas to ask about its strategy, current
          status, or performance. Examples:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>"Atlas, what are you working on right now?"</li>
          <li>"Why did you prioritize fixing meta descriptions?"</li>
          <li>"What results do you predict for next month?"</li>
          <li>"Pause all content creation actions."</li>
        </ul>

        <ProTip>
          Start with Semi-Auto mode to build trust. Once you see Atlas making
          good decisions consistently, switch to Full Auto for maximum
          efficiency. Review the activity log weekly to stay informed.
        </ProTip>
      </>
    ),
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Alerts & Monitoring',
    description:
      'Real-time alerts for ranking drops, backlink changes, and campaign issues.',
    content: (
      <>
        <SectionHeading>Alert Types</SectionHeading>
        <SimpleTable
          headers={['Alert', 'Trigger', 'Action to Take']}
          rows={[
            ['Ranking Drop', 'Keyword drops 5+ positions', 'Check page for issues, review competitor changes'],
            ['Backlink Loss', 'High-value backlink removed', 'Contact webmaster, find replacement links'],
            ['Traffic Drop', 'Organic traffic drops 20%+', 'Check for algorithm updates, technical issues'],
            ['Campaign Issue', 'Campaign metrics below threshold', 'Review campaign settings, adjust targeting'],
          ]}
        />

        <SectionHeading>Severity Levels</SectionHeading>
        <div className="space-y-2 my-3">
          <div className="flex items-center gap-2">
            <Badge color="red">Critical</Badge>
            <span className="text-sm text-gray-600">Requires immediate attention. Significant impact on performance.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="yellow">Warning</Badge>
            <span className="text-sm text-gray-600">Should be addressed soon. May worsen if ignored.</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="blue">Info</Badge>
            <span className="text-sm text-gray-600">For your awareness. No immediate action needed.</span>
          </div>
        </div>

        <SectionHeading>Managing Alerts</SectionHeading>
        <StepList
          steps={[
            'Review new alerts in the Alerts page or the notification bell in the header.',
            'Click an alert to see full details and recommended actions.',
            'Mark as read or take action directly from the alert card.',
            'Configure alert thresholds in Settings > Notifications.',
          ]}
        />

        <SectionHeading>Notification Channels</SectionHeading>
        <SimpleTable
          headers={['Channel', 'Best For']}
          rows={[
            ['In-App', 'Always on - see alerts when you log in'],
            ['Email', 'Daily digests or real-time critical alerts'],
            ['Slack', 'Team notifications in your workspace channel'],
          ]}
        />

        <SectionHeading>Alert Frequency Options</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li><strong>Real-time:</strong> Get notified instantly (recommended for critical alerts)</li>
          <li><strong>Hourly:</strong> Batched summary every hour</li>
          <li><strong>Daily Digest:</strong> One summary email per day (recommended for info alerts)</li>
        </ul>

        <ProTip>
          Set critical alerts to real-time and info alerts to daily digest.
          This way, you are notified immediately when something important
          happens without being overwhelmed by minor updates.
        </ProTip>
      </>
    ),
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'Settings',
    description:
      'Configure your profile, agency, integrations, notifications, and API keys.',
    content: (
      <>
        <SectionHeading>Profile Settings</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li><strong>Name:</strong> Your display name across the platform.</li>
          <li><strong>Email:</strong> Used for login and notifications.</li>
          <li><strong>Password:</strong> Change your password (must be 8+ characters with a mix of letters, numbers, and symbols).</li>
        </ul>

        <SectionHeading>Agency Settings</SectionHeading>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 my-3">
          <li><strong>Agency Name:</strong> Appears on reports and client-facing materials.</li>
          <li><strong>Logo:</strong> Upload your logo for white-label reports.</li>
          <li><strong>Subscription Plan:</strong> View and manage your current plan and billing.</li>
        </ul>

        <SectionHeading>Integrations</SectionHeading>
        <SimpleTable
          headers={['Integration', 'What It Connects', 'What It Enables']}
          rows={[
            ['Google Ads', 'Your Google Ads account', 'Import campaigns, track ad performance'],
            ['Facebook Ads', 'Your Facebook Business account', 'Import campaigns, track ad performance'],
            ['LinkedIn Ads', 'Your LinkedIn Campaign Manager', 'Import campaigns, track ad performance'],
            ['Google Analytics', 'Your GA4 property', 'Import traffic data, user behavior analytics'],
            ['Search Console', 'Your GSC property', 'Import search performance, indexing data'],
          ]}
        />

        <SectionHeading>Notification Preferences</SectionHeading>
        <p className="text-sm text-gray-700">
          Configure which alert types you receive, through which channels
          (email, Slack, in-app), and at what frequency. You can set different
          preferences for each severity level.
        </p>

        <SectionHeading>API Keys</SectionHeading>
        <StepList
          steps={[
            'Go to Settings > API Keys.',
            'Click "Generate New Key."',
            'Give the key a descriptive name (e.g., "Zapier Integration").',
            'Copy the key immediately - it will not be shown again.',
            'Use the key in the Authorization header: Bearer YOUR_API_KEY.',
          ]}
        />

        <ProTip>
          Connect Google Search Console and Google Analytics first - they
          provide the most valuable data for SEO tracking and are completely
          free to use.
        </ProTip>
      </>
    ),
  },
  {
    id: 'glossary',
    icon: BookOpen,
    title: 'SEO Glossary',
    description:
      'Essential SEO and digital marketing terms explained in plain English.',
    content: (
      <>
        <p className="text-sm text-gray-700 mb-4">
          A comprehensive reference of SEO and digital marketing terms. Bookmark
          this page and come back whenever you encounter an unfamiliar term.
        </p>
        <div className="space-y-3">
          {[
            ['A/B Testing', 'Comparing two versions of a page or ad to see which performs better. Half your visitors see version A, half see version B, and you pick the winner.'],
            ['Alt Text', 'A text description added to images that helps search engines understand what the image shows and improves accessibility for visually impaired users.'],
            ['Anchor Text', 'The clickable text in a hyperlink. Descriptive anchor text helps search engines understand what the linked page is about.'],
            ['Backlink', 'A link from another website to yours. Each quality backlink acts as a vote of confidence in Google\'s eyes.'],
            ['Bounce Rate', 'The percentage of visitors who leave your site after viewing only one page. Lower is generally better.'],
            ['Canonical URL', 'The preferred version of a page when multiple URLs have similar content. Prevents duplicate content issues.'],
            ['Click-Through Rate (CTR)', 'The percentage of people who click your link after seeing it in search results. Calculated as Clicks / Impressions * 100.'],
            ['Content Gap', 'Topics or keywords that your competitors cover but you do not. Filling content gaps is a key growth strategy.'],
            ['Conversion', 'When a visitor completes a desired action: purchasing a product, signing up for a newsletter, filling out a form, etc.'],
            ['Core Web Vitals', 'Google\'s metrics for measuring page experience: loading speed (LCP), interactivity (FID), and visual stability (CLS).'],
            ['Cost Per Click (CPC)', 'The average amount you pay each time someone clicks your ad. Varies by keyword competitiveness.'],
            ['Crawl', 'When search engine bots visit and scan your website to discover and index your pages.'],
            ['Domain Authority (DA)', 'A score from 0-100 predicting how likely a website is to rank in search results. Higher is better. Developed by Moz.'],
            ['Dofollow', 'A type of link that passes SEO value (link juice) to the linked page. The default link type unless specified otherwise.'],
            ['E-E-A-T', 'Experience, Expertise, Authoritativeness, Trustworthiness. Google\'s quality criteria for evaluating content creators and websites.'],
            ['Featured Snippet', 'A highlighted answer box at the top of Google search results. Getting your content here means maximum visibility.'],
            ['Google Algorithm', 'The complex system Google uses to retrieve and rank pages from its index. Updated thousands of times per year.'],
            ['H1 Tag', 'The main heading of a page in HTML. Each page should have exactly one H1 that clearly describes the page content.'],
            ['Impressions', 'The number of times your page or ad appeared in search results or on a platform, regardless of whether it was clicked.'],
            ['Indexing', 'The process by which search engines store and organize web pages so they can be retrieved for relevant searches.'],
            ['Internal Link', 'A link from one page on your website to another page on the same website. Helps distribute page authority and aids navigation.'],
            ['Keyword', 'A word or phrase that people type into search engines. Your content targets specific keywords to attract relevant visitors.'],
            ['Keyword Difficulty', 'A score (0-100) indicating how hard it is to rank on the first page for a particular keyword. Higher means more competition.'],
            ['Landing Page', 'A standalone web page designed for a specific marketing campaign, optimized to convert visitors into leads or customers.'],
            ['Link Building', 'The process of getting other websites to link to yours. Strategies include guest posting, content marketing, and outreach.'],
            ['Long-tail Keyword', 'A longer, more specific search phrase (3+ words). Lower search volume but higher conversion rates and less competition.'],
            ['Meta Description', 'A brief summary (150-160 characters) of a page\'s content that appears under the title in search results. Influences CTR.'],
            ['Meta Title', 'The title of a page as it appears in search results and browser tabs. Should be 50-60 characters and include the target keyword.'],
            ['Nofollow', 'A link attribute that tells search engines not to pass ranking value to the linked page. Used for ads, user-generated content, etc.'],
            ['Organic Traffic', 'Visitors who find your website through unpaid search results, as opposed to paid ads, social media, or direct visits.'],
            ['Page Authority', 'A score (0-100) predicting how well a specific page will rank. Similar to Domain Authority but for individual pages.'],
            ['People Also Ask', 'A Google SERP feature showing related questions that users commonly search for. Great source for content ideas.'],
            ['Position/Ranking', 'Where your page appears in search results for a given keyword. Position 1 is the top result.'],
            ['Referring Domain', 'A unique website that links to yours. 10 links from 10 different domains is more valuable than 10 links from 1 domain.'],
            ['ROAS', 'Return on Ad Spend. Revenue generated divided by ad spend. A ROAS of 3x means you earn $3 for every $1 spent on ads.'],
            ['Schema Markup', 'Structured data code added to pages that helps search engines understand your content and can trigger rich results.'],
            ['Search Volume', 'The average number of times a keyword is searched per month. Higher volume means more potential traffic.'],
            ['SERP', 'Search Engine Results Page. The page you see after entering a query into Google.'],
            ['SERP Features', 'Special result types beyond regular blue links: featured snippets, image packs, video carousels, knowledge panels, etc.'],
            ['Sitemap', 'An XML file listing all pages on your website, helping search engines discover and crawl your content efficiently.'],
            ['Spam Score', 'A metric (0-100%) indicating how likely a site or link is to be penalized by search engines. Higher is worse.'],
            ['Technical SEO', 'Optimizations to your website\'s infrastructure (speed, crawlability, mobile-friendliness, security) that help search engines access and index your content.'],
            ['Title Tag', 'Same as Meta Title. The HTML element that specifies the title of a web page, displayed in search results and browser tabs.'],
          ].map(([term, definition]) => (
            <div key={term} className="border-b border-gray-100 pb-3">
              <dt className="text-sm font-semibold text-gray-900">{term}</dt>
              <dd className="text-sm text-gray-600 mt-0.5">{definition}</dd>
            </div>
          ))}
        </div>

        <ProTip>
          Bookmark this glossary and revisit it whenever you encounter an
          unfamiliar term elsewhere in the platform. Understanding these
          concepts is the foundation of effective SEO.
        </ProTip>
      </>
    ),
  },
]

// ---------------------------------------------------------------------------
// Main Documentation Component
// ---------------------------------------------------------------------------

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const moduleRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle scroll - show/hide back to top and track active section
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Determine active section
      const entries = Object.entries(moduleRefs.current)
      for (let i = entries.length - 1; i >= 0; i--) {
        const [id, el] = entries[i]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const scrollToModule = (id: string) => {
    const el = moduleRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setExpandedModules((prev) => new Set(prev).add(id))
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter modules based on search
  const filteredModules = modules.filter((m) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    )
  })

  // Quick start steps
  const quickStartSteps = [
    {
      step: 1,
      title: 'Add Your First Client',
      description: 'Click Clients > Add Client > Enter company details',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: 2,
      title: 'Run an SEO Audit',
      description: 'Go to SEO Audit > Select client > Run audit',
      icon: Search,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      step: 3,
      title: 'Track Keywords',
      description: 'Go to Keywords > Add keywords you want to rank for',
      icon: Key,
      color: 'from-purple-500 to-purple-600',
    },
    {
      step: 4,
      title: 'Enable AI Autopilot',
      description: 'Go to SEO By AI > Enable Atlas to manage everything',
      icon: Brain,
      color: 'from-amber-500 to-amber-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-200" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Everything you need to know to master MarketingOS
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ---------------------------------------------------------------- */}
        {/* Quick Start Guide                                                 */}
        {/* ---------------------------------------------------------------- */}
        {!searchQuery && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Quick Start Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Get up and running in 4 steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickStartSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Main Content Area with Sidebar                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex gap-8">
          {/* Sidebar - Table of Contents (desktop only) */}
          {!searchQuery && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Table of Contents
                </h3>
                <nav className="space-y-0.5">
                  {modules.map((m) => {
                    const Icon = m.icon
                    return (
                      <button
                        key={m.id}
                        onClick={() => scrollToModule(m.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          activeSection === m.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* Module Documentation Cards */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {searchQuery
                    ? `Search Results (${filteredModules.length})`
                    : 'Module Documentation'}
                </h2>
                {!searchQuery && (
                  <p className="text-gray-500 mt-2">
                    Click any module to expand its full documentation
                  </p>
                )}
              </div>

              {filteredModules.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">
                    No results found
                  </h3>
                  <p className="text-sm text-gray-400">
                    Try searching with different keywords
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {filteredModules.map((m) => {
                  const Icon = m.icon
                  const isExpanded = expandedModules.has(m.id)
                  return (
                    <div
                      key={m.id}
                      ref={(el) => {
                        moduleRefs.current[m.id] = el
                      }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors scroll-mt-8"
                    >
                      {/* Card Header */}
                      <button
                        onClick={() => toggleModule(m.id)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-gray-900">
                            {m.title}
                          </h2>
                          <p className="text-sm text-gray-500 truncate">
                            {m.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-gray-400">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-5 pb-6 border-t border-gray-100">
                          <div className="pt-4 max-w-none">{m.content}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Back to Top Button                                                  */}
      {/* ------------------------------------------------------------------ */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default Documentation
