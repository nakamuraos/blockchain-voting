import Navbar from "./navbar";

export default async function Nav({ session }: { session: any }) {
  return <Navbar session={session} />;
}
