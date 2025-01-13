import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@nextui-org/react";

export const HoverEffect = ({
  items,
  className,
  handleSelect,
  selectedItem,
}: {
  items: {
    value: string;
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
  handleSelect: (value: string) => void;
  selectedItem: string | null;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.value}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            onSelect={() => handleSelect(item.value)}
            selected={selectedItem === item.value}
          >
            <Cardvalue>{item.title}</Cardvalue>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
    className,
    children,
    onSelect,
    selected,
  }: {
    className?: string;
    children: React.ReactNode;
    onSelect: () => void;
    selected: boolean;
  }) => {
    return (
      <div
        className={cn(
          "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative flex flex-col justify-between", // added flex styles
          className
        )}
        style={{ width: '350px', height: '250px' }}
      >
        <div>
          <div className="p-4">{children}</div>
        </div>
        <Button
          className="py-1 px-3 rounded-md"
          variant="flat"
          color={selected ? "success" : "danger"}
          onClick={onSelect}
        >
          {selected ? "Selected" : "Select"}
        </Button>
      </div>
    );
  };
  

export const Cardvalue = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};