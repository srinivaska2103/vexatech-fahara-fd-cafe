import { redirect } from 'next/navigation';

export default function SettingsIndexPage() {
  // Redirect base /settings to the first tab (profile)
  redirect('/owner/settings/profile');
}
