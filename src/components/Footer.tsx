import { EMAIL, NAME } from "@/Data";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} {NAME}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${EMAIL}`} className="hover:text-primary transition-colors">{EMAIL}</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}