"use client";

import Image from "next/image";
import { MapPin, Linkedin } from "lucide-react";
import type { WPTeamMember } from "@/types/team";

interface TeamCardProps {
  member: WPTeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  const image = member._embedded?.["wp:featuredmedia"]?.[0];
  const { acf } = member;

  return (
    <div className="craft-card corner-brackets p-7 text-center group">
      <div className="relative h-20 w-20 rounded-sm overflow-hidden mx-auto mb-5 bg-surface border border-border/30">
        {image ? (
          <Image
            src={image.source_url}
            alt={image.alt_text || member.title.rendered}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-display text-xl font-800 text-primary/15">
              {member.title.rendered[0]}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-display text-base font-700 tracking-[-0.02em]">
        {member.title.rendered}
      </h3>
      <p className="text-xs text-primary font-600 mt-1 tracking-wide">{acf.position}</p>

      {acf.location && (
        <p className="text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1 tracking-[0.1em] uppercase">
          <MapPin className="h-3 w-3" />
          {acf.location}
        </p>
      )}

      {acf.bio && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
          {acf.bio}
        </p>
      )}

      {acf.linkedin_url && (
        <a
          href={acf.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-primary font-600 hover:opacity-70"
          style={{ transition: "opacity 0.3s" }}
        >
          <Linkedin className="h-3.5 w-3.5" />
          LinkedIn
        </a>
      )}
    </div>
  );
}
