export default function NotFound() {
  return (
    <section className="relative grid gap-3 px-4 pt-4">
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="p-6 text-2xl font-semibold text-blohsh-foreground">
            Page Not Found
          </h1>
          <p className="text-blohsh-foreground/70">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};
