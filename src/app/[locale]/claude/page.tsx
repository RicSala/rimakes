import { redirect } from 'next/navigation';

// Short link for workshop attendees: /claude -> the current session deck (viewer).
// Update the target slug when the live session deck changes.
export default function ClaudePage() {
  redirect('/present/intro-to-synced-slides');
}
