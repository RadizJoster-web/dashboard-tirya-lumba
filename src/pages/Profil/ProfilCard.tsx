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
    <Card bodyClassName="flex flex-col items-center text-center p-6 sm:p-8">
      {/* Avatar Container */}
      <div className="relative mb-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`Avatar ${displayName}`}
            className="h-28 w-28 rounded-2xl object-cover border-4 border-white shadow-md ring-2 ring-gray-100"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-3xl font-extrabold text-white shadow-md ring-2 ring-[#00B4D8]/20"
          >
            {initials(displayName)}
          </span>
        )}
      </div>

      {/* Name and Role */}
      <div className="w-full min-w-0">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#1D3557] truncate px-2">
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isAdmin ? 'Administrator Akun' : 'Akun Pengelola Cabang'}
        </p>
        <div className="mt-3.5 flex justify-center">
          <RoleTag role={isAdmin ? 'ADMIN' : 'POOL_MANAGER'}>
            {isAdmin ? 'Super Admin' : 'Pengelola Kolam'}
          </RoleTag>
        </div>
      </div>
    </Card>
  );
}
