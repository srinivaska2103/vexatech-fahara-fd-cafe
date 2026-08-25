import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root page to the Cafe Owner Portal login / dashboard
  redirect('/owner/dashboard');
}
