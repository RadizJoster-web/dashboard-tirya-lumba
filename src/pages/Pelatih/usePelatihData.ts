import { useCallback, useMemo, useState } from 'react';
import { apiGet } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type {
  ServerInstructor,
  ServerInstructorDetail,
} from '../../lib/api/types';

const fetchInstructors = (): Promise<ServerInstructor[]> =>
  apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100');

export function usePelatihData() {
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, loading: isLoading } = useResource(
    '/instructor/management?page=1&limit=100',
    fetchInstructors,
  );
  const instructors = useMemo(() => data ?? [], [data]);

  const detailFetcher = useCallback(
    () =>
      detailId
        ? apiGet<ServerInstructorDetail>(
            `/instructor/management/${detailId}`,
          )
        : Promise.resolve(null),
    [detailId],
  );

  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useResource(`instructor-detail:${detailId ?? 'none'}`, detailFetcher);

  return {
    instructors,
    isLoading,
    detail,
    detailLoading,
    detailError,
    reloadDetail,
    detailId,
    setDetailId,
  };
}
