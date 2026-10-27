import { Card, RoleTag } from '../../components/ui';
import { initials } from '../../lib/format';

interface ProfilCardProps {
  displayName: string;
  avatarUrl: string;
  role: string;
}

export default function ProfilCard({ displayName, avatarUrl, role }: ProfilCardProps) {
  const isAdmin = role === 'admin';

  return (
    <Card className="flex flex-col items-center gap-4 py-8 text-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`Avatar ${displayName}`}
          className="h-24 w-24 rounded-2xl object-cover border-2 border-gray-200 shadow-2xs"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-3xl font-bold text-white shadow-2xs"
        >
          {initials(displayName)}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="font-display text-lg font-bold text-[#1D3557] truncate">
          {displayName}
        </h3>
        <div className="mt-2">
          <RoleTag role={isAdmin ? 'ADMIN' : 'POOL_MANAGER'}>
            {isAdmin ? 'Super Admin' : 'Pengelola Kolam'}
          </RoleTag>
        </div>
      </div>
    </Card>
  );
}
