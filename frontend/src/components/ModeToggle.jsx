import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const isDark = theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark"));
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      // Synchronously force the class change for a perfect snapshot
      const root = window.document.documentElement;
      root.classList.remove(isDark ? "dark" : "light");
      root.classList.add(nextTheme);
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      // Top right corner
      const x = window.innerWidth;
      const y = 0;

      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full w-9 h-9 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
