import { Card, RoleTag } from '../../components/ui';
import { initials } from '../../lib/format';

interface ProfilCardProps {
  displayName: string;
  avatarUrl: string;
  role: string;
}

export default function ProfilCard({ displayName, avatarUrl, role }: ProfilCardProps) {
  return (
    <Card className="flex flex-col items-center gap-3 py-6 text-center">
      {avatarUrl ? (
        <img src={avatarUrl} alt={`Avatar ${displayName}`} className="h-24 w-24 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="grid h-24 w-24 place-items-center rounded-full bg-azure font-display text-2xl font-bold text-primary">
          {initials(displayName)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-semibold">{displayName}</p>
        <div className="mt-1.5">
          <RoleTag>{role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
        </div>
      </div>
    </Card>
  );
}
