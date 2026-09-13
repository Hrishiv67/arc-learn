/** Public course access while account setup is optional. Personal data remains protected by Supabase RLS. */
export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
