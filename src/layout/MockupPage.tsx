import { useParams } from "react-router-dom";

export default function MockupPage() {
  const { name } = useParams<{ name: string }>();

  return (
    <iframe
      src={`/mockups/${name}.html`}
      title={name}
      className="h-screen w-screen border-0"
    />
  );
}
