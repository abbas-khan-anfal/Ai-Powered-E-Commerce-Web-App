'use client';
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-muted text-foreground pt-10 pb-5 px-5">
      
      {/* Top Section */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Logo + Description */}
        <div>
          <Link href="/">
            <Image
              src="/b-logo.png"
              alt="logo"
              width={150}
              height={40}
              className="object-contain mb-3"
            />
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            Discover quality products with a smarter AI-powered shopping experience.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/Shop" className="hover:text-primary transition">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
          <div className="flex gap-4 text-xl">
            <Link href="#" className="hover:text-blue-500 transition">
              <FaFacebook />
            </Link>
            <Link href="#" className="hover:text-sky-400 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="hover:text-blue-700 transition">
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6"></div>

      {/* Bottom Section */}
      <div className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} E-Shop. All rights reserved. Powered by Abbas Khan with Love 💔
      </div>
    </footer>
  );
}

export default Footer;