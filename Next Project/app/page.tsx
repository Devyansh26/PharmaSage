import { AppleCardsCarouselDemo } from "@/Components/cards";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div
          className="bg-gray-900 h-screen w-full flex items-center flex-col justify-center font-[Poppins] "
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <h1 className="scroll-m-20 mb-10 text-6xl font-extrabold tracking-tight lg:text-6xl">
            Unlocking the potential of technology
          </h1>

          <p className="text-gray-300 text-xl mb-8 max-w-2xl text-center px-6">
            AI-powered pharmaceutical solutions to streamline your workflow and
            enhance patient care
          </p>

          <Link href="/query">
            <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
              Get Started
            </span>
          </Link>
        </div>

        <div>
          <AppleCardsCarouselDemo />
        </div>
      </div>
    </>
  );
}
