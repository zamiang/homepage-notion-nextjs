import { VBC_DESCRIPTION, VBC_TITLE } from '@/components/consts';
import PhotoCard from '@/components/photo-card';
import PostCard from '@/components/post-card';
import SeriesPostCard from '@/components/series-post-card';
import { config } from '@/lib/config';
import {
  getAllSectionPostsFromCache,
  getPhotosFromCache,
  getVBCSectionPostsPostsFromCache,
} from '@/lib/notion';

export default function Home() {
  const posts = getAllSectionPostsFromCache();
  const photos = getPhotosFromCache();
  const vbcPosts = getVBCSectionPostsPostsFromCache().sort((a, b) => (a.title > b.title ? 1 : -1));

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
          <h2>Hi, I&apos;m Brennan.</h2>
          <h3>I build innovative digital products people love.</h3>
          <div className="center-divider"></div>
        </header>
        <div className="section">
          <p>
            I see engineering as a creative craft. Whether my canvas is healthcare, art, or
            e-commerce, I build beauty by creating elegant solutions for complex problems. I work
            best with a small crew, digging in with the business to find the one lever that can move
            a mountain. For me, success isn&apos;t just shipping a quality product—it&apos;s
            creating small empowered teams that grow the business.
          </p>
          <div className="center-divider"></div>
          <h4 style={{ marginTop: 0 }}>Currently: Consulting</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <i>Latest photos</i>
              <PhotoCard post={photos[0]} shouldHideText />
            </div>
            <div>
              <i>Latest writing</i>
              <PostCard post={vbcPosts[0]} />
            </div>
          </div>
          <div className="center-divider" id="work"></div>
          <h2 className="heading">Work</h2>
          <div className="divider"></div>
          <br />
          <time className="text-muted-foreground">2022-2025</time>
          <h4 style={{ marginTop: 0 }}>
            <a href="https://www.firsthandcares.com">firsthand cares</a>
          </h4>
          <p>
            As CTO at firsthand, I grew the tech team from 3 to 25 people so we could handle larger
            projects and more payer integrations. I led the effort to get our HITRUST r2
            Certification. This improved our security and helped us land major business partners.
          </p>
          <p>
            I also led the creation of helpinghand. It&apos;s our own AI-enabled care management
            tool that our care teams now use every day. I led partnerships and development efforts
            that deeply integrated that tool with multiple EHRs, claims data sources and common
            healthcare data feeds. To drive these results, I restructured our organization into
            small, empowered teams focused on business verticals, fostering a culture of ownership
            that accelerated our ability to deliver value.
          </p>
          <div className="center-divider"></div>
          <p>2022</p>
          <h4 style={{ marginTop: 0 }}>
            <a href="https://kelp.nyc/">Kelp</a>
          </h4>
          <p>
            I founded Kelp to solve a complex problem: getting people the right information at the
            right time. As a solo founder, I independently designed, built, and launched the
            contextual recommendation tool, engineering integrations across multiple workplace
            platforms. The process of taking Kelp to market provided a crucial insight: true
            contextual awareness is nearly impossible without deep, OS-level integration. This
            analysis led to my strategic decision to pause the project and share my work,
            open-sourcing the codebase and publishing my findings on the future of contextual
            computing.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2017-2021</time>
          <h4 style={{ marginTop: 0 }}>
            <a href="https://www.cityblock.com/">Cityblock Health</a>
          </h4>
          <p>
            I was a founding team member at Cityblock Health, which started at Alphabet&apos;s
            Sidewalk Labs. I focused on building the company&apos;s main software systems. This
            included setting up data sharing agreements with payers and deep EHR integrations
            including custom Chrome extensions. I also led the development of Commons, our own care
            management software and our tooling to integrate our data insights into that care
            management tool.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2015</time>
          <h4 style={{ marginTop: 0 }}>
            <a href="https://www.motivateco.com/">Motivate</a>
          </h4>
          <p>
            At Motivate, I was the engineering lead for the software that ran bike share systems in
            10 cities, including New York&apos;s Citi Bike. I led the company&apos;s first project
            to make our payment platform PCI compliant. I managed our developers and contractors to
            complete projects that helped the business. We worked on things like improving the
            billing system to increase revenue and building new marketing tools.
          </p>
          <div className="center-divider"></div>
          <time className="text-muted-foreground">2011-2014</time>
          <h4 style={{ marginTop: 0 }}>
            <a href="https://artsy.net/">Artsy</a>
          </h4>
          <p>
            I was the tech lead manager for the web engineering team at Artsy. My team handled the
            public website&apos;s architecture and performance. I led several major technical
            projects. We open sourced our frontend code and moved to an in-house isomorphic
            framework that improved our SEO. My team also built the software for live auctions and
            art fairs, which became important products for Artsy&apos;s business.
          </p>
        </div>
        <div className="" id="writing">
          <h2 className="heading">Writing</h2>
          <div className="divider"></div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="" id="vbc">
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
          <div className={['post', 'future-post'].join(' ')}>
            <div className="next-button">September 2025</div>
            <h4 style={{ marginTop: 0 }}>
              The wide business: VBC through the lens of operations research
            </h4>
          </div>
        </div>
        <div className="" id="photography">
          <h2 className="heading">Photography</h2>
          <div className="divider"></div>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photos.map((post) => (
              <PhotoCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="gap-8" id="publications">
          <h2 className="heading">Publications</h2>
          <div className="divider"></div>
          <br />
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
