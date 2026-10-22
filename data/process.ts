/**
 * The five-step build process shown in the "How We Work" timeline.
 *
 * `icon` stores the lucide-react icon *name* rather than the component so
 * this file stays free of React/JSX imports.
 */

/** Union of every lucide icon name used by the process steps. */
export type ProcessIconName =
  | "MessagesSquare"
  | "PenTool"
  | "FileCheck2"
  | "HardHat"
  | "KeyRound";

export interface ProcessStep {
  /** Stable slug — used as the React key. */
  id: string;
  /** Step heading. */
  title: string;
  /** One or two line summary shown under the heading. */
  description: string;
  /** lucide-react icon name (see `ProcessIconName`). */
  icon: ProcessIconName;
}

export const processSteps: ProcessStep[] = [
  {
    id: "consultation",
    title: "Consultation",
    description:
      "We meet on site, listen to your brief and walk you through realistic timelines and budgets.",
    icon: "MessagesSquare",
  },
  {
    id: "design",
    title: "Design",
    description:
      "Our architects and engineers turn your vision into detailed drawings, 3D views and a build plan.",
    icon: "PenTool",
  },
  {
    id: "approval",
    title: "Approval",
    description:
      "You sign off on every drawing, finish and cost line before a single brick is laid.",
    icon: "FileCheck2",
  },
  {
    id: "construction",
    title: "Construction",
    description:
      "Our own crews execute the build with daily site updates, strict quality checks and safety protocols.",
    icon: "HardHat",
  },
  {
    id: "handover",
    title: "Handover",
    description:
      "Final snagging, complete documentation and a walkthrough before we hand the keys over to you.",
    icon: "KeyRound",
  },
];
