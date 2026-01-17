import { VBC_DESCRIPTION, VBC_TITLE } from '@/components/consts';
import PhotoCard from '@/components/photo-card';
import PostCard from '@/components/post-card';
import SeriesPostCard from '@/components/series-post-card';
import { config } from '@/lib/config';
import {
  getAllSectionPostsFromCache,
  getPhotosFromCache,
  getVBCSectionPostsFromCache,
} from '@/lib/notion';
import Image from 'next/image';

export default function Home() {
  const posts = getAllSectionPostsFromCache();
  const photos = getPhotosFromCache();
  const vbcPosts = getVBCSectionPostsFromCache().sort((a, b) => (a.title > b.title ? 1 : -1));

  const siteUrl = config.site.url;

  // Schema.org JSON-LD for homepage (Person + Blog)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Brennan Moore',
        url: siteUrl,
        image: `${siteUrl}/about.jpg`,
        jobTitle: 'CTO / Engineering Leader',
        description:
          'I see engineering as a creative craft. I build innovative digital products by creating elegant solutions for complex problems.',
        sameAs: [],
      },
      {
        '@type': 'Blog',
        '@id': `${siteUrl}/#blog`,
        name: config.site.title,
        description: config.site.description,
        url: siteUrl,
        author: {
          '@id': `${siteUrl}/#person`,
        },
        blogPost: posts.slice(0, 5).map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${siteUrl}/writing/${post.slug}`,
          headline: post.title,
          datePublished: new Date(post.date).toISOString(),
        })),
      },
    ],
  };

  return (
    <div className="homepage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero & About Section */}
      <article>
        <header className="header">
          <div className="profile-photo-container w-44 h-44 mx-auto rounded-full overflow-hidden mb-5">
            <Image
              src="/about.jpg"
              alt="Brennan Moore - Engineering Leader and CTO"
              width={176}
              height={176}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <p className="section-label">Engineering Leader &amp; Builder</p>
          <h1 className="section-heading section-heading--hero">Hi, I&apos;m Brennan.</h1>
          <p className="section-subtitle section-subtitle--constrained">
            I build innovative digital products people love.
          </p>
        </header>
        <div className="section">
          <p>
            I work best with a small crew, digging in with the business to find the one lever that
            can move a mountain. For me, success isn&apos;t just shipping a quality
            product—it&apos;s creating small empowered teams that continue to deliver value every
            day.
          </p>
          <div className="section-rule"></div>
          <p className="section-label">Currently</p>
          <h3 className="section-heading section-heading--subsection">Consulting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="section-label section-label--tight">Latest photos</p>
              <PhotoCard post={photos[0]} shouldHideText priority />
            </div>
            <div>
              <p className="section-label section-label--tight">Latest writing</p>
              <PostCard post={vbcPosts[0]} />
            </div>
          </div>

          {/* Work Section */}
          <div className="section-rule" id="work"></div>
          <p className="section-label">Career Journey</p>
          <h2 className="section-heading">Work</h2>
          <p className="section-subtitle">
            Building technology teams and products that make a difference.
          </p>

          {/* Work Item: Firsthand */}
          <div className="work-card">
            <div className="work-card-header">
              <time className="work-card-date" dateTime="2022/2025">
                2022–2025
              </time>
              <span className="work-card-role">CTO</span>
            </div>
            <h3 className="work-card-title">
              <a href="https://www.firsthandcares.com">Firsthand</a>
            </h3>
            <p className="work-card-description">
              Led the technology organization across Product, Software, Data, IT, and Security,
              scaling the team from 3 to 25 while supporting rapid physical expansion across 28
              offices. Architected helpinghand, our proprietary AI-powered care management tool, and
              secured HITRUST r2 certification under strict deadlines.
            </p>
          </div>

          {/* Work Item: Kelp */}
          <div className="work-card">
            <div className="work-card-header">
              <time className="work-card-date" dateTime="2022/2026">
                2022–2026
              </time>
              <span className="work-card-role">Founder</span>
            </div>
            <h3 className="work-card-title">
              <a href="https://www.kelp.nyc/">Kelp</a>
            </h3>
            <p className="work-card-description">
              Founded Kelp to filter our ocean of information down to just what you need right now.
              Built a Chrome Extension with integrations across major workplace platforms. Now it is
              an AI assistant focused on helping executives stay current on industry, technology,
              and cultural shifts.
            </p>
            <a href="https://www.kelp.nyc/" className="cta-button mt-4">
              Try Kelp
            </a>
          </div>

          {/* Work Item: Cityblock Health */}
          <div className="work-card">
            <div className="work-card-header">
              <time className="work-card-date" dateTime="2017/2021">
                2017–2021
              </time>
              <span className="work-card-role">Founding Engineer</span>
            </div>
            <h3 className="work-card-title">
              <a href="https://www.cityblock.com/">Cityblock Health</a>
            </h3>
            <p className="work-card-description">
              As the 3rd team member, I was instrumental in incubating and launching Cityblock from
              within Alphabet&apos;s Sidewalk Labs. My team built the core data and software
              technology foundation, including data-sharing partnerships with payers and Commons—the
              proprietary care management platform.
            </p>
          </div>

          {/* Work Item: Motivate */}
          <div className="work-card">
            <div className="work-card-header">
              <time className="work-card-date" dateTime="2009/2015">
                2009–2015
              </time>
              <span className="work-card-role">Lots of projects</span>
            </div>
            <h3 className="work-card-title">
              <a href="https://www.linkedin.com/in/brennan-moore/">More on LinkedIn</a>
            </h3>
            <p className="work-card-description">
              Many past projects such as leading Artsy.net&apos;s public web presense and auctions,
              Motivate (Citi Bike), HCI research at MIT CSAIL and working at the MIT Media lab on
              visualizations for Ars Electronica.
            </p>
          </div>
        </div>
      </article>

      {/* Writing Section - Warm background */}
      <section className="section-wrapper section-wrapper--warm" id="writing">
        <div className="section-wrapper-inner">
          <p className="section-label">Thoughts &amp; Reflections</p>
          <h2 className="section-heading">Writing</h2>
          <p className="section-subtitle">
            Essays on engineering leadership, startups, and building teams.
          </p>
          <div className="section-rule"></div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* VBC Section - Accent background */}
      <section className="section-wrapper section-wrapper--accent" id="vbc">
        <div className="section-wrapper-inner">
          <p className="section-label">VBC Deep Dive</p>
          <h2 className="section-heading">{VBC_TITLE}</h2>
          <p className="section-subtitle">{VBC_DESCRIPTION}</p>
          <div className="section-rule"></div>
          {vbcPosts.map((post) => (
            <SeriesPostCard
              key={post.id}
              post={post}
              isPast={false}
              isCurrent={false}
              isNext={false}
            />
          ))}
        </div>
      </section>

      {/* Photography Section - Muted background */}
      <section className="section-wrapper section-wrapper--muted" id="photography">
        <div className="section-wrapper-inner">
          <p className="section-label">Visual Stories</p>
          <h2 className="section-heading">Photography</h2>
          <p className="section-subtitle">Capturing moments from travels and everyday life.</p>
          <div className="section-rule"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photos.map((post) => (
              <PhotoCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section - Warm background */}
      <section className="section-wrapper section-wrapper--warm" id="publications">
        <div className="section-wrapper-inner">
          <p className="section-label">Academic Research</p>
          <h2 className="section-heading">Publications</h2>
          <p className="section-subtitle">
            Peer-reviewed work on personal informatics and automation.
          </p>
          <div className="section-rule"></div>
          <ul>
            <li>
              <h4>
                <a href="https://v1.personalinformatics.org/docs/chi2010/moore_assisted_self_reflection.pdf">
                  Assisted Self Reflection: Combining Lifetracking, Sensemaking, & Personal
                  Information Management
                </a>
              </h4>
              <p>
                <i>Brennan Moore, Max Van Kleek, David R. Karger, mc schraefel</i>
              </p>
              <p>
                In this paper, we present an ongoing project designed to make self-reflection an
                integral part of daily personal information management activity, and to provide
                facilities for fostering greater self-understanding through exploration of captured
                personal activity logs.
              </p>
            </li>
            <li>
              <h4>
                <a href="https://dl.acm.org/doi/10.1145/1772690.1772787">
                  Atomate it! end-user context-sensitive automation using heterogeneous information
                  sources on the web
                </a>
              </h4>
              <p>
                <i>Max Van Kleek, Brennan Moore, David R Karger, Paul André, M C Schraefe</i>
              </p>
              <p>
                Our system, Atomate, treats RSS/ATOM feeds from social networking and life-tracking
                sites as sensor streams, integrating information from such feeds into a simple
                unified RDF world model representing people, places and things and their timevarying
                states and activities. Combined with other information sources on the web, including
                the user&apos;s online calendar, web-based e-mail client, news feeds and messaging
                services, Atomate can be made to automatically carry out a variety of simple tasks
                for the user, ranging from context-aware filtering and messaging, to sharing and
                social coordination actions.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
