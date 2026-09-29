import { clientConfig } from "@/client.config";
import Card from "@selected-card"; // = templates/<registry[template]>, resolved at build time

export default function Home() {
  return <Card config={clientConfig} />;
}
