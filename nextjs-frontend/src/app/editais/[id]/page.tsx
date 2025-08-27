import { EditalDetail } from '@/components/EditalDetail';

export default function EditalDetailPage({ params }: { params: { id: string } }) {
  return <EditalDetail id={params.id} />;
}

