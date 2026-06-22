import JobDetailScreen from "../../../components/JobDetailScreen";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailScreen jobId={params.id} />;
}
