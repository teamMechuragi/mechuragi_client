export async function generateStaticParams() {
  // Generate a placeholder page for static export
  return [{ id: '1' }];
}

export default function CommunityDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
