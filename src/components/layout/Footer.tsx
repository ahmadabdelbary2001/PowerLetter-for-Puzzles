export default function Footer() { 
  return ( 
    <footer className="site-footer">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
          <div className="space-y-4"> 
            <div className="flex items-center gap-2"> 
              <div className="text-2xl font-bold gradient-gold text-transparent bg-clip-text">⚡</div> 
              <h3 className="text-xl font-bold gradient-gold text-transparent bg-clip-text">PowerLetter</h3> 
            </div> 
            <p className="text-muted-foreground text-sm max-w-xs"> 
              Educational puzzle game for word enthusiasts. Challenge your mind with engaging word puzzles in multiple languages. 
            </p> 
            <div className="flex space-x-4 pt-2"> 
              {["twitter", "facebook", "instagram"].map((social) => ( 
                <a  
                  key={social} 
                  href="#"  
                  className="text-muted-foreground hover:text-primary transition-colors duration-200" 
                  aria-label={`Follow us on ${social}`} 
                > 
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors"> 
                    <div className="w-4 h-4 gradient-gold rounded-sm opacity-70"></div> 
                  </div> 
                </a> 
              ))} 
            </div> 
          </div> 

          <div> 
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3> 
            <ul className="space-y-3 text-sm"> 
              {[ 
                { name: "About Us", href: "#" }, 
                { name: "Privacy Policy", href: "#" }, 
                { name: "Terms of Service", href: "#" }, 
                { name: "FAQ", href: "#" } 
              ].map((link, index) => ( 
                <li key={index}> 
                  <a  
                    href={link.href}  
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group" 
                  > 
                    <span>{link.name}</span> 
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span> 
                  </a> 
                </li> 
              ))} 
            </ul> 
          </div> 

          <div> 
            <h3 className="text-lg font-semibold mb-4">Contact</h3> 
            <ul className="space-y-3 text-sm"> 
              <li className="flex items-start gap-2"> 
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0"> 
                  <div className="w-2 h-2 bg-primary rounded-full"></div> 
                </div> 
                <span className="text-muted-foreground">support@powerletter.com</span> 
              </li> 
              <li className="flex items-start gap-2"> 
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0"> 
                  <div className="w-2 h-2 bg-primary rounded-full"></div> 
                </div> 
                <span className="text-muted-foreground">+1 (123) 456-7890</span> 
              </li> 
              <li className="pt-2"> 
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-gold/10 text-xs font-medium"> 
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 
                  <span>Available for support</span> 
                </div> 
              </li> 
            </ul> 
          </div> 
        </div> 

        <div className="border-t border-border/40 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"> 
          <div> 
            © {new Date().getFullYear()} PowerLetter. All rights reserved. 
          </div> 
          <div className="flex items-center gap-4"> 
            <div className="flex items-center gap-1.5"> 
              <div className="w-2 h-2 gradient-gold rounded-full"></div> 
              <span>Version 1.0.0</span> 
            </div> 
            <div className="hidden sm:block h-4 w-px bg-border"></div> 
            <div className="flex items-center gap-1.5"> 
              <span>Made with</span> 
              <span className="text-red-500">❤️</span> 
              <span>by PowerLetter Team</span> 
            </div> 
          </div> 
        </div> 
      </div> 
    </footer> 
  ); 
}
