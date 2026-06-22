import OpportunityDetailScreen from "../../../components/OpportunityDetailScreen";

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return <OpportunityDetailScreen opportunityId={params.id} />;
}
