import { NavigationHeader } from "@/components/navigation";

function Page() {
  return (
    <>
      <NavigationHeader className="z-30" />
      <div className="size-full flex min-h-0">
        <p>Hey there fella!</p>
      </div>
    </>
  );
}

export default Page;
