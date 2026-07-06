import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0a0a0a",
            borderRadius: "0.75rem",
          },
        }}
      />
    </main>
  );
}
