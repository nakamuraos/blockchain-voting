"use client";

import Card from "@/components/home/card";
import Balancer from "react-wrap-balancer";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>Voting for the picture you like.</Balancer>
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>A electoral system based blockchain.</Balancer>
        </p>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {Array.from(Array(30).keys())
          .map((e, index) => ({
            title: "The cat on the table",
            description:
              "Precedent comes with authentication and database via",
            demo: (
              <div className="flex flex-1 items-center justify-center space-x-20">
                <Image
                  style={{ flex: 1 }}
                  alt="Auth.js logo"
                  src={`https://picsum.photos/400/500?random=${index}`}
                  width={300}
                  height={400}
                />
              </div>
            ),
            large: false,
          }))
          .map(({ title, description, demo, large }, index) => (
            <Card
              key={title + index}
              title={title}
              description={description}
              demo={
                title === "Beautiful, reusable components" ? (
                  <ComponentGrid />
                ) : (
                  demo
                )
              }
              large={large}
            />
          ))}
      </div>
    </>
  );
}
