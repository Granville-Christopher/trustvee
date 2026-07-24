import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardCheck,
  FaClipboardList,
  FaGift,
  FaInfoCircle,
  FaLock,
  FaMobileAlt,
  FaShieldAlt,
  FaUserFriends,
  FaUserPlus,
  FaWallet,
} from "react-icons/fa";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { dailyClaim, formatNaira, packages } from "../data/packages";
import "swiper/css";
import "swiper/css/pagination";
import "./HomePage.css";

const ease = [0.22, 1, 0.36, 1] as const;

const slideLeft = {
  hidden: { opacity: 0, x: -72 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.75,
      ease,
    },
  }),
};

const viewportOnce = { once: true, amount: 0.25 };

const highlights = [
  {
    icon: <FaClipboardCheck />,
    title: "Daily tasks",
    text: "A short checklist every day. Finish it, unlock your claim.",
  },
  {
    icon: <FaWallet />,
    title: "Clear daily claims",
    text: "Month-end return ÷ 30. Same math. No surprises.",
  },
  {
    icon: <FaGift />,
    title: "10% referral bonus",
    text: "When they pay for a package, 10% hits your balance.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Bi-weekly unlock",
    text: "Elite packages — or 10 referrals — open two-week withdrawals.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Paystack checkout",
    text: "Register and pay through a trusted Nigerian payment rail.",
  },
];

const dayFlow = [
  {
    time: "Morning",
    title: "Open the app",
    text: "See your package, balance, and today’s task list in one place.",
  },
  {
    time: "Midday",
    title: "Complete tasks",
    text: "Tap through the checklist. When it’s done, your claim unlocks.",
  },
  {
    time: "Evening",
    title: "Claim your share",
    text: "One tap adds today’s portion of your month-end return to balance.",
  },
  {
    time: "Anytime",
    title: "Share your link",
    text: "Every confirmed registration pays you 10% of their entry amount.",
  },
];

const stories = [
  {
    name: "Adaeze O.",
    package: "Pulse",
    quote:
      "I joined on Pulse because the numbers were written plainly — entry, daily claim, month-end. I claim every evening after tasks.",
  },
  {
    name: "Chidi N.",
    package: "Elite",
    quote:
      "Moving to Elite gave me the two-week withdrawal window. That flexibility is why I stayed on the package.",
  },
  {
    name: "Fatima S.",
    package: "Rise",
    quote:
      "I referred friends into Spark and Rise. The 10% landed on my balance after each payment — simple and trackable.",
  },
  {
    name: "Emeka K.",
    package: "Prestige",
    quote:
      "Daily claim is just the return divided by 30. I check it, I claim it, I know exactly where my cycle stands.",
  },
];

function SlideIn({
  children,
  className,
  delay = 0,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={slideLeft}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <>
      <motion.header
        className="site-nav"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease }}
      >
        <a href="#top" className="brand-mark" aria-label="Trustvee Elite home">
          <Logo className="brand-logo" />
        </a>
        <div className="nav-actions">
          <Link className="nav-link" to="/login">
            Sign in
          </Link>
          <Link className="nav-cta" to="/register">
            Join
            <FaArrowRight size={12} aria-hidden />
          </Link>
        </div>
      </motion.header>

      <main id="top">
        {/* HERO */}
        <section className="hero" ref={heroRef} aria-labelledby="hero-brand">
          <div className="hero__copy">
            <motion.h1
              id="hero-brand"
              className="hero__brand"
              custom={0}
              variants={slideLeft}
              initial="hidden"
              animate="show"
            >
              Trustvee
              <span>Elite</span>
            </motion.h1>

            <motion.p
              className="hero__headline"
              custom={1}
              variants={slideLeft}
              initial="hidden"
              animate="show"
            >
              Your package. Your daily claim. Your schedule.
            </motion.p>

            <motion.p
              className="hero__support"
              custom={2}
              variants={slideLeft}
              initial="hidden"
              animate="show"
            >
              Register once, complete tasks each day, and claim a fixed share of
              your month-end return — built for phone-first members across
              Nigeria.
            </motion.p>

            <motion.div
              className="hero__actions"
              custom={3}
              variants={slideLeft}
              initial="hidden"
              animate="show"
            >
              <Link className="btn-primary" to="/register">
                See packages
                <FaArrowRight size={13} aria-hidden />
              </Link>
              <a className="btn-ghost" href="#how">
                How it works
              </a>
            </motion.div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <motion.img
              className="hero__visual-img"
              style={{ y: imageY, scale: imageScale }}
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt=""
              width={768}
              height={720}
            />
            <div className="hero__visual-fade" />
            <motion.div
              className="hero__visual-glow"
              animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </section>

        {/* HIGHLIGHTS CAROUSEL */}
        <section className="section section--carousel" aria-label="Platform highlights">
          <SlideIn>
            <p className="section__label">
              <FaMobileAlt aria-hidden /> Built for your phone
            </p>
            <h2 className="section__title">What you get from day one</h2>
            <p className="section__text">
              No vague promises — just membership mechanics you can follow:
              tasks, claims, referrals, and withdrawal rules.
            </p>
          </SlideIn>

          <Swiper
            className="tv-swiper"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.15}
            spaceBetween={14}
            centeredSlides={false}
            loop
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {highlights.map((item) => (
              <SwiperSlide key={item.title}>
                <article className="highlight-slide">
                  <div className="highlight-slide__icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how" aria-labelledby="how-title">
          <SlideIn>
            <p className="section__label">
              <FaClipboardList aria-hidden /> Process
            </p>
            <h2 className="section__title" id="how-title">
              How Trustvee Elite works
            </h2>
            <p className="section__text">
              One path from registration to withdrawal. Every step is tied to
              your active package.
            </p>
          </SlideIn>

          <div className="steps">
            {[
              {
                icon: <FaUserPlus aria-hidden />,
                title: "1. Choose and pay",
                text: "Pick Spark through Apex. Pay with Paystack. Your 30-day membership cycle starts when payment confirms.",
              },
              {
                icon: <FaClipboardList aria-hidden />,
                title: "2. Do the day’s tasks",
                text: "Open your checklist, complete each item, and unlock the claim button for that day.",
              },
              {
                icon: <FaWallet aria-hidden />,
                title: "3. Claim daily",
                text: "Your daily amount is month-end return ÷ 30. Claim it once per day into your balance.",
              },
              {
                icon: <FaCalendarAlt aria-hidden />,
                title: "4. Withdraw on schedule",
                text: "From ₦15,000: month-end for standard members, or every two weeks if you’re Elite-tier or hit 10 referrals.",
              },
            ].map((step, i) => (
              <motion.article
                className="step"
                key={step.title}
                custom={i}
                variants={slideLeft}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <div className="step__icon">{step.icon}</div>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* DAY FLOW CAROUSEL */}
        <section className="section section--muted" aria-labelledby="day-title">
          <SlideIn>
            <p className="section__label">
              <FaClipboardCheck aria-hidden /> Daily rhythm
            </p>
            <h2 className="section__title" id="day-title">
              A day on Trustvee Elite
            </h2>
            <p className="section__text">
              Designed so activity stays light — but consistent enough to unlock
              your claim every day.
            </p>
          </SlideIn>

          <Swiper
            className="tv-swiper"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.12}
            spaceBetween={14}
            loop
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {dayFlow.map((item) => (
              <SwiperSlide key={item.title}>
                <article className="day-slide">
                  <span className="day-slide__time">{item.time}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* PACKAGES CAROUSEL + LIST */}
        <section
          className="section"
          id="packages"
          aria-labelledby="packages-title"
        >
          <SlideIn>
            <p className="section__label">
              <FaLock aria-hidden /> Membership tiers
            </p>
            <h2 className="section__title" id="packages-title">
              Packages with numbers you can trust
            </h2>
            <p className="section__text">
              Entry fee. Month-end return. Daily claim. Swipe through each tier
              — Elite and above include bi-weekly withdrawal.
            </p>
          </SlideIn>

          <Swiper
            className="tv-swiper tv-swiper--packages"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.08}
            spaceBetween={14}
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <article
                  className={`package-slide${pkg.elite ? " package-slide--elite" : ""}`}
                >
                  <div className="package-slide__top">
                    <h3>{pkg.name}</h3>
                    {pkg.elite ? (
                      <span className="package-row__elite">Bi-weekly</span>
                    ) : (
                      <span className="package-slide__tag">Monthly</span>
                    )}
                  </div>
                  <p className="package-slide__entry">
                    Entry <strong>{formatNaira(pkg.entry)}</strong>
                  </p>
                  <div className="package-slide__grid">
                    <div>
                      <span>Daily claim</span>
                      <strong>{formatNaira(dailyClaim(pkg.returnAmount))}</strong>
                    </div>
                    <div>
                      <span>Month end</span>
                      <strong>{formatNaira(pkg.returnAmount)}</strong>
                    </div>
                  </div>
                  <Link
                    className="btn-primary package-slide__cta"
                    to={`/register?package=${pkg.id}`}
                  >
                    Join {pkg.name}
                    <FaArrowRight size={13} aria-hidden />
                  </Link>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <SlideIn delay={1} className="package-compare-wrap">
            <h3 className="subsection-title">Full comparison</h3>
            <div className="package-list">
              {packages.map((pkg, i) => (
                <motion.div
                  className="package-row"
                  key={pkg.id}
                  custom={i}
                  variants={slideLeft}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                >
                  <div>
                    <div className="package-row__name">
                      {pkg.name}
                      {pkg.elite ? (
                        <span className="package-row__elite">Bi-weekly</span>
                      ) : null}
                    </div>
                    <p className="package-row__meta">
                      Entry {formatNaira(pkg.entry)} · Daily{" "}
                      {formatNaira(dailyClaim(pkg.returnAmount))}
                    </p>
                  </div>
                  <div className="package-row__return">
                    <strong>{formatNaira(pkg.returnAmount)}</strong>
                    <span>month end</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="packages-note">
              <FaInfoCircle size={15} aria-hidden />
              <span>
                Daily claim = month-end return ÷ 30. Minimum withdrawal is
                ₦15,000 for every member.
              </span>
            </p>
          </SlideIn>
        </section>

        {/* WITHDRAWAL */}
        <section className="section section--muted" id="withdraw" aria-labelledby="withdraw-title">
          <SlideIn>
            <p className="section__label">
              <FaWallet aria-hidden /> Withdrawals
            </p>
            <h2 className="section__title" id="withdraw-title">
              When you can cash out
            </h2>
            <p className="section__text">
              Same minimum for everyone. The only difference is how often the
              window opens.
            </p>
          </SlideIn>

          <div className="rule-stack">
            <SlideIn delay={0}>
              <article className="rule-block">
                <h3>Standard schedule</h3>
                <p>
                  Spark, Rise, or Pulse with fewer than 10 referrals — withdraw
                  at <strong>month end</strong>, from ₦15,000.
                </p>
              </article>
            </SlideIn>
            <SlideIn delay={1}>
              <article className="rule-block rule-block--accent">
                <h3>Flexible schedule</h3>
                <p>
                  Elite, Prestige, Apex — or any package after <strong>10
                  referrals</strong> — withdraw every <strong>two weeks</strong>,
                  from ₦15,000.
                </p>
              </article>
            </SlideIn>
            <SlideIn delay={2}>
              <article className="rule-block">
                <h3>Want bi-weekly sooner?</h3>
                <p>
                  Upgrade to Elite and above, or grow your referral count to 10.
                  That’s the unlock — nothing else.
                </p>
              </article>
            </SlideIn>
          </div>
        </section>

        {/* REFERRALS */}
        <section className="section" id="referrals" aria-labelledby="referral-title">
          <SlideIn>
            <p className="section__label">
              <FaUserFriends aria-hidden /> Referrals
            </p>
            <h2 className="section__title" id="referral-title">
              Bring people in. Get 10% on their entry.
            </h2>
            <p className="section__text">
              Your link. Their package payment. Your bonus — credited when
              Paystack confirms.
            </p>
          </SlideIn>

          <motion.aside
            className="referral"
            variants={slideLeft}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <h3 className="referral__title">Real example</h3>
            <p className="referral__text">
              Someone registers on Pulse at ₦10,000 with your code — you receive
              ₦1,000 in your balance. Apex at ₦100,000 → you receive ₦10,000.
            </p>
            <div className="referral__points">
              <div className="referral__point">
                <FaGift size={15} aria-hidden />
                <span>Bonus = 10% of whatever package they join with.</span>
              </div>
              <div className="referral__point">
                <FaCheckCircle size={15} aria-hidden />
                <span>
                  Hit 10 successful referrals and unlock bi-weekly withdrawals
                  even on Spark, Rise, or Pulse.
                </span>
              </div>
            </div>
          </motion.aside>

          <Swiper
            className="tv-swiper tv-swiper--tight"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.15}
            spaceBetween={12}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {packages.map((pkg) => (
              <SwiperSlide key={`ref-${pkg.id}`}>
                <article className="ref-earn-slide">
                  <span>If they join {pkg.name}</span>
                  <strong>You earn {formatNaira(pkg.entry * 0.1)}</strong>
                  <p>10% of {formatNaira(pkg.entry)} entry</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* STORIES CAROUSEL */}
        <section className="section section--muted" aria-labelledby="stories-title">
          <SlideIn>
            <p className="section__label">
              <FaUserFriends aria-hidden /> Members
            </p>
            <h2 className="section__title" id="stories-title">
              Why people stay active
            </h2>
            <p className="section__text">
              Clear package math and a daily loop they can actually keep.
            </p>
          </SlideIn>

          <Swiper
            className="tv-swiper"
            modules={[Autoplay, Pagination]}
            slidesPerView={1.08}
            spaceBetween={14}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {stories.map((story) => (
              <SwiperSlide key={story.name}>
                <blockquote className="story-slide">
                  <p>“{story.quote}”</p>
                  <footer>
                    <strong>{story.name}</strong>
                    <span>{story.package} member</span>
                  </footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* TRUST / SECURITY */}
        <section className="section" aria-labelledby="trust-title">
          <SlideIn>
            <p className="section__label">
              <FaShieldAlt aria-hidden /> Confidence
            </p>
            <h2 className="section__title" id="trust-title">
              Built to feel straightforward
            </h2>
          </SlideIn>

          <div className="trust-grid">
            {[
              {
                icon: <FaShieldAlt />,
                title: "Paystack payments",
                text: "Registration fees go through Paystack — familiar checkout, confirmed before your cycle starts.",
              },
              {
                icon: <FaLock />,
                title: "Visible package rules",
                text: "Entry, return, daily claim, and withdrawal windows are published on every tier.",
              },
            ].map((item, i) => (
              <motion.article
                className="trust-item"
                key={item.title}
                custom={i}
                variants={slideLeft}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <div className="trust-item__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing" id="join" aria-labelledby="closing-title">
          <motion.div
            variants={slideLeft}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <h2 className="closing__title" id="closing-title">
              Start on the package that fits you
            </h2>
            <p className="closing__text">
              From Spark at ₦3,000 to Apex at ₦100,000 — pick a tier, pay with
              Paystack, and claim tomorrow’s share after your tasks.
            </p>
            <Link className="btn-primary" to="/register">
              Choose your package
              <FaArrowRight size={13} aria-hidden />
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="site-footer">
        <Logo className="footer-logo" />
        <span>Membership · Daily tasks · Referral rewards</span>
        <span>© {new Date().getFullYear()} Trustvee Elite</span>
      </footer>
    </>
  );
}
