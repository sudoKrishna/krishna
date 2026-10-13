"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Bell, Check, Copy, Disc3, ExternalLink, GripHorizontal, Images } from "lucide-react";

import TwitterCard from "./TwitterCard";
import { ProjectAction, ProjectCard } from "./ProjectCard";
import { ToastDemo } from "./ToastDemo";
import { VinylCard } from "./VinylCard";
import { PhotoGallery } from "./PhotoGallery";
import { Editor } from "@/components/editor";
import { Toasts } from "@/components/ui/toast";

type CardKey = "editor" | "x" | "toast" | "vinyl" | "gallery";

const TRACKS = [
  {
    title: "Paint The Town Red",
    artist: "Doja Cat",
    cover: "/covers/artwork.jpg",
    src: "/audio/paint-the-town-red.mp3",
  },
  {
    title: "Diamonds",
    artist: "Rihanna",
    cover: "/covers/diamonds.webp",
    src: "/audio/diamonds.mp3",
  },
  {
    title: "Jaatta Ka Chhora",
    artist: "Mika Singh",
    cover: "/covers/jaatta.webp",
    src: "/audio/jaatta-ka-chhora.mp3",
  },
];

function ReorderCard({ value, children }: { value: CardKey; children: React.ReactNode }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.03, zIndex: 40 }}
      className="relative shrink-0"
    >
      {/* drag handle */}
      <div className="absolute -top-3.5 left-1/2 z-20 flex -translate-x-1/2 items-center">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(event) => controls.start(event)}
          className="flex h-7 w-9 cursor-grab touch-none items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-colors hover:bg-black active:cursor-grabbing"
        >
          <GripHorizontal size={15} />
        </button>
      </div>

      {children}
    </Reorder.Item>
  );
}

export function CardRow() {
  const [order, setOrder] = useState<CardKey[]>(["editor", "x", "toast", "vinyl", "gallery"]);

  return (
    <>
      <div>
        <Reorder.Group
          axis="x"
          values={order}
          onReorder={setOrder}
          className="flex w-full flex-nowrap items-start gap-10 overflow-x-auto pt-6 pb-24 pl-[490px] pr-[490px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {order.map((key) => (
            <ReorderCard key={key} value={key}>
              {key === "editor" && (
                <ProjectCard
                  title="Editor"
                  actions={
                    <>
                      <ProjectAction label="Copy">
                        <Copy size={15} />
                      </ProjectAction>
                      <ProjectAction label="Done">
                        <Check size={15} />
                      </ProjectAction>
                    </>
                  }
                >
                  <Editor answer="Start with the smallest thing that works, then earn every abstraction you add on top of it.">
                    {"Select any of this text to format it, or hit Ask AI to ask a question about the selection. The toolbar follows your cursor and the answer streams in below."}
                  </Editor>
                </ProjectCard>
              )}

              {key === "x" && (
                <ProjectCard
                  title="X"
                  actions={
                    <ProjectAction label="Open on X" href="https://x.com/cha73066">
                      <ExternalLink size={15} />
                    </ProjectAction>
                  }
                >
                  <div style={{ zoom: 0.58 }}>
                    <TwitterCard />
                  </div>
                </ProjectCard>
              )}

              {key === "toast" && (
                <ProjectCard
                  title="Toast"
                  actions={
                    <ProjectAction label="Notify">
                      <Bell size={15} />
                    </ProjectAction>
                  }
                >
                  <ToastDemo />
                </ProjectCard>
              )}

              {key === "vinyl" && (
                <ProjectCard
                  title="Vinyl"
                  actions={
                    <ProjectAction label="Play">
                      <Disc3 size={15} />
                    </ProjectAction>
                  }
                >
                  <VinylCard tracks={TRACKS} />
                </ProjectCard>
              )}

              {key === "gallery" && (
                <ProjectCard
                  title="Gallery"
                  actions={
                    <ProjectAction label="Photos">
                      <Images size={15} />
                    </ProjectAction>
                  }
                >
                  <PhotoGallery
                    images={[
                      "/photos/one.jpg",
                      "/photos/two.jpg",
                      "/photos/three.jpg",
                      "/photos/four.webp",
                      "/photos/five.jpg",
                    ]}
                  />
                </ProjectCard>
              )}
            </ReorderCard>
          ))}
        </Reorder.Group>
      </div>

      <Toasts />
    </>
  );
}
