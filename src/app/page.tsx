import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="m-4">
      <h1>Home page content</h1>      
    </div>
  );
}