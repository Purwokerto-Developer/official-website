'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Session } from '@/types/better-auth';
import Link from 'next/link';
import { Edit } from 'iconsax-reactjs'; // pastikan iconsax-react terinstall: npm i iconsax-react

const ProfileCard = ({ session }: { session?: Session | null }) => {
  if (!session) return null;

  const profileRaw: any =
    (session as any).profile || (session.user as any).profile || session.user || {};

  const avatar = session.user?.image || profileRaw?.avatar_url || profileRaw?.avatar || '';
  const displayName =
    session.user?.name || profileRaw?.display_name || profileRaw?.displayName || 'User';
  const email = session.user?.email || '';
  const role = profileRaw?.community_role || profileRaw?.role || '';
  const isVerified = profileRaw?.is_verified || profileRaw?.isVerified || false;
  const level = profileRaw?.level ?? profileRaw?.xp ?? null;
  const location = profileRaw?.location || '';

  const year = profileRaw?.created_at
    ? new Date(profileRaw.created_at).getFullYear()
    : profileRaw?.createdAt
      ? new Date(profileRaw.createdAt).getFullYear()
      : new Date().getFullYear();

  return (
    <Card className="bg-background relative w-full rounded-xl border shadow-sm">
      {/* Tombol edit (icon only) */}
      <Link
        href="/u/profile"
        className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 rounded-full p-2 transition-colors"
      >
        <Edit size="20" variant="Bulk" />
      </Link>

      <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Avatar */}
        <div className="ring-offset-background flex-shrink-0 overflow-hidden rounded-full ring-2 ring-sky-300/40 ring-offset-2">
          {avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center bg-slate-600 text-lg font-semibold text-white">
              {String(displayName).slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base leading-tight font-semibold">{displayName}</h2>
            {isVerified && (
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                Verified
              </span>
            )}
            {level && (
              <span className="bg-muted rounded-md px-2 py-0.5 text-xs font-medium">
                Lv. {level}
              </span>
            )}
          </div>

          {email && <p className="text-muted-foreground truncate text-sm">{email}</p>}

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
            {role && <span className="bg-muted rounded-full px-2 py-0.5">{role}</span>}
            {location && <span>· {location}</span>}
            <span>· Member since {year}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
