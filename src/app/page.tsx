import {
  getPhotosFromCache,
  getAllSectionPostsFromCache,
  getVBCSectionPostsPostsFromCache,
} from '@/lib/notion';
import PostCard from '@/components/post-card';
import PhotoCard from '@/components/photo-card';

export default function Home() {
  const posts = getAllSectionPostsFromCache();
  const photos = getPhotosFromCache();

  return (
    <article>
      <header className="header">
        <div className="profilePhoto"></div>
        <h2>Hi, I&apos;m Brennan.</h2>
        <h3>I build innovative digital products people love.</h3>
        <div className="centerDivider"></div>
      </header>
      <div className="section" id="companies">
        <p>
          I see engineering as a creative craft. Whether my canvas is healthcare, art, or
          e-commerce, I build beauty by creating elegant solutions for complex problems. I work best
          with a small crew, digging in with the business to find the one lever that can move a
          mountain. For me, success isn&apos;t just shipping a quality product—it&apos;s creating
          small empowered teams that grow the business.
        </p>
        <div className="centerDivider"></div>
        <time className="text-muted-foreground">2022-2025</time>
        <h4 style={{ marginTop: 0 }}>
          <a href="https://www.firsthandcares.com">firsthand cares</a>
        </h4>
        <p>
          As CTO at firsthand, I led the technology organization through a period of critical
          transformation and growth. I scaled the team from 3 to 25 professionals across all tech
          functions, creating the capacity to meet our ambitious goals. A cornerstone of my tenure
          was achieving the rigorous HITRUST r2 Certification, which fortified our security program
          and became a key enabler for major business partnerships.
        </p>
        <p>
          On the product front, I initiated and oversaw the creation of helpinghand, our
          proprietary, AI-powered care management tool now essential to our care teams&apos;
          success. To drive these results, I restructured our organization into small, empowered
          teams focused on business verticals, fostering a culture of ownership that directly
          accelerated our ability to deliver value.
        </p>
        <div className="centerDivider"></div>
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
        <div className="centerDivider"></div>
        <time className="text-muted-foreground">2017-2021</time>
        <h4 style={{ marginTop: 0 }}>
          <a href="https://www.cityblock.com/">Cityblock Health</a>
        </h4>
        <p>
          As a founding member of the Cityblock Health team, I was instrumental in its incubation
          and launch from within Alphabet&apos;s Sidewalk Labs. My leadership focused on building
          the core data and software technology foundation. This included implementing pivotal
          data-sharing partnerships with payers, architecting our custom analytics infrastructure,
          and spearheading the development of Commons—Cityblock&apos;s proprietary care management
          platform that became essential for our care teams.
        </p>
        <div className="centerDivider"></div>
        <time className="text-muted-foreground">2015</time>
        <h4 style={{ marginTop: 0 }}>
          <a href="https://www.motivateco.com/">Motivate</a>
        </h4>
        <p>
          As the engineering lead at Motivate, I was responsible for the software powering bike
          share systems in 10 cities, including New York&apos;s Citi Bike. I spearheaded the
          critical, company-first initiative to achieve PCI compliance for our payment platform. My
          role also involved directing both in-house and contractor development teams to deliver
          projects that directly impacted the bottom line, from strategic billing optimizations that
          increased revenue to new digital tools supporting our multi-city marketing efforts.
        </p>
        <div className="centerDivider"></div>
        <time className="text-muted-foreground">2011-2014</time>
        <h4 style={{ marginTop: 0 }}>
          <a href="https://artsy.net/">Artsy</a>
        </h4>
        <p>
          As the tech-lead manager for Artsy&apos;s web engineering team, I led the group
          responsible for our public website&apos;s performance and architecture. During my tenure,
          I directed several transformative technical projects, including the initial open-sourcing
          of our well-regarded frontend and a strategic migration to an in-house isomorphic
          application that dramatically improved our SEO. Perhaps most impactfully, my team
          developed the custom software for live auctions and art fairs—products that are now
          cornerstones of Artsy&apos;s business.
        </p>
      </div>
      <div className="" id="writing">
        <h2 className="heading">Writing</h2>
        <div className="divider"></div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
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
              sites as sensor streams, integrating information from such feeds into a simple unified
              RDF world model representing people, places and things and their timevarying states
              and activities. Combined with other information sources on the web, including the
              user&apos;s online calendar, web-based e-mail client, news feeds and messaging
              services, Atomate can be made to automatically carry out a variety of simple tasks for
              the user, ranging from context-aware filtering and messaging, to sharing and social
              coordination actions.
            </p>
          </li>
        </ul>
      </div>
    </article>
  );
}
