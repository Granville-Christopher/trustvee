import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Logo from "./Logo";

const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <header className="auth-top">
        <Link to="/" className="auth-brand" aria-label="Trustvee Elite home">
          <Logo className="auth-logo" />
        </Link>
      </header>

      <main className="auth-main">
        <motion.div
          className="auth-intro"
          custom={0}
          variants={slideLeft}
          initial="hidden"
          animate="show"
        >
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </motion.div>

        <motion.div
          custom={1}
          variants={slideLeft}
          initial="hidden"
          animate="show"
        >
          {children}
        </motion.div>

        {footer ? (
          <motion.div
            className="auth-footer"
            custom={2}
            variants={slideLeft}
            initial="hidden"
            animate="show"
          >
            {footer}
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}
