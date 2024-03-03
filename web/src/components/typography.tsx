import { cn } from "../lib/utils";
const TypographyH1 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <h1
      className={cn(
        "text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl",
        className
      )}
    >
      {text}
    </h1>
  );
};

const TypographyH2 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "pb-2 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0",
        className
      )}
    >
      {text}
    </h2>
  );
};

const TypographyH3 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold tracking-tight scroll-m-20",
        className
      )}
    >
      {text}
    </h3>
  );
};

const TypographyH4 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <h4
      className={cn(
        "text-xl font-semibold tracking-tight scroll-m-20",
        className
      )}
    >
      {text}
    </h4>
  );
};

const TypographyP = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {text}
    </p>
  );
};

const Typography = ({
  variant,
  text,
  className,
}: {
  text: string;
  variant: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
}) => {
  return (
    <div>
      {variant === "h1" && <TypographyH1 text={text} className={className} />}
      {variant === "h2" && <TypographyH2 text={text} className={className} />}
      {variant === "h3" && <TypographyH3 text={text} className={className} />}
      {variant === "h4" && <TypographyH4 text={text} className={className} />}
      {variant === "p" && <TypographyP text={text} className={className} />}
    </div>
  );
};

export default Typography;
