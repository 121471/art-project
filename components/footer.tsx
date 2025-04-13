export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-muted-foreground">
              A platform for artists to showcase their work and connect with art enthusiasts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://twitter.com" className="hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="hover:text-primary">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" className="hover:text-primary">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Art Project. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 