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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="header">
          <div className="profile-photo"></div>
          <h1>Hi, I&apos;m Brennan.</h1>
          <p className="tagline">I build innovative digital products people love.</p>
          <div className="center-divider"></div>
        </header>
        <div className="section">
          <p>
            I make things: valuable software crafted by small empowered teams. I work best with a
            small crew, digging in with the business to find the one lever that can move a mountain.
            For me, success isn&apos;t just shipping a quality product—it&apos;s creating small
            empowered teams that continue to deliver value every day.
          </p>
          <div className="center-divider"></div>
          <h3 className="subsection">Currently: Consulting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <i>Latest photos</i>
              <PhotoCard post={photos[0]} shouldHideText priority />
            </div>
            <div>
              <i>Latest writing</i>
              <PostCard post={vbcPosts[0]} />
            </div>
          </div>
          <div className="center-divider" id="work"></div>
          <h2 className="heading">Work</h2>
          <div className="divider"></div>
          <time className="text-muted-foreground">2022-2025</time>
          <h3 className="subsection">
            <a href="https://www.firsthandcares.com">firsthand cares</a>
          </h3>
          <p>
            As CTO at Firsthand, I led the technology organization across Product, Software, Data,
            IT, and Security, scaling the team from 3 to 25 while supporting rapid physical
            expansion across 28 offices. My primary focus was architecting helpinghand, our
            proprietary AI-powered care management tool, and securing HITRUST r2 certification under
            strict deadlines.
          </p>
          <p>
            I am most proud of the culture we built. I restructured the organization into small,
            empowered teams focused on specific business verticals, driven by the mantra to
            &quot;deliver value every day.&quot; By prioritizing deep collaboration—including
            frequent market visits and integration with L&amp;D—we broke the traditional silo where
            tech is viewed merely as &quot;IT support.&quot; Instead, we operated as strategic
            partners, resulting in high product adoption, a data-driven operational culture, and
            remarkable efficiency.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2022-2026</time>
          <h3 className="subsection">
            <a href="https://www.kelp.nyc/">Kelp</a>
          </h3>
          <p>
            I founded Kelp to solve a complex problem: to filter our ocean of information down to
            just what you need right now.
          </p>
          <p>
            My initial version was focused on contextual information retrieval such as surfacing a
            website recommended by a person in your next meeting with them. I created the Chrome
            Extension and setup integrations across the major workplace platforms with a dedicated
            customer base. The process of taking Kelp to market provided a crucial insight: true
            contextual awareness is nearly impossible without deep, OS-level integration. This
            analysis led to my decision to pause the that iteration and open source that project.
          </p>
          <p>
            The second iteration is focused on helping executives stay up to date on an increasingly
            vast landscape of industry, technology and cultural shifts. It crawls a curated lists of
            high quality sources, derives facts, entities and structure that allows executives to
            efficiently maintain their expertise.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2017-2021</time>
          <h3 className="subsection">
            <a href="https://www.cityblock.com/">Cityblock Health</a>
          </h3>
          <p>
            As a founding member of the Cityblock Health team, I was instrumental in its incubation
            and launch from within Alphabet&apos;s Sidewalk Labs. I focused on building the core
            data and software technology foundation. This included implementing data-sharing
            partnerships with payers, architecting our custom analytics infrastructure, and
            spearheading the development of Commons—Cityblock&apos;s proprietary care management
            platform that became essential for our care teams.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2015</time>
          <h3 className="subsection">
            <a href="https://www.motivateco.com/">Motivate</a>
          </h3>
          <p>
            As the engineering lead at Motivate, I was responsible for the software powering bike
            share systems in 10 cities, including New York&apos;s Citi Bike. I led the initiative to
            achieve PCI compliance for our payment platform. I directed both in-house and contractor
            development teams to deliver projects that directly impacted the bottom line, from
            strategic billing optimizations (cardrefresher) that increased revenue, data science
            efforts and efficient marketing tools that could be shared across all operations.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2011-2014</time>
          <h3 className="subsection">
            <a href="https://artsy.net/">Artsy</a>
          </h3>
          <p>
            As the tech-lead manager for Artsy&apos;s web engineering team, I led the group
            responsible for our public website&apos;s performance and architecture. During my
            tenure, I directed several transformative technical projects, including the initial
            open-sourcing of our well-regarded frontend and a strategic migration to an in-house
            isomorphic application that dramatically improved our SEO. Perhaps most impactfully, my
            team developed the custom software for live auctions and art fairs—products that are now
            cornerstones of Artsy&apos;s business.
          </p>
        </div>
        <div className="homepage-section" id="writing">
          <h2 className="heading">Writing</h2>
          <div className="divider"></div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="homepage-section" id="vbc">
          <h2 className="heading">{VBC_TITLE}</h2>
          <p>{VBC_DESCRIPTION}</p>
          <div className="divider"></div>
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
        <div className="homepage-section" id="photography">
          <h2 className="heading">Photography</h2>
          <div className="divider"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photos.map((post) => (
              <PhotoCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="homepage-section" id="publications">
          <h2 className="heading">Publications</h2>
          <div className="divider"></div>
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
      </article>
    </>
  );
}
