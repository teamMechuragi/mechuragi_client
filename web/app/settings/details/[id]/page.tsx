import EditDetailsClient from "./EditDetailsClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditDetailsPage({ params }: PageProps) {
  return <EditDetailsClient id={params.id} />;
}
