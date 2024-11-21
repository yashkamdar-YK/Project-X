import DashboardNav from "./_component/DashboardNAv"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
    <DashboardNav/>
        {children}
    </section>
  )
}
