import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";

import { loadStats, titleCase } from "#lib/stats";

import {
  socials,
  cpPlatforms,
  cpFallbacks,
  cpStatMeta,
} from "#constants/content";

import {
  windowTitles,
  cpCopy,
} from "#constants/ui";

import CFAnalytics from "./CFAnalytics";


const CP = () => {
  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);


  const cf =
    stats?.codeforces;

  const cc =
    stats?.codechef;

  const lc =
    stats?.leetcode;


  const cards = [
    {
      ...cpPlatforms[0],

      rating:
        cf?.rating ?? 0,

      rank:
        titleCase(
          cf?.rank ??
            cpFallbacks.cfRank
        ),

      extra:
        `Max ${
          cf?.maxRating ?? 0
        }`,

      link:
        socials.find(
          (s) =>
            s.text ===
            "Codeforces"
        )?.link,
    },

    {
      ...cpPlatforms[1],

      rating:
        cc?.rating ?? 0,

      rank:
        `${cc?.stars ??
          cpFallbacks.ccStars}★`,

      extra:
        `Max ${
          cc?.maxRating ?? 0
        }`,

      link:
        socials.find(
          (s) =>
            s.text ===
            "CodeChef"
        )?.link,
    },

    {
      ...cpPlatforms[2],

      rating:
        lc?.solved ?? 0,

      rank:
        cpCopy.solved,

      extra:
        `${lc?.easy ?? 0}E · ${
          lc?.medium ?? 0
        }M · ${
          lc?.hard ?? 0
        }H`,

      link:
        socials.find(
          (s) =>
            s.text ===
            "LeetCode"
        )?.link,
    },
  ];


  return (
    <WindowFrame
      windowKey="cp"
      title={windowTitles.cp}
      icon={
        <Lucide
          name="trophy"
          size={13}
        />
      }
    >

      <div className="h-full overflow-y-auto p-5">

        {/* =================================================
            Platform cards
        ================================================= */}

        <div className="mb-5 grid gap-3 sm:grid-cols-3">

          {cards.map(
            (card, index) => (

              <motion.a
                key={card.key}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.06,
                }}
                className="glass group rounded-2xl p-4 transition hover:bg-white/10"
              >

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[var(--text)]">
                    {card.name}
                  </span>

                  <Lucide
                    name={
                      card.icon
                    }
                    size={16}
                    style={{
                      color:
                        card.color,
                    }}
                  />

                </div>


                <div className="mt-3 font-mono text-3xl font-bold text-[var(--text)]">
                  {card.rating}
                </div>


                <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">

                  <span className="font-medium text-emerald-400">
                    {card.rank}
                  </span>

                  <span>
                    · {card.extra}
                  </span>

                </div>


                <div className="mt-2 text-[11px] text-[var(--text-faint)] opacity-0 transition group-hover:opacity-100">
                  {cpCopy.viewProfile}
                </div>

              </motion.a>

            )
          )}

        </div>


        {/* =================================================
            Stats cards
        ================================================= */}

        <div className="mb-5 grid gap-3 sm:grid-cols-3">

          {cpStatMeta
            .map(
              (meta, index) => ({
                ...meta,

                value: [
                  `${stats?.static
                    ?.problemsSolved ??
                    0}+`,

                  cf?.contests ?? 0,

                  titleCase(
                    cf?.maxRank ??
                      cpFallbacks
                        .cfRank
                  ),
                ][index],
              })
            )
            .map(
              (
                stat,
                index
              ) => (

                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      0.2 +
                      index *
                        0.06,
                  }}
                  className="glass flex items-center gap-3 rounded-2xl p-4"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">

                    <Lucide
                      name={
                        stat.icon
                      }
                      size={18}
                    />

                  </div>


                  <div>

                    <div className="font-mono text-lg font-bold text-[var(--text)]">
                      {stat.value}
                    </div>

                    <div className="text-[11px] text-[var(--text-muted)]">
                      {stat.label}
                    </div>

                  </div>

                </motion.div>

              )
            )}

        </div>


        {/* =================================================
            CF Analytics
        ================================================= */}

        <CFAnalytics
          codeforces={cf}
        />

      </div>

    </WindowFrame>
  );
};


export default CP;