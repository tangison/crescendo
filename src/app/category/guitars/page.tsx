import { redirect } from 'next/navigation';

// Guitars merged into Strings — redirect old category URL
export default function GuitarsRedirectPage() {
  redirect('/category/strings');
}
